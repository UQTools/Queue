import {
    Arg,
    Ctx,
    Field,
    InputType,
    Mutation,
    Query,
    Resolver,
} from "type-graphql";
import { Course } from "../entities";
import { MyContext } from "../types/context";
import { permissionDeniedMsg } from "../../constants";

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

    @Query(() => [Course])
    async getCourses(@Ctx() { req }: MyContext): Promise<Course[]> {
        if (!req.user.isAdmin) {
            throw new Error(permissionDeniedMsg);
        }
        return Course.find();
    }
}
