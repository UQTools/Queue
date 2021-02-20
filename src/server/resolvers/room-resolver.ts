import { Arg, Query, Resolver } from "type-graphql";
import { Course, Room } from "../entities";
import asyncFilter from "node-filter-async";
import getIsoDay from "date-fns/getISODay";

@Resolver()
export class RoomResolver {
    @Query(() => [Room])
    async getActiveRooms(@Arg("courseId") courseId: string): Promise<Room[]> {
        let course: Course;
        try {
            course = await Course.findOneOrFail(courseId);
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
