import { registerEnumType } from "type-graphql";
import { QueueAction, QueueSortType, QueueTheme } from "../types/queue";
import { QuestionStatus } from "../types/question";

registerEnumType(QueueTheme, {
    name: "QueueTheme",
});

registerEnumType(QuestionStatus, {
    name: "QuestionStatus",
});

registerEnumType(QueueSortType, {
    name: "QueueSortType",
});

registerEnumType(QueueAction, {
    name: "QueueAction",
});

export { Course } from "./course";
export { CourseUserMeta } from "./course-user-meta";
export { Question } from "./question";
export { Queue } from "./queue";
export { Room } from "./room";
export { User } from "./user";
export { WeeklyEvent } from "./weekly-event";
