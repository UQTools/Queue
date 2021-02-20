import { registerEnumType } from "type-graphql";
import { QueueAction, QueueSortType, QueueTheme } from "../types/queue";
import { QuestionStatus } from "../types/question";
import { StaffRole } from "../types/course-staff";

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

registerEnumType(StaffRole, {
    name: "StaffRole",
});

export { Course } from "./course";
export { CourseUserMeta } from "./course-user-meta";
export { Question } from "./question";
export { Queue } from "./queue";
export { Room } from "./room";
export { User } from "./user";
export { WeeklyEvent } from "./weekly-event";
