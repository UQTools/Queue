import {
    BaseEntity,
    Column,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";
import { Lazy } from "../types/query";
import { CourseUserMeta } from "./course-user-meta";
import { Room } from "./room";
import { Field, ObjectType } from "type-graphql";

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

    @Field(() => [User])
    @ManyToMany(() => User, (user) => user.isStaffOf, { lazy: true })
    staff: Lazy<User[]>;

    @Field(() => [CourseUserMeta])
    @OneToMany(() => CourseUserMeta, (courseMeta) => courseMeta.course, {
        lazy: true,
    })
    userMetas: Lazy<CourseUserMeta>;

    @Field(() => [Room])
    @OneToMany(() => Room, (room) => room.course, { lazy: true })
    rooms: Lazy<Room[]>;
}
