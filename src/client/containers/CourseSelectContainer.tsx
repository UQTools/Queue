import React, {
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";
import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { StaffRole } from "../generated/graphql";
import { UserContext } from "../utils/user";

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
    useEffect(() => {
        setAvailCourses(
            user.getCourseStaff
                .filter(
                    (courseStaff) =>
                        user.isAdmin || allowedRoles.includes(courseStaff.role)
                )
                .map((courseStaff) => [
                    courseStaff.course.id,
                    courseStaff.course.code,
                ])
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, JSON.stringify(allowedRoles)]);
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
