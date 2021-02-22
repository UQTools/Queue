import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from "typeorm";
import { User } from "./user";
import { Lazy } from "../types/query";
import { Course } from "./course";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
@Unique(["userId", "courseId"])
export class CourseUserMeta extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.courseMetas, { lazy: true })
    user: Lazy<User>;

    @Field(() => Course)
    @ManyToOne(() => Course, (course) => course.userMetas, { lazy: true })
    course: Lazy<Course>;

    @Column()
    userId: string;

    @Column()
    courseId: string;

    @Field(() => Int)
    @Column("int")
    questionsAsked: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    enrolledSession: string;
}
