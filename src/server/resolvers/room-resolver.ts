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
import { MyContext } from "../types/context";
import { getCourseStaff } from "../utils/course-staff";
import { getActiveRooms } from "../utils/rooms";

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
            course = await Course.findOneOrFail({
                where: [
                    {
                        code: courseCode,
                    },
                    {
                        alias: courseCode,
                    },
                ],
            });
        } catch (e) {
            throw new Error("Cannot find course");
        }
        const rooms = await course.rooms;
        return await getActiveRooms(rooms);
    }

    /**
     * Add a room that has specified weekly active time frames
     */
    @Mutation(() => Room)
    async createRoom(
        @Arg("courseId") courseId: string,
        @Arg("roomInput", () => RoomInput) roomInput: RoomInput,
        @Ctx() { req }: MyContext
    ): Promise<Room> {
        if (!req.user.isAdmin) {
            await getCourseStaff(courseId, req.user.id);
        }
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
        const savedEvents = await WeeklyEvent.save(newEvents);
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

    @Mutation(() => Room)
    async updateRoom(
        @Arg("roomId") roomId: string,
        @Arg("roomInput", () => RoomInput) roomInput: RoomInput,
        @Ctx() { req }: MyContext
    ): Promise<Room> {
        let room;
        try {
            room = await Room.findOneOrFail(roomId);
        } catch (e) {
            throw new Error("Cannot find room");
        }
        if (!req.user.isAdmin) {
            await getCourseStaff(room.courseId, req.user.id);
        }
        // Remove old events
        const eventsToRemove = await room.activeTimes;
        await WeeklyEvent.remove(eventsToRemove);

        // Replace with new events
        const newEvents: WeeklyEvent[] = [];
        for (const activeTime of roomInput.activeTimes) {
            newEvents.push(WeeklyEvent.create(activeTime));
        }
        const savedEvents = await WeeklyEvent.save(newEvents);
        const { name, capacity, enforceCapacity, manuallyDisabled } = roomInput;
        room.name = name;
        room.capacity = capacity;
        room.enforceCapacity = enforceCapacity;
        room.manuallyDisabled = manuallyDisabled;
        room.activeTimes = savedEvents;
        return await room.save();
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

    @Mutation(() => String)
    async deleteRoom(
        @Arg("roomId") roomId: string,
        @Ctx() { req }: MyContext
    ): Promise<string> {
        const room = await Room.findOne(roomId);
        if (!room) {
            throw new Error("Cannot find room");
        }
        if (!req.user.isAdmin) {
            await getCourseStaff(room.courseId, req.user.id);
        }
        try {
            await Room.remove(room);
        } catch (e) {
            throw new Error(
                "Cannot delete room. Maybe there are still queues in this room"
            );
        }
        return roomId;
    }
}
