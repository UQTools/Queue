import {
    Arg,
    Ctx,
    FieldResolver,
    Int,
    Mutation,
    Resolver,
    Root,
} from "type-graphql";
import { CourseUserMeta, Question, Queue, User } from "../entities";
import { MyContext } from "../types/context";
import { getRepository } from "typeorm";
import { QuestionStatus } from "../types/question";
import { permissionDeniedMsg } from "../../constants";

@Resolver(() => Question)
export class QuestionResolver {
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
            .innerJoinAndSelect("question.op", "user")
            .where("user.id = :userId", { userId: req.user.id })
            .andWhere("course.id = :courseId", { courseId: course.id })
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

    @FieldResolver(() => Int)
    async questionsAsked(
        @Root() question: Question,
        @Ctx() { req }: MyContext
    ): Promise<number> {
        const course = await (await (await question.queue).room).course;
        const existingMeta = await CourseUserMeta.findOne({
            courseId: course.id,
            userId: req.user.id,
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
}
