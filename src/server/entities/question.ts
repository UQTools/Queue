import {
    BaseEntity,
    Check,
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Field } from "type-graphql";
import { Lazy } from "../types/query";
import { User } from "./user";
import { QuestionStatus } from "../types/question";
import { checkFieldValueInEnum } from "../utils/query";

@Entity()
@Check(checkFieldValueInEnum(QuestionStatus, "status"))
export class Question extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    status: QuestionStatus;

    @OneToMany(() => User, (user) => user.questions, { lazy: true })
    op: Lazy<User>;

    @OneToMany(() => User, (user) => user.claimedQuestions, { lazy: true })
    claimer: Lazy<User>;

    @CreateDateColumn()
    createdTime: Date;

    @Column({ type: "timestamp without time zone" })
    claimTime: Date;

    @Column()
    claimMessage: string;
}
