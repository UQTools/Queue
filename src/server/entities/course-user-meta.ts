import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";
import { Lazy } from "../types/query";
import { Course } from "./course";

@Entity()
export class CourseUserMeta extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, (user) => user.courseMetas, { lazy: true })
    user: Lazy<User>;

    @ManyToOne(() => Course, (course) => course.userMetas, { lazy: true })
    course: Lazy<Course>;

    @Column()
    questionsAsked: number;

    @Column({ type: "timestamp without time zone" })
    date: Date;
}
