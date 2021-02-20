import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Lazy } from "../types/query";
import { Room } from "./room";

@Entity()
export class WeeklyEvent extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    startTime: number;

    @Column()
    endTime: number;

    @ManyToOne(() => Room, (room) => room.activeTimes, { lazy: true })
    room: Lazy<Room>;
}
