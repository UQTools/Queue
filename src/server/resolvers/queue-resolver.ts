import maxBy from "lodash/maxBy";
import differenceInSeconds from "date-fns/differenceInSeconds";
import {
    Arg,
    Ctx,
    Field,
    FieldResolver,
    InputType,
    Mutation,
    Publisher,
    PubSub,
    Resolver,
    Root,
} from "type-graphql";
import { CourseUserMeta, Question, Queue, Room, User } from "../entities";
import { MyContext } from "../types/context";
import { QuestionEvent, QuestionStatus } from "../types/question";
import { QueueAction, QueueSortType, QueueTheme } from "../types/queue";
import { getCourseStaff } from "../utils/course-staff";
import { getActiveRooms } from "../utils/rooms";
import { getRepository } from "typeorm";

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
    static async getQueue(queueId: string, user: User): Promise<Queue> {
        let queue: Queue;
        try {
            queue = await Queue.findOneOrFail(queueId);
        } catch (e) {
            throw new Error("Cannot find queue");
        }
        const room = await queue.room;
        if (!user.isAdmin) {
            await getCourseStaff(room.courseId, user.id);
        }
        return queue;
    }

    @FieldResolver(() => [Question])
    async activeQuestions(@Root() queue: Queue): Promise<Question[]> {
        return (await queue.questions).filter(
            (question) =>
                question.status === QuestionStatus.OPEN ||
                question.status === QuestionStatus.CLAIMED ||
                question.status === QuestionStatus.NOT_NEEDED
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
        const queue = await QueueResolver.getQueue(queueId, req.user);
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
        const queue = await QueueResolver.getQueue(queueId, req.user);
        await Queue.remove(queue);
        return queueId;
    }

    @Mutation(() => Question)
    async undoRemove(
        @Arg("queueId") queueId: string,
        @Ctx() { req }: MyContext,
        @PubSub(QuestionEvent.UPDATE_QUESTION) publish: Publisher<string>
    ): Promise<Question> {
        const queue = await QueueResolver.getQueue(queueId, req.user);
        const questions = await queue.questions;
        const inactiveQuestions = questions.filter(
            (question) =>
                question.status === QuestionStatus.CLOSED ||
                question.status === QuestionStatus.ACCEPTED
        );
        if (inactiveQuestions.length === 0) {
            throw new Error("No closed question to undo");
        }
        console.log(inactiveQuestions);
        const mostRecentInactiveQuestion = maxBy(
            inactiveQuestions,
            (question) => question.closedTime.getTime()
        );
        if (!mostRecentInactiveQuestion) {
            throw new Error("Cannot find most recent closed question");
        }
        if (
            differenceInSeconds(
                new Date(),
                mostRecentInactiveQuestion.closedTime
            ) >= 300
        ) {
            throw new Error(
                "Cannot undo because most recent question was closed more than 5 minutes ago."
            );
        }
        // Checks if student is already on another queue
        const course = await (await queue.room).course;
        const rooms = await getActiveRooms(await course.rooms);
        const queuesWithStudent = await getRepository(Queue)
            .createQueryBuilder("queue")
            .innerJoinAndSelect("queue.room", "room")
            .innerJoinAndSelect("room.course", "course")
            .innerJoinAndSelect("queue.questions", "question")
            .innerJoinAndSelect("question.op", "asker")
            .where("asker.id = :askerId", {
                askerId: mostRecentInactiveQuestion.opId,
            })
            .andWhere("course.id = :courseId", { courseId: course.id })
            .andWhere("room.id IN (:...roomIds)", {
                roomIds: rooms.map((room) => room.id),
            })
            .andWhere("question.status NOT IN (:...ended)", {
                ended: [QuestionStatus.CLOSED, QuestionStatus.ACCEPTED],
            })
            .getMany();
        if (queuesWithStudent.length > 0) {
            throw new Error(
                "Cannot undo question because student already joined a queue again"
            );
        }

        // Decrease number of questions asked.
        if (mostRecentInactiveQuestion.status === QuestionStatus.ACCEPTED) {
            const courseUserMeta = await CourseUserMeta.findOneOrFail({
                userId: mostRecentInactiveQuestion.opId,
                courseId: course.id,
            });
            courseUserMeta.questionsAsked--;
            await courseUserMeta.save();
        }
        mostRecentInactiveQuestion.status = QuestionStatus.OPEN;

        const saved = await mostRecentInactiveQuestion.save();
        await publish(saved.id);
        return saved;
    }
}
