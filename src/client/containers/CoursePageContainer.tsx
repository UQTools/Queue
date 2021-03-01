import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useHistory, useParams } from "react-router-dom";
import { Container } from "../components/helpers/Container";
import {
    useLazyQueryWithError,
    useMutationWithError,
    useQueryWithError,
    useSubscriptionWithError,
} from "../hooks/useApolloHooksWithError";
import {
    QuestionStatus,
    QueueSortType,
    QueueTheme,
    UpdateQuestionStatusMutation,
    UpdateQueueMutation,
    useAskQuestionMutation,
    useCreateQueueMutation,
    useGetActiveRoomsQuery,
    useGetRoomByIdLazyQuery,
    useQuestionChangeSubscription,
    useRemoveQueueMutation,
    useUpdateQuestionStatusMutation,
    useUpdateQueueMutation,
} from "../generated/graphql";
import {
    Button,
    Flex,
    Spacer,
    Text,
    useDisclosure,
    useMediaQuery,
    useToast,
} from "@chakra-ui/react";
import { QuestionProps } from "./QuestionContainer";
import { RoomSelector } from "../components/queue/RoomSelector";
import { Map } from "immutable";
import { Queue, QueueProps } from "../components/queue/Queue";
import parseISO from "date-fns/parseISO";
import { ClaimModal } from "../components/queue/ClaimModal";
import omit from "lodash/omit";
import { UserContext } from "../utils/user";
import { QueueModal } from "../components/queue/QueueModal";
import { pushNotification, QueueContext } from "../utils/queue";
import sortBy from "lodash/sortBy";
import { redacted } from "../../constants";

type Props = {};

type CourseParam = {
    courseCode: string;
};

const placeholderQueue: QueueProps = {
    id: "",
    name: "",
    theme: QueueTheme.Red,
    shortDescription: "",
    examples: [],
    actions: [],
    sortType: QueueSortType.QuestionsAndTime,
    clearAfterMidnight: true,
    showEnrolledSession: false,
    createdAt: new Date(),
};

