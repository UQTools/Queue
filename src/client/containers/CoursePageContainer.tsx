import React from "react";
import { useParams } from "react-router-dom";
import { Container } from "../components/helpers/Container";
import {
    useLazyQueryWithError,
    useQueryWithError,
} from "../hooks/useApolloHooksWithError";
import {
    useGetActiveRoomsLazyQuery,
    useGetActiveRoomsQuery,
    useGetRoomByIdLazyQuery,
} from "../generated/graphql";
import { Select } from "@chakra-ui/react";

type Props = {};

type CourseParam = {
    courseCode: string;
};

export const CoursePageContainer: React.FC<Props> = ({}) => {
    const { courseCode } = useParams<CourseParam>();
    const { data: roomIdsData } = useQueryWithError(useGetActiveRoomsQuery, {
        courseCode,
    });
    const [getRoomById, { data: roomData }] = useLazyQueryWithError(
        useGetRoomByIdLazyQuery
    );

    return (
        <Container>
            <Select onChange={(e) => {}}>
                {(roomIdsData?.getActiveRooms || []).map((room, key) => (
                    <option key={key} value={room.id}>
                        {room.name}
                    </option>
                ))}
            </Select>
            {courseCode}
        </Container>
    );
};
