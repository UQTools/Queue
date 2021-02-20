import React from "react";
import { useParams } from "react-router-dom";

type Props = {};

type CourseParam = {
    courseId: string;
};

export const CoursePageContainer: React.FC<Props> = ({}) => {
    const { courseId } = useParams<CourseParam>();

    return <div>{courseId}</div>;
};