export const CoursePageContainer: React.FC<Props> = () => {
    const [isSmallerThan540] = useMediaQuery("(max-width: 540px)");
    const {
        isOpen: isClaimModalOpen,
        onOpen: openClaimModal,
        onClose: closeClaimModal,
    } = useDisclosure();
    const {
        isOpen: isQueueModalOpen,
        onOpen: openQueueModal,
        onClose: closeQueueModal,
    } = useDisclosure();
    const [queues, setQueues] = useState<Map<string, QueueProps>>(Map());
    const [addingNewQueue, setAddingNewQueue] = useState(false);
    const [chosenQueueId, setChosenQueueId] = useState("");
    const [chosenRoomId, setChosenRoomId] = useState("default");
    const [displayedQueues, setDisplayedQueues] = useState<string[]>([]);
    const [selectedQuestion, setSelectedQuestion] = useState("");
    const { courseCode } = useParams<CourseParam>();
    const history = useHistory();
    const [queueQuestions, setQueueQuestions] = useState<
        Map<string, { [key: string]: QuestionProps }>
    >(Map());
    const toast = useToast();
    const {
        data: activeRoomsData,
        error: activeRoomsError,
    } = useQueryWithError(useGetActiveRoomsQuery, {
        variables: {
            courseCode,
        },
        errorPolicy: "all",
    });
    const [getRoomById, { data: roomData }] = useLazyQueryWithError(
        useGetRoomByIdLazyQuery,
        {
            errorPolicy: "all",
            pollInterval: 30000,
            fetchPolicy: "cache-and-network",
        }
    );
    const [
        updateQueue,
        { data: updateQueueData },
    ] = useMutationWithError(useUpdateQueueMutation, { errorPolicy: "all" });
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
    const [
        createQueueMutation,
        { data: createQueueData },
    ] = useMutationWithError(useCreateQueueMutation, {
        errorPolicy: "all",
    });
    const [
        removeQueueMutation,
        { data: removeQueueData },
    ] = useMutationWithError(useRemoveQueueMutation, { errorPolicy: "all" });
    useEffect(() => {
        if (!activeRoomsError) {
            return;
        }
        history.push("/");
    }, [activeRoomsError, history]);
    const askQuestion = useCallback(
        (queueId: string) => {
            askQuestionMutation({
                variables: { queueId },
            });
        },
        [askQuestionMutation]
    );
    const editQueue = useCallback(
        (queueId: string) => {
            setChosenQueueId(queueId);
            setAddingNewQueue(false);
            openQueueModal();
        },
        [openQueueModal]
    );
    const user = useContext(UserContext)!;
    const updateQueues = useCallback(
        (queue: UpdateQueueMutation["updateQueue"]) => {
            setQueues((prev) =>
                prev.set(queue.id, {
                    id: queue.id,
                    name: queue.name,
                    theme: queue.theme,
                    shortDescription: queue.shortDescription,
                    actions: queue.actions,
                    sortType: queue.sortedBy,
                    examples: queue.examples,
                    clearAfterMidnight: queue.clearAfterMidnight,
                    showEnrolledSession: queue.showEnrolledSession,
                    createdAt: parseISO(queue.createdAt),
                })
            );
        },
        []
    );
    const isStaff = useMemo(() => {
        if (!user) {
            return false;
        }
        if (user.isAdmin) {
            return true;
        }
        return user.courseStaff.some(
            (courseStaff) => courseStaff.course.code === courseCode
        );
    }, [user, courseCode]);

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
                        askerUsername: question.op.username,
                        askerEmail:
                            question.op.email === redacted
                                ? `${question.op.username}@student.uq.edu.au`
                                : question.op.email,
                        askedTime: parseISO(question.createdTime),
                        questionCount: question.questionsAsked,
                        status: question.status,
                        claimer: question.claimer,
                        enrolledSession: question.enrolledIn,
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
                    queue.activeQuestions.reduce<{
                        [key: string]: QuestionProps;
                    }>(
                        (prevValue, question) => ({
                            ...prevValue,
                            [question.id]: {
                                id: question.id,
                                askerName: question.op.name,
                                askerUsername: question.op.username,
                                askedTime: parseISO(question.createdTime),
                                questionCount: question.questionsAsked,
                                status: question.status,
                                askerEmail:
                                    question.op.email === redacted
                                        ? `${question.op.username}@student.uq.edu.au`
                                        : question.op.email,
                                enrolledSession: question.enrolledIn,
                                claimer: question.claimer,
                            },
                        }),
                        {}
                    )
                )
            );
            updateQueues(queue);
        });
        setDisplayedQueues(
            roomData.getRoomById.queues.map((queue) => queue.id)
        );
    }, [roomData, courseCode, updateQueues]);

    useEffect(() => {
        if (!questionChangeData) {
            return;
        }
        const updatedQuestion = questionChangeData.questionChanges;
        updateQueueQuestion(updatedQuestion);
        if (
            updatedQuestion.op.username === user.username &&
            updatedQuestion.status === QuestionStatus.Claimed
        ) {
            pushNotification(
                "Question Claimed",
                updatedQuestion.claimMessage || "Your question has been claimed"
            );
            toast({
                title: "Question Claimed",
                description: updatedQuestion.claimMessage,
                status: "success",
                duration: null,
                isClosable: true,
            });
        }
    }, [questionChangeData, updateQueueQuestion, user.username, toast]);

    useEffect(() => {
        document.title = `${courseCode} Queue`;
    }, [courseCode]);

    useEffect(() => {
        if (!askQuestionData) {
            return;
        }
        const question = askQuestionData.askQuestion;
        updateQueueQuestion(question);
    }, [askQuestionData, updateQuestionData, updateQueueQuestion]);
    useEffect(() => {
        if (!removeQueueData) {
            return;
        }
        const removedId = removeQueueData.removeQueue;
        setDisplayedQueues((prev) =>
            prev.filter((queueId) => queueId !== removedId)
        );
        setQueues((prev) => prev.remove(removedId));
    }, [removeQueueData]);

    const updateQuestionStatus = useCallback(
        (
            questionId: string,
            questionStatus: QuestionStatus,
            message?: string
        ) => {
            updateQuestionMutation({
                variables: {
                    questionStatus,
                    questionId,
                    message,
                },
            });
        },
        [updateQuestionMutation]
    );
    useEffect(() => {
        if (!updateQuestionData) {
            return;
        }
        const newQuestion = updateQuestionData.updateQuestionStatus;
        updateQueueQuestion(newQuestion);
    }, [updateQuestionData, updateQueueQuestion]);
    useEffect(() => {
        if (!createQueueData) {
            return;
        }
        const newQueue = createQueueData.createQueue;
        updateQueues(newQueue);
        setDisplayedQueues((prev) => [...prev, newQueue.id]);
    }, [createQueueData, updateQueues]);

    useEffect(() => {
        if (!updateQueueData) {
            return;
        }
        const updatedQueue = updateQueueData.updateQueue;
        updateQueues(updatedQueue);
    }, [updateQueueData, updateQueues]);
    return (
        <QueueContext.Provider
            value={{
                updateQuestionStatus,
                setSelectedQuestion,
                openClaimModal,
                courseCode,
            }}
        >
            <Container>
                <Text fontSize="3xl" mb={3}>
                    {courseCode}
                </Text>
                <Flex alignItems="center">
                    <RoomSelector
                        selected={chosenRoomId}
                        onSelect={(roomId) => {
                            getRoomById({
                                variables: {
                                    roomId,
                                },
                            });
                            setChosenRoomId(roomId);
                        }}
                        rooms={
                            activeRoomsData?.getActiveRooms.map((room) => [
                                room.id,
                                room.name,
                            ]) || []
                        }
                    />
                    <Spacer />
                    {isStaff && chosenRoomId !== "default" && (
                        <Button
                            onClick={() => {
                                setAddingNewQueue(true);
                                openQueueModal();
                            }}
                            colorScheme="green"
                            ml="auto"
                            mt={3}
                        >
                            Add new queue
                        </Button>
                    )}
                </Flex>
                <Flex
                    wrap="wrap"
                    mt={6}
                    justifyContent="space-around"
                    direction={isSmallerThan540 ? "column" : "row"}
                >
                    {sortBy(displayedQueues, (queueId) => {
                        return queues.get(queueId)?.createdAt || new Date();
                    }).map((queueId, key) => (
                        <Queue
                            key={key}
                            {...(queues.get(queueId) || placeholderQueue)}
                            questions={Object.values(
                                queueQuestions.get(queueId) || {}
                            )}
                            askQuestion={askQuestion}
                            // buttonsOnClick={queueButtonAction}
                            isStaff={isStaff}
                            openEditQueueModal={editQueue}
                        />
                    ))}
                </Flex>
            </Container>
            <ClaimModal
                isOpen={isClaimModalOpen}
                close={closeClaimModal}
                questionId={selectedQuestion}
            />
            <QueueModal
                {...(addingNewQueue
                    ? placeholderQueue
                    : queues.get(chosenQueueId) || placeholderQueue)}
                close={closeQueueModal}
                onSubmit={({
                    id,
                    name,
                    shortDescription,
                    actions,
                    sortType,
                    examples,
                    clearAfterMidnight,
                    theme,
                    showEnrolledSession,
                }) => {
                    if (addingNewQueue) {
                        createQueueMutation({
                            variables: {
                                roomId: chosenRoomId,
                                queueInput: {
                                    name,
                                    shortDescription,
                                    examples,
                                    theme,
                                    sortedBy: sortType,
                                    clearAfterMidnight,
                                    actions,
                                    showEnrolledSession,
                                },
                            },
                        });
                        setAddingNewQueue(false);
                    } else {
                        updateQueue({
                            variables: {
                                queueId: id,
                                queueInput: {
                                    name,
                                    shortDescription,
                                    actions,
                                    examples,
                                    clearAfterMidnight,
                                    sortedBy: sortType,
                                    theme,
                                    showEnrolledSession,
                                },
                            },
                        });
                    }
                }}
                isOpen={isQueueModalOpen}
                header={addingNewQueue ? "Add a new Queue" : "Edit Queue"}
                onRemove={
                    addingNewQueue
                        ? undefined
                        : async (queueId) => {
                              await removeQueueMutation({
                                  variables: {
                                      queueId,
                                  },
                              });
                              closeQueueModal();
                          }
                }
            />
        </QueueContext.Provider>
    );
};
