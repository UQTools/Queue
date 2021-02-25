import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { HomePageContainer } from "./containers/HomePageContainer";
import { CoursePageContainer } from "./containers/CoursePageContainer";
import { PermissionDenied } from "./PermissionDenied";
import { SecretRoute } from "./components/helpers/SecretRoute";
import { RoomPageContainer } from "./containers/RoomPageContainer";
import { CourseStaffPageContainer } from "./containers/CourseStaffPageContainer";
import { StaffRole } from "./generated/graphql";

export const AppRouter: React.FunctionComponent<{}> = () => {
    return (
        <BrowserRouter>
            <NavBar />
            <Switch>
                <Route path="/" component={HomePageContainer} exact />
                <Route
                    path="/permission-denied"
                    component={PermissionDenied}
                    exact
                />
                <SecretRoute
                    path="/rooms"
                    component={RoomPageContainer}
                    exact
                />
                <SecretRoute
                    path="/course-staff"
                    component={CourseStaffPageContainer}
                    allowedRoles={[StaffRole.Coordinator]}
                    exact
                />
                <Route path="/:courseCode">
                    <CoursePageContainer />
                </Route>
            </Switch>
        </BrowserRouter>
    );
};
