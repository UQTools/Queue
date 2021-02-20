import {
    BaseEntity,
    Check,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Field } from "type-graphql";
import { QueueAction, QueueSort, QueueTheme } from "../types/queue";
import { checkFieldValueInEnum } from "../utils/query";
import { Room } from "./room";
import { Lazy } from "../types/query";

@Entity()
@Check(checkFieldValueInEnum(QueueTheme, "theme"))
export class Queue extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field(() => [String])
    @Column("varchar", { array: true, default: () => "array[]::varchar[]" })
    examples: Array<string>;

    @Field(() => QueueTheme)
    @Column({ type: "varchar" })
    theme: QueueTheme;

    @Column({ type: "varchar" })
    sortedBy: QueueSort;

    @Column({
        type: "varchar",
        array: true,
        default: () => "array[]::varchar[]",
    })
    actions: QueueAction[];

    @ManyToOne(() => Room, (room) => room.queues, { lazy: true })
    room: Lazy<Room>;
}
