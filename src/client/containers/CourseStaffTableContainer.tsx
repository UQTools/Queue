import React from "react";
import { IconButton, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { BsX } from "react-icons/bs";
import { Icon } from "@chakra-ui/icons";
import { capitalCase } from "change-case";
import sortBy from "lodash/sortBy";
import { HelpIcon } from "../components/helpers/HelpIcon";
import { redacted } from "../../constants";
import { CourseStaffResponseType } from "../types/course-staff";

type Props = {
    courseId: string;
    courseStaffs: Array<CourseStaffResponseType>;
    removeCourseStaff: (courseStaffId: string) => void;
};

export const CourseStaffTableContainer: React.FC<Props> = ({
    courseId,
    removeCourseStaff,
    courseStaffs,
}) => {
    if (courseId === "") {
        return null;
    }
    return (
        <Table variant="striped">
            <Thead>
                <Tr>
                    <Th>Username</Th>
                    <Th>Name</Th>
                    <Th>Role</Th>
                    <Th />
                </Tr>
            </Thead>
            <Tbody>
                {sortBy(courseStaffs, (courseStaff) => {
                    return [courseStaff.role, courseStaff.user.name];
                }).map((courseStaff) => (
                    <Tr key={courseStaff.id}>
                        <Td>{courseStaff.user.username}</Td>
                        <Td>
                            {courseStaff.user.name}
                            {courseStaff.user.name === redacted && (
                                <HelpIcon>
                                    {redacted} means that the user either
                                    hasn&apos;t logged in before, or they refuse
                                    to share their name. This will be changed
                                    after they log in or change their
                                    information
                                </HelpIcon>
                            )}
                        </Td>
                        <Td>{capitalCase(courseStaff.role)}</Td>
                        <Td isNumeric>
                            <IconButton
                                ml={2}
                                aria-label="remove-staff"
                                colorScheme="red"
                                icon={<Icon boxSize="1.5em" as={BsX} />}
                                size="md"
                                onClick={() => {
                                    removeCourseStaff(courseStaff.id);
                                }}
                            />
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
};
