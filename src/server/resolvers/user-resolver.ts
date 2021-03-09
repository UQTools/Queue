import { Ctx, FieldResolver, Query, Resolver } from "type-graphql";
import { Course, User } from "../entities";
import { MyContext } from "../types/context";
import { CourseStaff } from "../entities/course-staff";
import { StaffRole } from "../types/course-staff";
import { v4 as uuidV4 } from "uuid";

@Resolver(() => User)
export class UserResolver {
    @Query(() => User)
    async me(@Ctx() { req }: MyContext): Promise<User> {
        return req.user;
    }

    @FieldResolver(() => [CourseStaff])
    async getCourseStaff(@Ctx() { req }: MyContext): Promise<CourseStaff[]> {
        if (req.user.isAdmin) {
            return CourseStaff.create(
                (await Course.find()).map((course) => ({
                    id: uuidV4(),
                    course: course,
                    role: StaffRole.COORDINATOR,
                    user: req.user,
                }))
            );
        }
        return await req.user.courseStaff;
    }
}
