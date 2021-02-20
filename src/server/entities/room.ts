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
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Room extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column()
    name: string;

    @Field(() => Int)
    @Column("int")
    capacity: number;

    @Field()
    @Column()
    enforceCapacity: boolean;

    @Field()
    @Column()
    manuallyDisabled: boolean;

    @Field(() => [WeeklyEvent])
    @OneToMany(() => WeeklyEvent, (weeklyEvent) => weeklyEvent.room, {
        lazy: true,
        onDelete: "CASCADE",
    })
    activeTimes: Lazy<WeeklyEvent[]>;

    @Field(() => [Queue])
    @OneToMany(() => Queue, (queue) => queue.room, { lazy: true })
    queues: Lazy<Queue[]>;

    @Field(() => Course)
    @ManyToOne(() => Course, (course) => course.rooms, {
        lazy: true,
        onDelete: "CASCADE",
    })
    course: Lazy<Course>;

    @Column()
    courseId: string;
}
