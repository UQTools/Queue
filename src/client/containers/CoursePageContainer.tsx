import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container } from "../components/helpers/Container";
import {
    useLazyQueryWithError,
    useQueryWithError,
} from "../hooks/useApolloHooksWithError";
import {
    useGetActiveRoomsQuery,
    useGetRoomByIdLazyQuery,
} from "../generated/graphql";
import { Flex, FormLabel, HStack, Select } from "@chakra-ui/react";
import { Queue } from "../components/Queue";

type Props = {};

type CourseParam = {
    courseCode: string;
};

export const CoursePageContainer: React.FC<Props> = ({}) => {
    const { courseCode } = useParams<CourseParam>();
    const { data: activeRoomsData } = useQueryWithError(
        useGetActiveRoomsQuery,
        {
            courseCode,
        }
    );
    const [getRoomById, { data: roomData }] = useLazyQueryWithError(
        useGetRoomByIdLazyQuery
    );

    return (
        <Container>
            <Flex alignItems="center">
                <FormLabel>Choose room:</FormLabel>
                <Select
                    onChange={(e) => {
                        getRoomById({
                            variables: {
                                roomId: e.target.value,
                            },
                        });
                    }}
                    maxW="30%"
                >
                    {(activeRoomsData?.getActiveRooms || []).map(
                        (room, key) => (
                            <option key={key} value={room.id}>
                                {room.name}
                            </option>
                        )
                    )}
                </Select>
            </Flex>
            <HStack spacing={6}>
                {roomData?.getRoomById.queues.map((queue, key) => (
                    <Queue {...queue} key={key}/>
                ))}
            </HStack>
        </Container>
    );
};
