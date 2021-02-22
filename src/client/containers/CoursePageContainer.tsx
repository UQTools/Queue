import React, { useEffect, useState } from "react";
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
import { Flex, useMediaQuery } from "@chakra-ui/react";
import { QuestionProps } from "../components/queue/Question";
import { RoomSelector } from "../components/queue/RoomSelector";
import { Map } from "immutable";
import { Queue } from "../components/queue/Queue";
import parseISO from "date-fns/parseISO";

type Props = {};

type CourseParam = {
    courseCode: string;
};

export const CoursePageContainer: React.FC<Props> = () => {
    const [isSmallerThan540] = useMediaQuery("(max-width: 540px)");
    const { courseCode } = useParams<CourseParam>();
    useEffect(() => {
        document.title = `${courseCode} Queue`;
    }, [courseCode]);
    const [queueQuestions, setQueueQuestions] = useState<
        Map<string, QuestionProps[]>
    >(Map());
    const { data: activeRoomsData } = useQueryWithError(
        useGetActiveRoomsQuery,
        {
            courseCode,
        }
    );
    const [getRoomById, { data: roomData }] = useLazyQueryWithError(
        useGetRoomByIdLazyQuery
    );

    useEffect(() => {
        if (!roomData) {
            return;
        }
        roomData.getRoomById.queues.forEach((queue) => {
            setQueueQuestions((prev) =>
                prev.set(
                    queue.id,
                    queue.activeQuestions.map((question) => ({
                        id: question.id,
                        askerName: question.op.name,
                        askedTime: parseISO(question.createdTime),
                        questionCount: question.op.courseMetas.filter(
                            (courseMeta) =>
                                courseMeta.course.code === courseCode
                        )[0].questionsAsked,
                        status: question.status,
                    }))
                )
            );
        });
    }, [roomData, courseCode]);

    return (
        <Container>
            <RoomSelector
                onSelect={(roomId) => {
                    getRoomById({
                        variables: {
                            roomId,
                        },
                    });
                }}
                rooms={
                    activeRoomsData?.getActiveRooms.map((room) => [
                        room.id,
                        room.name,
                    ]) || []
                }
            />
            <Flex
                wrap="wrap"
                mt={6}
                justifyContent="space-around"
                direction={isSmallerThan540 ? "column" : "row"}
            >
                {roomData?.getRoomById.queues.map((queue, key) => (
                    <Queue
                        key={key}
                        examples={queue.examples}
                        id={queue.id}
                        name={queue.name}
                        shortDescription={queue.shortDescription}
                        theme={queue.theme}
                        actions={queue.actions}
                        sortType={queue.sortedBy}
                        questions={queueQuestions.get(queue.id) || []}
                        queueCount={roomData?.getRoomById.queues.length || 1}
                    />
                ))}
            </Flex>
        </Container>
    );
};
