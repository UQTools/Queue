import { CourseStaff } from "../entities/course-staff";
import { permissionDeniedMsg } from "../../constants";

export const getCourseStaff = async (courseId: string, userId: string) => {
    try {
        return await CourseStaff.findOneOrFail({
            courseId,
            userId,
        });
    } catch (e) {
        throw new Error(permissionDeniedMsg);
    }
};
