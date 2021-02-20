import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Lazy } from "../types/query";
import { Question } from "./question";
import { CourseUserMeta } from "./course-user-meta";
import { Field, ObjectType } from "type-graphql";
import { CourseStaff } from "./course-staff";

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column({ unique: true })
    username: string;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    email: string;

    @Field()
    @Column({ default: false })
    isOnline: boolean;

    @Field()
    @Column({ default: false })
    isAdmin: boolean;

    @Field(() => [CourseStaff])
    @OneToMany(() => CourseStaff, (courseStaff) => courseStaff.user, {
        lazy: true,
    })
    courseStaff: Lazy<CourseStaff[]>;

    @Field(() => [Question])
    @OneToMany(() => Question, (question) => question.op, { lazy: true })
    questions: Lazy<Question[]>;

    @Field(() => [Question])
    @OneToMany(() => Question, (question) => question.claimer, { lazy: true })
    claimedQuestions: Lazy<Question[]>;

    @Field(() => [CourseUserMeta])
    @OneToMany(() => CourseUserMeta, (courseUserMeta) => courseUserMeta.user, {
        lazy: true,
    })
    courseMetas: Lazy<CourseUserMeta[]>;
}
