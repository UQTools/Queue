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
import { Question, Queue, Room } from "../entities";
import { MyContext } from "../types/context";
import { QuestionStatus } from "../types/question";
import { QueueAction, QueueSortType, QueueTheme } from "../types/queue";
import { getCourseStaff } from "../utils/course-staff";

@InputType()
class QueueInput {
    @Field()
    name: string;

    @Field()
    shortDescription: string;

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

    @Field()
    showEnrolledSession: boolean;
}

@Resolver(() => Queue)
export class QueueResolver {
    @FieldResolver(() => [Question])
    async activeQuestions(@Root() queue: Queue): Promise<Question[]> {
        return (await queue.questions).filter(
            (question) =>
                question.status === QuestionStatus.OPEN ||
                question.status === QuestionStatus.CLAIMED
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
            shortDescription,
            examples,
            theme,
            sortedBy,
            actions,
            clearAfterMidnight,
            showEnrolledSession,
        } = queueInput;
        queue.name = name;
        queue.shortDescription = shortDescription;
        queue.examples = examples;
        queue.theme = theme;
        queue.sortedBy = sortedBy;
        queue.actions = actions;
        queue.clearAfterMidnight = clearAfterMidnight;
        queue.showEnrolledSession = showEnrolledSession;
        return await queue.save();
    }

    @Mutation(() => String)
    async removeQueue(
        @Arg("queueId") queueId: string,
        @Ctx() { req }: MyContext
    ): Promise<string> {
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
        const removedId = queue.id;
        await Queue.remove(queue);
        return removedId;
    }
}
