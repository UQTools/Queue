import React, { useContext } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { UserContext } from "../../utils/user";

type Props = RouteProps;

export const SecretRoute: React.FC<Props> = (props) => {
    const user = useContext(UserContext);
    if (!user) {
        return <Redirect to="/permission-denied" />;
    }
    if (user.courseStaff.length === 0) {
        return <Redirect to="/permission-denied" />;
    }
    return <Route {...props} />;
};
