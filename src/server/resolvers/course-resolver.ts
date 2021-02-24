import {
    Arg,
    Ctx,
    Field,
    InputType,
    Mutation,
    Query,
    Resolver,
} from "type-graphql";
import { Course, User } from "../entities";
import { MyContext } from "../types/context";
import { permissionDeniedMsg, redacted } from "../../constants";
import { CourseStaff } from "../entities/course-staff";
import { getRepository } from "typeorm";
import { StaffRole } from "../types/course-staff";
import { getCourseStaff } from "../utils/course-staff";

@InputType()
class CourseInput {
    @Field()
    code: string;

    @Field()
    title: string;
}

@Resolver()
export class CourseResolver {
    @Mutation(() => Course)
    async createCourse(
        @Arg("courseInput", () => CourseInput) { code, title }: CourseInput,
        @Ctx() { req }: MyContext
    ): Promise<Course> {
        if (!req.user.isAdmin) {
            throw new Error(permissionDeniedMsg);
        }
        let course: Course;
        try {
            course = await Course.create({ code, title }).save();
        } catch (e) {
            throw new Error("Cannot create course");
        }
        return course;
    }

    @Mutation(() => [CourseStaff])
    async addStaff(
        @Arg("courseId") courseId: string,
        @Arg("usernames", () => [String]) usernames: string[],
        @Arg("role", () => StaffRole) role: StaffRole,
        @Ctx() { req }: MyContext
    ): Promise<CourseStaff[]> {
        const user = req.user;
        if (!user.isAdmin) {
            const courseStaff = await getCourseStaff(courseId, user.id);
            if (
                role === StaffRole.COORDINATOR &&
                courseStaff.role !== StaffRole.COORDINATOR
            ) {
                throw new Error(permissionDeniedMsg);
            }
        }
        const existingStaff = await getRepository(User)
            .createQueryBuilder("user")
            .innerJoinAndSelect("user.courseStaff", "courseStaff")
            .where("courseStaff.courseId = :courseId", { courseId })
            .getMany();
        const existingUsernames = existingStaff.map((user) => user.username);
        const newStaff: CourseStaff[] = [];
        for (const username of usernames) {
            if (existingUsernames.includes(username)) {
                continue;
            }
            let user;
            try {
                user = await User.findOneOrFail({ username });
            } catch (e) {
                user = await User.create({
                    username,
                    name: redacted,
                    email: redacted,
                }).save();
            }
            newStaff.push(
                CourseStaff.create({
                    courseId,
                    userId: user.id,
                    role,
                })
            );
        }
        return await CourseStaff.save(newStaff);
    }
}
