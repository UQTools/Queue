import {
    BaseEntity,
    Check,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { QueueAction, QueueSortType, QueueTheme } from "../types/queue";
import { checkFieldValueInEnum } from "../utils/query";
import { Room } from "./room";
import { Lazy } from "../types/query";
import { Question } from "./question";

@ObjectType()
@Entity()
@Check(checkFieldValueInEnum(QueueTheme, "theme"))
@Check(checkFieldValueInEnum(QueueSortType, "sortedBy"))
export class Queue extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column()
    name: string;

    @Field(() => [String])
    @Column("varchar", { array: true, default: () => "array[]::varchar[]" })
    examples: Array<string>;

    @Field(() => QueueTheme)
    @Column({ type: "varchar" })
    theme: QueueTheme;

    @Field(() => QueueSortType)
    @Column({ type: "varchar" })
    sortedBy: QueueSortType;

    @Field(() => [QueueAction])
    @Column({
        type: "varchar",
        array: true,
        default: () => "array[]::varchar[]",
    })
    actions: QueueAction[];

    @Field(() => Room)
    @ManyToOne(() => Room, (room) => room.queues, { lazy: true })
    room: Lazy<Room>;

    @Field(() => [Question])
    @OneToMany(() => Question, (question) => question.queue, {
        lazy: true,
        onDelete: "CASCADE",
    })
    questions: Lazy<Question[]>;

    @Field()
    @Column({ default: false })
    clearAfterMidnight: boolean;
}
