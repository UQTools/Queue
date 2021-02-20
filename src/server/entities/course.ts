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

@Entity()
export class Course extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    code: string;

    @Column()
    title: string;

    @ManyToMany(() => User, (user) => user.isStaffOf, { lazy: true })
    staff: Lazy<User[]>;

    @OneToMany(() => CourseUserMeta, (courseMeta) => courseMeta.course, {
        lazy: true,
    })
    userMetas: Lazy<CourseUserMeta>;

    @OneToMany(() => Room, (room) => room.course, { lazy: true })
    rooms: Lazy<Room[]>;
}
