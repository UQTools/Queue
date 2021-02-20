import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Lazy } from "../types/query";
import { Room } from "./room";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class WeeklyEvent extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    startTime: number;

    @Field()
    @Column()
    endTime: number;

    @Field(() => Room)
    @ManyToOne(() => Room, (room) => room.activeTimes, { lazy: true })
    room: Lazy<Room>;
}
