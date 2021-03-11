import {
    Box,
    Divider,
    Table,
    Tbody,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { QueueAction, QueueSortType } from "../../generated/graphql";
import {
    QuestionContainer,
    QuestionProps,
} from "../../containers/QuestionContainer";
import sortBy from "lodash/sortBy";
import differenceInSeconds from "date-fns/differenceInSeconds";
import { secondsToText } from "../../utils/queue";
import { useInterval } from "../../hooks/useInterval";

export type Props = {
    sortType: QueueSortType;
    questions: QuestionProps[];
    actions: QueueAction[];
    isStaff: boolean;
    showEnrolledSession: boolean;
    sessionFilter: string;
};

export const QuestionList: React.FC<Props> = ({
    questions,
    sortType,
    actions,
    isStaff,
    showEnrolledSession,
    sessionFilter,
}) => {
    const [averageWaitTime, setAverageWaitTime] = useState(0);
    const updateAverageTime = useCallback(() => {
        const totalWaitTime = questions
            .map((question) =>
                differenceInSeconds(new Date(), question.askedTime)
            )
            .reduce((a, b) => a + b, 0);
        setAverageWaitTime(totalWaitTime / questions.length);
    }, [questions]);
    const filterQuestions = useCallback(
        (questions: QuestionProps[]) => {
            return questions.filter((question) =>
                question.enrolledSession?.includes(sessionFilter)
            );
        },
        [sessionFilter]
    );
    const sortQuestions = useCallback(
        (questions: QuestionProps[]) => {
            switch (sortType) {
                case QueueSortType.Questions:
                    return sortBy(
                        questions,
                        (question) => question.questionCount
                    );
                case QueueSortType.Time:
                    return sortBy(questions, (question) =>
                        question.askedTime.getTime()
                    );
                case QueueSortType.QuestionsAndTime:
                    return sortBy(questions, (question) => {
                        const elapsedTime =
                            new Date().getTime() - question.askedTime.getTime();
                        return -elapsedTime / (question.questionCount + 1);
                    });
            }
        },
        [sortType]
    );
    useInterval(updateAverageTime, 5000);
    return (
        <>
            <Divider />
            <Text verticalAlign="middle" py={3}>
                {questions.length > 0 ? (
                    <>
                        An average wait time of{" "}
                        <strong>{secondsToText(averageWaitTime)}</strong> for{" "}
                        <em>{questions.length}</em> student
                        {questions.length > 1 && "s"}
                    </>
                ) : (
                    "No students on queue"
                )}
            </Text>
            <Divider />
            <Box w="100%" overflowX="auto">
                <Table>
                    <Thead>
                        <Tr>
                            <Th>#</Th>
                            <Th>Name</Th>
                            <Th isNumeric>Questions today</Th>
                            <Th>Elapsed time</Th>
                            {showEnrolledSession && <Th>Enrolled in</Th>}
                            <Th />
                        </Tr>
                    </Thead>
                    <Tbody>
                        {sortQuestions(filterQuestions(questions)).map(
                            (question, key) => (
                                <QuestionContainer
                                    {...question}
                                    key={key}
                                    actions={actions}
                                    index={key + 1}
                                    isStaff={isStaff}
                                    showEnrolledSession={showEnrolledSession}
                                />
                            )
                        )}
                    </Tbody>
                </Table>
            </Box>
        </>
    );
};
