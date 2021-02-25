import asyncFilter from "node-filter-async";
import getIsoDay from "date-fns/getISODay";
import { Room } from "../entities";

export const getActiveRooms = async (rooms: Room[]) => {
    const today = new Date();
    return await asyncFilter(rooms, async (room) => {
        if (room.manuallyDisabled) {
            return false;
        }
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
};
