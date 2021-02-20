import {
    BaseEntity,
    Check,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from "typeorm";
import { StaffRole } from "../types/course-staff";
import { checkFieldValueInEnum } from "../utils/query";
import { Field, ObjectType } from "type-graphql";
import { User } from "./user";
import { Lazy } from "../types/query";
import { Course } from "./course";

@ObjectType()
@Entity()
@Check(checkFieldValueInEnum(StaffRole, "role"))
@Unique(["user", "course"])
export class CourseStaff extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field(() => StaffRole)
    @Column("varchar")
    role: StaffRole;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.courseStaff, { lazy: true })
    user: Lazy<User>;

    @Field(() => Course)
    @ManyToOne(() => Course, (user) => user.courseStaff, { lazy: true })
    course: Lazy<Course>;

    @Column()
    courseId: string;

    @Column()
    userId: string;
}
