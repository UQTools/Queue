import { ConnectionOptions } from "typeorm";
import { __prod__ } from "../constants";
import {
    Course,
    CourseUserMeta,
    Question,
    Queue,
    Room,
    User,
    WeeklyEvent,
} from "./entities";
import { CourseStaff } from "./entities/course-staff";

export default {
    type: "postgres",
    url: process.env.DB_URL,
    entities: [
        Course,
        CourseStaff,
        CourseUserMeta,
        Question,
        Queue,
        Room,
        User,
        WeeklyEvent,
    ],
    migrations: [
        __prod__
            ? "build/server/migrations/*.js"
            : "src/server/migrations/*.ts",
    ],
    logging: !__prod__ && ["error", "schema", "warn", "query"],
    cli: {
        migrationsDir: __prod__
            ? "build/server/migrations/*.js"
            : "src/server/migrations",
    },
} as ConnectionOptions;
