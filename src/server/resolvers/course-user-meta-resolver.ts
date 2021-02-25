import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";
import { MyContext } from "../types/context";

@InputType()
class UserEnrolledSessionInput {
    @Field()
    username: string;

    @Field()
    session: string;
}
@Resolver()
export class CourseUserMetaResolver {
    @Mutation(() => Boolean)
    async addStudentEnrolledSessions(
        @Arg("courseCode") courseCode: string,
        @Arg("userEnrolledSessions", () => [UserEnrolledSessionInput])
        enrolledSession: UserEnrolledSessionInput[],
        @Ctx() { req }: MyContext
    ): Promise<boolean> {
        console.log(req.user);
        return true;
    }
}
