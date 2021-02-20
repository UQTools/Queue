import { registerEnumType } from "type-graphql";
import { QueueTheme } from "../types/queue";

registerEnumType(QueueTheme, {
    name: "QueueTheme",
});

export { Course } from "./course";
export { CourseUserMeta } from "./course-user-meta";
export { Question } from "./question";
export { Queue } from "./queue";
export { Room } from "./room";
export { User } from "./user";
export { WeeklyEvent } from "./weekly-event";
