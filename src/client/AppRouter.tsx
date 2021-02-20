import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { HomePageContainer } from "./containers/HomePageContainer";
import { CoursePageContainer } from "./containers/CoursePageContainer";

export const AppRouter: React.FunctionComponent<{}> = () => {
    return (
        <BrowserRouter>
            <NavBar />
            <Switch>
                <Route path="/" component={HomePageContainer} exact />
                <Route path="/:courseId">
                    <CoursePageContainer />
                </Route>
            </Switch>
        </BrowserRouter>
    );
};
