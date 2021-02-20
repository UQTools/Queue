import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Queue } from "./queue";
import { Lazy } from "../types/query";
import { WeeklyEvent } from "./weekly-event";
import { Course } from "./course";

@Entity()
export class Room extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    name: string;

    @Column("int")
    capacity: number;

    @Column()
    enforceCapacity: boolean;

    @Column()
    manuallyDisabled: boolean;

    @OneToMany(() => WeeklyEvent, (weeklyEvent) => weeklyEvent.room, {
        lazy: true,
    })
    activeTimes: Lazy<WeeklyEvent>;

    @OneToMany(() => Queue, (queue) => queue.room, { lazy: true })
    queues: Lazy<Queue[]>;

    @ManyToOne(() => Course, (course) => course.rooms, { lazy: true })
    course: Lazy<Course>;
}
