import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { CourseStaff } from "../entities/course-staff";
import { StaffRole } from "../types/course-staff";
import { MyContext } from "../types/context";
import { getCourseStaff } from "../utils/course-staff";
import { permissionDeniedMsg, redacted } from "../../constants";
import { getRepository } from "typeorm";
import { User } from "../entities";

@Resolver()
export class CourseStaffResolver {
    @Query(() => [CourseStaff])
    async getCourseStaff(
        @Arg("courseId") courseId: string,
        @Ctx() { req }: MyContext
    ): Promise<CourseStaff[]> {
        const user = req.user;
        if (!user.isAdmin) {
            const courseStaff = await getCourseStaff(courseId, user.id);
            if (courseStaff.role !== StaffRole.COORDINATOR) {
                throw new Error(permissionDeniedMsg);
            }
        }
        return CourseStaff.find({ courseId });
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
            if (courseStaff.role !== StaffRole.COORDINATOR) {
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

    @Mutation(() => String)
    async removeStaff(
        @Arg("courseStaffId", () => String) courseStaffId: string,
        @Ctx() { req }: MyContext
    ): Promise<string> {
        const user = req.user;
        const courseStaffToDelete = await CourseStaff.findOne(courseStaffId);
        if (!courseStaffToDelete) {
            throw new Error("Cannot find staff");
        }
        if (!user.isAdmin) {
            const courseStaff = await getCourseStaff(
                courseStaffToDelete.courseId,
                user.id
            );
            if (courseStaff.role !== StaffRole.COORDINATOR) {
                throw new Error(permissionDeniedMsg);
            }
        }
        try {
            await courseStaffToDelete.remove();
            return courseStaffId;
        } catch (e) {
            throw new Error("Could not remove this staff member");
        }
    }
}
