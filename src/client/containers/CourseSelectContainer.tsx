import React, {
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";
import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { StaffRole, useGetCoursesLazyQuery } from "../generated/graphql";
import { UserContext } from "../utils/user";
import { useLazyQueryWithError } from "../hooks/useApolloHooksWithError";

type Props = {
    selectCourse: Dispatch<SetStateAction<string>>;
    selectedCourse: string;
    allowedRoles?: StaffRole[];
};

export const CourseSelectContainer: React.FC<Props> = ({
    selectCourse,
    selectedCourse,
    allowedRoles = [StaffRole.Coordinator],
}) => {
    const [availCourses, setAvailCourses] = useState<[string, string][]>([]);
    const user = useContext(UserContext)!;
    const [
        getCourses,
        { data: getCoursesData },
    ] = useLazyQueryWithError(useGetCoursesLazyQuery, { errorPolicy: "all" });
    useEffect(() => {
        if (user.isAdmin) {
            getCourses();
        }
    }, [user.isAdmin, getCourses]);
    useEffect(() => {
        if (user.isAdmin) {
            setAvailCourses(
                getCoursesData?.getCourses.map((course) => [
                    course.id,
                    course.code,
                ]) || []
            );
        } else {
            setAvailCourses(
                user.getCourseStaff
                    .filter((courseStaff) =>
                        allowedRoles.includes(courseStaff.role)
                    )
                    .map((courseStaff) => [
                        courseStaff.course.id,
                        courseStaff.course.code,
                    ])
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, getCoursesData, JSON.stringify(allowedRoles)]);
    return (
        <FormControl>
            <FormLabel fontWeight="bold">Course:</FormLabel>
            <Select
                onChange={(e) => selectCourse(e.target.value)}
                value={selectedCourse}
            >
                <option value="" disabled>
                    Choose a value
                </option>
                {availCourses.map(([courseId, courseCode], key) => (
                    <option key={key} value={courseId}>
                        {courseCode}
                    </option>
                ))}
            </Select>
        </FormControl>
    );
};
