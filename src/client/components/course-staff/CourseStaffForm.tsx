import React from "react";
import { StaffRole } from "../../generated/graphql";
import { FormikInput } from "../helpers/FormikInput";
import { FormikSelect } from "../helpers/FormikSelect";
import { Textarea } from "@chakra-ui/react";

type Props = {
    usernames?: string;
    role?: StaffRole;
    onSubmit: (values: { usernames: string[]; role: StaffRole }) => void;
    editable?: boolean;
};

export const CourseStaffForm: React.FC<Props> = ({
    usernames = "",
    role = StaffRole.Staff,
    onSubmit,
    editable = false,
}) => {
    return (
        <>
            <FormikInput
                name="usernames"
                isDisabled={!editable}
                isRequired
                helperText="Enter comma separated usernames"
                as={Textarea}
            />
            <FormikSelect
                name="role"
                options={[StaffRole.Coordinator, StaffRole.Staff]}
            />
        </>
    );
};
