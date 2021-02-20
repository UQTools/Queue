import {
    Arg,
    Ctx,
    Field,
    FieldResolver,
    InputType,
    Mutation,
    Resolver,
    Root,
} from "type-graphql";
import { CourseUserMeta, Question, Queue, Room, User } from "../entities";
import { MyContext } from "../types/context";
import { getRepository } from "typeorm";
import { QuestionStatus } from "../types/question";
import { permissionDeniedMsg } from "../../constants";
import { QueueAction, QueueSortType, QueueTheme } from "../types/queue";
import { getCourseStaff } from "../utils/course-staff";

@InputType()
class QueueInput {
    @Field()
    name: string;

    @Field(() => [String])
    examples: string[];

    @Field(() => QueueTheme)
    theme: QueueTheme;

    @Field(() => QueueSortType)
    sortedBy: QueueSortType;

    @Field(() => [QueueAction])
    actions: QueueAction[];

    @Field()
    clearAfterMidnight: boolean;
}

@Resolver(() => Queue)
export class QueueResolver {
    @Mutation(() => Question)
    async askQuestion(
        @Arg("queueId") queueId: string,
        @Ctx() { req }: MyContext
    ): Promise<Question> {
        let queue: Queue;
        try {
            queue = await Queue.findOneOrFail({ id: queueId });
        } catch (e) {
            throw new Error("Cannot find queue");
        }
        // Disallow joining multiple queues of same course
        const course = await (await queue.room).course;
        // TODO: Check if student is enrolled in course
        const existingQueues = await getRepository(Queue)
            .createQueryBuilder("queue")
            .innerJoinAndSelect("queue.room", "room")
            .innerJoinAndSelect("room.course", "course")
            .innerJoinAndSelect("queue.questions", "question")
            .innerJoinAndSelect("question.asker", "asker")
            .where("asker.id = :userId", { userId: req.user.id })
            .andWhere("course.id = :courseId", { courseId: course.id })
            .getMany();
        if (existingQueues.length > 0) {
            throw new Error("You are already on a queue of this course");
        }
        const question = await Question.create({
            opId: req.user.id,
            queueId: queue.id,
        }).save();
        const courseUserMeta = await CourseUserMeta.findOne({
            userId: req.user.id,
        });
        if (!courseUserMeta) {
            // Create new metadata if none exists
            await CourseUserMeta.create({
                userId: req.user.id,
                courseId: course.id,
                questionsAsked: 0,
            }).save();
        }
        return question;
    }

    @Mutation(() => Question)
    async removeQuestion(
        @Arg("questionStatus", () => QuestionStatus)
        questionStatus: QuestionStatus,
        @Arg("questionId") questionId: string,
        @Arg("message", () => String, { nullable: true })
        message: string | undefined,
        @Ctx() { req }: MyContext
    ): Promise<Question> {
        if (questionStatus === QuestionStatus.OPEN) {
            throw new Error("You cannot reopen a closed question");
        }
        const user = req.user;
        let question: Question;
        try {
            question = await Question.findOneOrFail({ id: questionId });
        } catch (e) {
            throw new Error("Cannot find question");
        }
        const queue = await question.queue;
        const op = await question.op;
        const staffMembers = await getRepository(User)
            .createQueryBuilder("user")
            .innerJoinAndSelect("user.courseStaff", "courseStaff")
            .innerJoinAndSelect("courseStaff.course", "course")
            .innerJoinAndSelect("course.rooms", "room")
            .innerJoinAndSelect("room.queues", "queue")
            .where("queue.id = :queueId", { queueId: queue.id })
            .getMany();
        // only staff can accept/claim/close questions
        if (
            staffMembers.map((staff) => staff.id).includes(user.id) ||
            user.isAdmin
        ) {
            question.status = questionStatus;
            if (questionStatus === QuestionStatus.CLAIMED) {
                // Claim student
                question.claimerId = user.id;
                question.claimMessage = message || "";
                question.claimTime = new Date();
            } else if (questionStatus === QuestionStatus.ACCEPTED) {
                // Accept student
                const userId = question.opId;
                const courseId = (await (await queue.room).course).id;
                const courseUserMeta = await CourseUserMeta.findOneOrFail({
                    userId,
                    courseId,
                });
                courseUserMeta.questionsAsked += 1;
                await courseUserMeta.save();
            }
        } else {
            if (
                questionStatus !== QuestionStatus.CLOSED &&
                op.id !== user.id &&
                !user.isAdmin
            ) {
                throw new Error(permissionDeniedMsg);
            }
            question.status = QuestionStatus.CLOSED;
        }
        return await question.save();
    }

    @FieldResolver(() => [Question])
    async activeQuestions(@Root() queue: Queue): Promise<Question[]> {
        return (await queue.questions).filter(
            (question) => question.status === QuestionStatus.OPEN
        );
    }

    @Mutation(() => Queue)
    async createQueue(
        @Arg("roomId") roomId: string,
        @Arg("queueInput", () => QueueInput) queueInput: QueueInput,
        @Ctx() { req }: MyContext
    ) {
        let room: Room;
        try {
            room = await Room.findOneOrFail(roomId);
        } catch (e) {
            throw new Error("Cannot find room");
        }
        if (!req.user.isAdmin) {
            await getCourseStaff(room.courseId, req.user.id);
        }
        const newQueue = Queue.create(queueInput);
        newQueue.room = Promise.resolve(room);
        return await newQueue.save();
    }

    @Mutation(() => Queue)
    async updateQueue(
        @Arg("queueId") queueId: string,
        @Arg("queueInput", () => QueueInput) queueInput: QueueInput,
        @Ctx() { req }: MyContext
    ) {
        let queue: Queue;
        try {
            queue = await Queue.findOneOrFail(queueId);
        } catch (e) {
            throw new Error("Cannot find queue");
        }
        const room = await queue.room;
        if (!req.user.isAdmin) {
            await getCourseStaff(room.courseId, req.user.id);
        }
        const {
            name,
            examples,
            theme,
            sortedBy,
            actions,
            clearAfterMidnight,
        } = queueInput;
        queue.name = name;
        queue.examples = examples;
        queue.theme = theme;
        queue.sortedBy = sortedBy;
        queue.actions = actions;
        queue.clearAfterMidnight = clearAfterMidnight;
        return await queue.save();
    }
}
