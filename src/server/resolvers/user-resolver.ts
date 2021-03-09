import { Ctx, FieldResolver, Query, Resolver } from "type-graphql";
import { User } from "../entities";
import { MyContext } from "../types/context";
import { CourseStaff } from "../entities/course-staff";

@Resolver(() => User)
export class UserResolver {
    @Query(() => User)
    async me(@Ctx() { req }: MyContext): Promise<User> {
        return req.user;
    }

    @FieldResolver(() => [CourseStaff])
    async getCourseStaff(@Ctx() { req }: MyContext): Promise<CourseStaff[]> {
        if (req.user.isAdmin) {
            return await CourseStaff.find();
        }
        return await req.user.courseStaff;
    }
}
