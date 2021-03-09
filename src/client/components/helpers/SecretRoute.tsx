import React, { useContext } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { UserContext } from "../../utils/user";
import { StaffRole } from "../../generated/graphql";

type Props = RouteProps & {
    allowedRoles?: StaffRole[];
};

export const SecretRoute: React.FC<Props> = ({
    allowedRoles = [StaffRole.Staff, StaffRole.Coordinator],
    ...props
}) => {
    const user = useContext(UserContext)!;
    if (user.isAdmin) {
        return <Route {...props} />;
    }
    if (user.getCourseStaff.length === 0) {
        return <Redirect to="/permission-denied" />;
    }
    if (
        user.getCourseStaff.filter((courseStaff) =>
            allowedRoles.includes(courseStaff.role)
        ).length === 0
    ) {
        return <Redirect to="/permission-denied" />;
    }
    return <Route {...props} />;
};
