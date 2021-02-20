import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Question, Queue } from "../entities";
import { MyContext } from "../types/context";
import { getRepository } from "typeorm";

@Resolver()
export class QueueResolver {
    @Mutation(() => Queue)
    async askQuestion(
        @Arg("queueId") queueId: string,
        @Ctx() { req }: MyContext
    ): Promise<Queue> {
        const queue = await Queue.findOneOrFail({ id: queueId });
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
        await Question.create({ opId: req.user.id, queueId: queue.id }).save();
        return await Queue.findOneOrFail({ id: queueId });
    }
}
