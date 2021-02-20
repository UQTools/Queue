import {
    BaseEntity,
    Column,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Course } from "./course";
import { Lazy } from "../types/query";
import { Question } from "./question";
import { CourseUserMeta } from "./course-user-meta";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    username: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    isOnline: boolean;

    @Column({ default: false })
    isAdmin: boolean;

    @ManyToMany(() => Course, (course) => course.staff, { lazy: true })
    isStaffOf: Lazy<Course[]>;

    @ManyToOne(() => Question, (question) => question.op, { lazy: true })
    questions: Lazy<Question[]>;

    @ManyToOne(() => Question, (question) => question.claimer, { lazy: true })
    claimedQuestions: Lazy<Question[]>;

    @OneToMany(() => CourseUserMeta, (courseUserMeta) => courseUserMeta.user, {
        lazy: true,
    })
    courseMetas: Lazy<CourseUserMeta[]>;
}
