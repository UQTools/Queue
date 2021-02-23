import {
    Arg,
    Ctx,
    FieldResolver,
    Int,
    Mutation,
    Publisher,
    PubSub,
    Resolver,
    Root,
    Subscription,
} from "type-graphql";
import { CourseUserMeta, Question, Queue, User } from "../entities";
import { MyContext } from "../types/context";
import { getRepository } from "typeorm";
import { QuestionEvent, QuestionStatus } from "../types/question";
import { permissionDeniedMsg } from "../../constants";

@Resolver(() => Question)
export class QuestionResolver {
    @Mutation(() => Question)
    async askQuestion(
        @Arg("queueId") queueId: string,
        @Ctx() { req }: MyContext,
        @PubSub(QuestionEvent.NEW_QUESTION) publish: Publisher<Question>
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
            .innerJoinAndSelect("question.op", "user")
            .where("user.id = :userId", { userId: req.user.id })
            .andWhere("course.id = :courseId", { courseId: course.id })
            .andWhere("question.status NOT IN (:...ended)", {
                ended: [QuestionStatus.CLOSED, QuestionStatus.ACCEPTED],
            })
            .getMany();
        if (existingQueues.length > 0) {
            throw new Error("You are already on a queue of this course");
        }
        const question = await Question.create({
            opId: req.user.id,
            queueId: queue.id,
            status: QuestionStatus.OPEN,
        }).save();
        const courseUserMeta = await CourseUserMeta.findOne({
            userId: req.user.id,
            courseId: course.id,
        });
        if (!courseUserMeta) {
            // Create new metadata if none exists
            await CourseUserMeta.create({
                userId: req.user.id,
                courseId: course.id,
                questionsAsked: 0,
            }).save();
        }
        publish(question);
        return question;
    }

    @Mutation(() => Question)
    async updateQuestionStatus(
        @Arg("questionStatus", () => QuestionStatus)
        questionStatus: QuestionStatus,
        @Arg("questionId") questionId: string,
        @Arg("message", () => String, { nullable: true })
        message: string | undefined,
        @Ctx() { req }: MyContext,
        @PubSub(QuestionEvent.UPDATE_QUESTION) publish: Publisher<Question>
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
            if (questionStatus === QuestionStatus.CLAIMED) {
                // Claim student
                question.claimMessage = message || "";
                question.claimTime = new Date();
            } else if (
                // Only accept once. Do not stack accept requests.
                questionStatus === QuestionStatus.ACCEPTED &&
                question.status !== QuestionStatus.ACCEPTED
            ) {
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
            question.status = questionStatus;
            question.claimerId = user.id;
        } else {
            if (questionStatus !== QuestionStatus.CLOSED || op.id !== user.id) {
                throw new Error(permissionDeniedMsg);
            }
            question.status = QuestionStatus.CLOSED;
        }
        const newQuestion = await question.save();
        publish(newQuestion);
        return newQuestion;
    }

    @FieldResolver(() => Int)
    async questionsAsked(
        @Root() question: Question,
        @Ctx() { req }: MyContext
    ): Promise<number> {
        const course = await (await (await question.queue).room).course;
        const existingMeta = await CourseUserMeta.findOne({
            courseId: course.id,
            userId: question.opId,
        });
        if (existingMeta) {
            return existingMeta.questionsAsked;
        }
        const newMeta = await CourseUserMeta.create({
            user: req.user,
            course,
            questionsAsked: 0,
        }).save();
        return newMeta.questionsAsked;
    }

    @Subscription(() => Question, {
        topics: [QuestionEvent.NEW_QUESTION, QuestionEvent.UPDATE_QUESTION],
        filter: async ({
            payload,
            args,
        }: {
            payload: Question;
            args: { roomId: string };
        }) => args.roomId === (await payload.queue).roomId,
    })
    async questionChanges(
        @Arg("roomId") roomId: string,
        @Root() question: Question
    ): Promise<Question> {
        return question;
    }
}