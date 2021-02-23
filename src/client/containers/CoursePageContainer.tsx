import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container } from "../components/helpers/Container";
import {
    useLazyQueryWithError,
    useMutationWithError,
    useQueryWithError,
    useSubscriptionWithError,
} from "../hooks/useApolloHooksWithError";
import {
    QuestionStatus,
    QueueAction,
    UpdateQuestionStatusMutation,
    useAskQuestionMutation,
    useGetActiveRoomsQuery,
    useGetRoomByIdLazyQuery,
    useQuestionChangeSubscription,
    useUpdateQuestionStatusMutation,
} from "../generated/graphql";
import { Flex, Text, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import { QuestionProps } from "../components/queue/Question";
import { RoomSelector } from "../components/queue/RoomSelector";
import { Map } from "immutable";
import { Queue } from "../components/queue/Queue";
import parseISO from "date-fns/parseISO";
import { ClaimModal } from "../components/queue/ClaimModal";
import omit from "lodash/omit";

type Props = {};

type CourseParam = {
    courseCode: string;
};

export const CoursePageContainer: React.FC<Props> = () => {
    const [isSmallerThan540] = useMediaQuery("(max-width: 540px)");
    const {
        isOpen: isClaimModalOpen,
        onOpen: openClaimModal,
        onClose: closeClaimModal,
    } = useDisclosure();
    const [claimMessage, setClaimMessage] = useState("");
    const [selectedQuestion, setSelectedQuestion] = useState("");
    const { courseCode } = useParams<CourseParam>();
    const [queueQuestions, setQueueQuestions] = useState<
        Map<string, { [key: string]: QuestionProps }>
    >(Map());
    const { data: activeRoomsData } = useQueryWithError(
        useGetActiveRoomsQuery,
        {
            variables: {
                courseCode,
            },
            errorPolicy: "all",
        }
    );
    const [currentRoomId, setCurrentRoomId] = useState("");
    const [getRoomById, { data: roomData }] = useLazyQueryWithError(
        useGetRoomByIdLazyQuery,
        {
            errorPolicy: "all",
            pollInterval: 30000,
        }
    );
    const { data: questionChangeData } = useSubscriptionWithError(
        useQuestionChangeSubscription,
        {
            variables: {
                roomId: roomData?.getRoomById.id || "",
            },
        }
    );
    const [
        askQuestionMutation,
        { data: askQuestionData },
    ] = useMutationWithError(useAskQuestionMutation, { errorPolicy: "all" });
    const [
        updateQuestionMutation,
        { data: updateQuestionData },
    ] = useMutationWithError(useUpdateQuestionStatusMutation, {
        errorPolicy: "all",
    });
    const askQuestion = useCallback(
        (queueId: string) => {
            askQuestionMutation({
                variables: { queueId },
            });
        },
        [askQuestionMutation]
    );
    const claimQuestion = useCallback(
        (message: string) => {
            updateQuestionMutation({
                variables: {
                    questionId: selectedQuestion,
                    questionStatus: QuestionStatus.Claimed,
                    message,
                },
            });
        },
        [updateQuestionMutation, selectedQuestion]
    );

    const updateQueueQuestion = useCallback(
        (question: UpdateQuestionStatusMutation["updateQuestionStatus"]) => {
            if (
                [QuestionStatus.Closed, QuestionStatus.Accepted].includes(
                    question.status
                )
            ) {
                setQueueQuestions((prev) =>
                    prev.set(
                        question.queue.id,
                        omit(prev.get(question.queue.id) || {}, question.id)
                    )
                );
                return;
            }
            setQueueQuestions((prev) =>
                prev.set(question.queue.id, {
                    ...(prev.get(question.queue.id) || {}),
                    [question.id]: {
                        id: question.id,
                        askerName: question.op.name,
                        askedTime: parseISO(question.createdTime),
                        questionCount: question.questionsAsked,
                        status: question.status,
                        claimerName: question.claimer?.name,
                    },
                })
            );
        },
        []
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
        if (!questionChangeData) {
            return;
        }
        const updatedQuestion = questionChangeData.questionChanges;
        updateQueueQuestion(updatedQuestion);
    }, [questionChangeData]);

    useEffect(() => {
        document.title = `${courseCode} Queue`;
    }, [courseCode]);

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
                    claimerName: question.claimer?.name,
                },
            })
        );
    }, [askQuestionData]);

    const queueButtonAction = useCallback(
        (questionId: string, questionAction: QueueAction) => {
            if (questionAction === QueueAction.Accept) {
                updateQuestionMutation({
                    variables: {
                        questionStatus: QuestionStatus.Accepted,
                        questionId,
                    },
                });
            } else if (questionAction === QueueAction.Remove) {
                updateQuestionMutation({
                    variables: {
                        questionStatus: QuestionStatus.Closed,
                        questionId,
                    },
                });
            } else if (questionAction === QueueAction.Claim) {
                setSelectedQuestion(questionId);
                openClaimModal();
            } else if (questionAction === QueueAction.Email) {
                // TODO
            }
        },
        [updateQuestionMutation, openClaimModal]
    );
    useEffect(() => {
        if (!updateQuestionData) {
            return;
        }
        const newQuestion = updateQuestionData.updateQuestionStatus;
        updateQueueQuestion(newQuestion);
    }, [updateQuestionData, updateQueueQuestion]);

    return (
        <>
            <Container>
                <Text fontSize="3xl" mb={3}>
                    {courseCode}
                </Text>
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
                            queueCount={
                                roomData?.getRoomById.queues.length || 1
                            }
                            askQuestion={askQuestion}
                            buttonsOnClick={queueButtonAction}
                        />
                    ))}
                </Flex>
            </Container>
            <ClaimModal
                isOpen={isClaimModalOpen}
                close={closeClaimModal}
                setMessage={setClaimMessage}
                message={claimMessage}
                submit={claimQuestion}
            />
        </>
    );
};
