import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Lazy } from "../types/query";
import { CourseUserMeta } from "./course-user-meta";
import { Room } from "./room";
import { Field, ObjectType } from "type-graphql";
import { CourseStaff } from "./course-staff";

@ObjectType()
@Entity()
export class Course extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column({ unique: true })
    code: string;

    @Field()
    @Column()
    title: string;

    @Field(() => [CourseStaff])
    @OneToMany(() => CourseStaff, (courseStaff) => courseStaff.course, {
        lazy: true,
    })
    courseStaff: Lazy<CourseStaff[]>;

    @Field(() => [CourseUserMeta])
    @OneToMany(() => CourseUserMeta, (courseMeta) => courseMeta.course, {
        lazy: true,
    })
    userMetas: Lazy<CourseUserMeta>;

    @Field(() => [Room])
    @OneToMany(() => Room, (room) => room.course, { lazy: true })
    rooms: Lazy<Room[]>;
}
