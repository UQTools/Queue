import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container } from "../components/helpers/Container";
import {
    useLazyQueryWithError,
    useMutationWithError,
    useQueryWithError,
} from "../hooks/useApolloHooksWithError";
import {
    useAskQuestionMutation,
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
        Map<string, { [key: string]: QuestionProps }>
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
    const [
        askQuestionMutation,
        { data: askQuestionData },
    ] = useMutationWithError(useAskQuestionMutation);
    const askQuestion = useCallback(
        (queueId: string) => {
            askQuestionMutation({
                variables: { queueId },
            });
        },
        [askQuestionMutation]
    );

    useEffect(() => {
        if (!roomData) {
            return;
        }
        roomData.getRoomById.queues.forEach((queue) => {
            setQueueQuestions((prev) =>
                prev.set(
                    queue.id,
                    queue.activeQuestions.reduce(
                        (prevValue, question) => ({
                            ...prevValue,
                            [question.id]: {
                                id: question.id,
                                askerName: question.op.name,
                                askedTime: parseISO(question.createdTime),
                                questionCount: question.questionsAsked,
                                status: question.status,
                            },
                        }),
                        {}
                    )
                )
            );
        });
    }, [roomData, courseCode]);

    useEffect(() => {
        if (!askQuestionData) {
            return;
        }
        const question = askQuestionData.askQuestion;
        setQueueQuestions((prev) =>
            prev.set(question.queue.id, {
                ...(prev.get(question.queue.id) || {}),
                [question.id]: {
                    id: question.id,
                    askerName: question.op.name,
                    askedTime: parseISO(question.createdTime),
                    questionCount: question.questionsAsked,
                    status: question.status,
                },
            })
        );
    }, [askQuestionData]);

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
                        questions={Object.values(
                            queueQuestions.get(queue.id) || {}
                        )}
                        queueCount={roomData?.getRoomById.queues.length || 1}
                        askQuestion={askQuestion}
                    />
                ))}
            </Flex>
        </Container>
    );
};
