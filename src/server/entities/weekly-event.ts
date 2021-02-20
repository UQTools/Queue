import {
    BaseEntity,
    Check,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Lazy } from "../types/query";
import { Room } from "./room";
import { Field, Int, ObjectType } from "type-graphql";
import { IsoDay } from "../types/day";
import { checkFieldValueInEnum } from "../utils/query";

@ObjectType()
@Entity()
@Check(checkFieldValueInEnum(IsoDay, "day", true))
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

    @Field(() => Int)
    @Column("int")
    day: IsoDay;

    @Field(() => Room)
    @ManyToOne(() => Room, (room) => room.activeTimes, {
        lazy: true,
        onDelete: "CASCADE",
    })
    room: Lazy<Room>;
}
