import { ArrayElement } from "./helpers";
import { AddCourseStaffMutation } from "../generated/graphql";

export type CourseStaffResponseType = ArrayElement<
    AddCourseStaffMutation["addStaff"]
>;
