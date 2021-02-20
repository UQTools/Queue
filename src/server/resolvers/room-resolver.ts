import {
    Arg,
    Ctx,
    Field,
    InputType,
    Int,
    Mutation,
    Query,
    Resolver,
} from "type-graphql";
import { Course, Room, WeeklyEvent } from "../entities";
import asyncFilter from "node-filter-async";
import getIsoDay from "date-fns/getISODay";
import { MyContext } from "../types/context";
import { getCourseStaff } from "../utils/course-staff";

@InputType()
class EventInput {
    @Field()
    startTime: number;

    @Field()
    endTime: number;

    @Field(() => Int)
    day: number;
}

@InputType()
class RoomInput {
    @Field()
    name: string;

    @Field(() => Int)
    capacity: number;

    @Field()
    enforceCapacity: boolean;

    @Field()
    manuallyDisabled: boolean;

    @Field(() => [EventInput])
    activeTimes: EventInput[];
}

@Resolver(() => Room)
export class RoomResolver {
    @Query(() => [Room])
    async getActiveRooms(
        @Arg("courseCode") courseCode: string
    ): Promise<Room[]> {
        let course: Course;
        try {
            course = await Course.findOneOrFail({ code: courseCode });
        } catch (e) {
            throw new Error("Cannot find course");
        }
        const rooms = await course.rooms;
        const today = new Date();
        return await asyncFilter(rooms, async (room) => {
            const events = await room.activeTimes;
            return events.some((event) => {
                const currentDay = getIsoDay(today);
                const currentTime =
                    today.getHours() +
                    today.getMinutes() / 60 +
                    today.getSeconds() / 3600;
                return (
                    event.day === currentDay &&
                    event.startTime < currentTime &&
                    currentTime < event.endTime
                );
            });
        });
    }

    /**
     * Add a room that has specified weekly active time frames
     */
    @Mutation(() => Room)
    async addRoom(
        @Arg("courseId") courseId: string,
        @Arg("roomInput", () => RoomInput) roomInput: RoomInput,
        @Ctx() { req }: MyContext
    ): Promise<Room> {
        await getCourseStaff(courseId, req.user.id);
        const newEvents: WeeklyEvent[] = [];
        for (const { startTime, endTime, day } of roomInput.activeTimes) {
            newEvents.push(
                WeeklyEvent.create({
                    startTime,
                    endTime,
                    day,
                })
            );
        }
        const savedEvents = WeeklyEvent.save(newEvents);
        const { name, capacity, enforceCapacity, manuallyDisabled } = roomInput;
        const newRoom = Room.create({
            name,
            capacity,
            enforceCapacity,
            manuallyDisabled,
            courseId,
        });
        newRoom.activeTimes = savedEvents;
        return await newRoom.save();
    }

    /**
     * This is the main interaction with the client side
     */
    @Query(() => Room)
    async getRoomById(@Arg("roomId") roomId: string): Promise<Room> {
        try {
            return Room.findOneOrFail(roomId);
        } catch (e) {
            throw new Error("Cannot find Room");
        }
    }
}
