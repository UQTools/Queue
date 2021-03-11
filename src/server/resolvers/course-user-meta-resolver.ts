import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";
import { MyContext } from "../types/context";
import { StaffRole } from "../types/course-staff";
import { permissionDeniedMsg, redacted } from "../../constants";
import { CourseUserMeta, User } from "../entities";

@InputType()
class UserEnrolledSessionInput {
    @Field()
    username: string;

    @Field()
    session: string;
}

@Resolver()
export class CourseUserMetaResolver {
    @Mutation(() => [CourseUserMeta])
    async addStudentEnrolment(
        @Arg("courseId") courseId: string,
        @Arg("userEnrolledSessions", () => [UserEnrolledSessionInput])
        userEnrolledSessions: UserEnrolledSessionInput[],
        @Ctx() { req }: MyContext
    ): Promise<CourseUserMeta[]> {
        const courseStaffs = await req.user.courseStaff;
        const isCoordinator = courseStaffs
            .filter((courseStaff) => courseStaff.role === StaffRole.COORDINATOR)
            .map((courseStaff) => courseStaff.courseId)
            .includes(courseId);
        if (!isCoordinator && !req.user.isAdmin) {
            throw new Error(permissionDeniedMsg);
        }
        const newMeta: CourseUserMeta[] = [];
        for (const userSession of userEnrolledSessions) {
            let user;
            try {
                user = await User.findOneOrFail({
                    username: userSession.username,
                });
            } catch (e) {
                user = await User.create({
                    username: userSession.username,
                    name: redacted,
                    email: redacted,
                }).save();
            }
            let meta: CourseUserMeta;
            try {
                meta = await CourseUserMeta.findOneOrFail({
                    courseId,
                    userId: user.id,
                });
                meta.enrolledSession = userSession.session;
            } catch (e) {
                meta = CourseUserMeta.create({
                    courseId,
                    userId: user.id,
                    enrolledSession: userSession.session,
                    questionsAsked: 0,
                });
            }
            newMeta.push(meta);
        }
        return await CourseUserMeta.save(newMeta);
    }
}
