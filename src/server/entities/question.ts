import {
    BaseEntity,
    Check,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Lazy } from "../types/query";
import { User } from "./user";
import { QuestionStatus } from "../types/question";
import { checkFieldValueInEnum } from "../utils/query";
import { Queue } from "./queue";

@ObjectType()
@Entity()
@Check(checkFieldValueInEnum(QuestionStatus, "status"))
export class Question extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field(() => QuestionStatus)
    @Column({ type: "varchar" })
    status: QuestionStatus;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.questions, { lazy: true })
    op: Lazy<User>;

    @Column()
    opId: string;

    @Field(() => User, { nullable: true })
    @ManyToOne(() => User, (user) => user.claimedQuestions, {
        lazy: true,
        nullable: true,
    })
    claimer: Lazy<User>;

    @Column({ nullable: true })
    claimerId: string;

    @Field(() => Date)
    @CreateDateColumn()
    createdTime: Date;

    @Field(() => Date, { nullable: true })
    @Column({ type: "timestamp with time zone", nullable: true })
    claimTime: Date;

    @Field({ nullable: true })
    @Column({ nullable: true })
    claimMessage: string;

    @Field(() => Queue)
    @ManyToOne(() => Queue, (queue) => queue.questions, {
        lazy: true,
        onDelete: "CASCADE",
    })
    queue: Lazy<Queue>;

    @Column()
    queueId: string;
}
