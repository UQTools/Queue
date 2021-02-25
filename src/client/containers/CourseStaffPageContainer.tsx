import React, { useCallback, useContext, useEffect, useState } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Heading,
    Select,
    Stack,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { Container } from "../components/helpers/Container";
import {
    StaffRole,
    useAddCourseStaffMutation,
    useGetCoursesLazyQuery,
    useGetCourseStaffLazyQuery,
    useRemoveCourseStaffMutation,
} from "../generated/graphql";
import {
    useLazyQueryWithError,
    useMutationWithError,
} from "../hooks/useApolloHooksWithError";
import { UserContext } from "../utils/user";
import { Map } from "immutable";
import { CourseStaffResponseType } from "../types/course-staff";
import { Loadable } from "../components/helpers/Loadable";
import { AddCourseStaffModal } from "../components/course-staff/AddCourseStaffModal";
import { CourseStaffTableContainer } from "./CourseStaffTableContainer";

type Props = {};

export const CourseStaffPageContainer: React.FC<Props> = () => {
    const user = useContext(UserContext)!;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [courseId, setCourseId] = useState("");
    const [availCourses, setAvailCourses] = useState<[string, string][]>([]);
    const toast = useToast();
    const [
        removeCourseStaffMutation,
        { data: removeCourseStaffData },
    ] = useMutationWithError(useRemoveCourseStaffMutation, {
        errorPolicy: "all",
    });
    const [
        addCourseStaff,
        { data: addCourseStaffData, loading: addCourseStaffLoading },
    ] = useMutationWithError(useAddCourseStaffMutation, { errorPolicy: "all" });
    const [
        getCourseStaff,
        { data: getCourseStaffData },
    ] = useLazyQueryWithError(useGetCourseStaffLazyQuery, {
        errorPolicy: "all",
    });
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
                user.courseStaff
                    .filter(
                        (courseStaff) =>
                            courseStaff.role === StaffRole.Coordinator
                    )
                    .map((courseStaff) => [
                        courseStaff.course.id,
                        courseStaff.course.code,
                    ])
            );
        }
    }, [user, getCoursesData]);
    useEffect(() => {
        if (courseId === "") {
            return;
        }
        getCourseStaff({
            variables: {
                courseId,
            },
        });
    }, [courseId, getCourseStaff]);
    const removeCourseStaff = useCallback(
        (courseStaffId: string) => {
            removeCourseStaffMutation({
                variables: {
                    courseStaffId,
                },
            });
        },
        [removeCourseStaffMutation]
    );
    const [courseStaff, setCourseStaff] = useState<
        Map<string, CourseStaffResponseType>
    >(Map());
    useEffect(() => {
        if (!addCourseStaffData) {
            return;
        }
        addCourseStaffData.addStaff.forEach((courseStaff) => {
            setCourseStaff((prev) => prev.set(courseStaff.id, courseStaff));
        });
    }, [addCourseStaffData]);
    useEffect(() => {
        if (!getCourseStaffData) {
            return;
        }
        setCourseStaff((prev) => prev.clear());
        getCourseStaffData.getCourseStaff.forEach((courseStaff) => {
            setCourseStaff((prev) => prev.set(courseStaff.id, courseStaff));
        });
    }, [getCourseStaffData]);
    useEffect(() => {
        if (!removeCourseStaffData) {
            return;
        }
        const removed = courseStaff.get(removeCourseStaffData.removeStaff);
        setCourseStaff((prev) =>
            prev.remove(removeCourseStaffData.removeStaff)
        );
        toast({
            title: "Staff member removed",
            description: `User ${removed?.user.username} removed from course`,
            status: "success",
            isClosable: true,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [removeCourseStaffData]);
    const addStaff = useCallback(
        (values: { usernames: string[]; role: StaffRole }) => {
            addCourseStaff({
                variables: {
                    usernames: values.usernames,
                    courseId,
                    role: values.role,
                },
            });
        },
        [courseId, addCourseStaff]
    );
    return (
        <Container>
            <Heading>Course Staff</Heading>
            <Stack mt={4} spacing={4} direction="column">
                <FormControl>
                    <FormLabel fontWeight="bold">Course:</FormLabel>
                    <Select
                        onChange={(e) => setCourseId(e.target.value)}
                        value={courseId}
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
                <Stack direction="row" justifyContent="flex-end">
                    {courseId !== "" && (
                        <Button colorScheme="green" onClick={onOpen}>
                            Add Staff
                        </Button>
                    )}
                </Stack>
                {courseId !== "" && (
                    <Loadable isLoading={!getCourseStaffData}>
                        <Box h="80vh" overflow="auto">
                            <CourseStaffTableContainer
                                courseId={courseId}
                                courseStaffs={courseStaff.valueSeq().toArray()}
                                removeCourseStaff={removeCourseStaff}
                            />
                        </Box>
                    </Loadable>
                )}
            </Stack>
            <AddCourseStaffModal
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={(values) => {
                    addStaff(values);
                    onClose();
                }}
                loading={addCourseStaffLoading}
            />
        </Container>
    );
};
