import { Divider, Table, Tbody, Text, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { QueueAction, QueueSortType } from "../../generated/graphql";
import { Question, QuestionProps } from "./Question";
import sortBy from "lodash/sortBy";
import differenceInSeconds from "date-fns/differenceInSeconds";
import { secondsToText } from "../../utils/queue";

export type Props = {
    sortType: QueueSortType;
    questions: QuestionProps[];
    actions: QueueAction[];
    buttonsOnClick: (questionId: string, queueAction: QueueAction) => void;
    isStaff: boolean;
};

export const QuestionList: React.FC<Props> = ({
    questions,
    sortType,
    actions,
    buttonsOnClick,
    isStaff,
}) => {
    const [currentInterval, setCurrentInterval] = useState<
        ReturnType<typeof setInterval>
    >();
    const sortedQuestions = useMemo(() => {
        switch (sortType) {
            case QueueSortType.Questions:
                return sortBy(questions, (question) => question.questionCount);
            case QueueSortType.Time:
                return sortBy(questions, (question) =>
                    question.askedTime.getTime()
                );
            case QueueSortType.QuestionsAndTime:
                return sortBy(questions, (question) => {
                    const elapsedTime =
                        new Date().getTime() - question.askedTime.getTime();
                    return elapsedTime * question.questionCount;
                });
        }
    }, [questions, sortType]);
    const [averageWaitTime, setAverageWaitTime] = useState(0);
    const updateAverageTime = useCallback(() => {
        const totalWaitTime = questions
            .map((question) =>
                differenceInSeconds(new Date(), question.askedTime)
            )
            .reduce((a, b) => a + b, 0);
        setAverageWaitTime(totalWaitTime / questions.length);
        setCurrentInterval(setTimeout(updateAverageTime, 10000));
    }, [questions]);
    useEffect(() => {
        updateAverageTime();
    }, [updateAverageTime]);
    useEffect(() => {
        if (currentInterval) {
            clearInterval(currentInterval);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questions]);
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
            <Table>
                <Thead>
                    <Tr>
                        <Th>#</Th>
                        <Th>Name</Th>
                        <Th isNumeric>Questions today</Th>
                        <Th>Elapsed time</Th>
                        {isStaff && <Th />}
                    </Tr>
                </Thead>
                <Tbody>
                    {sortedQuestions.map((question, key) => (
                        <Question
                            {...question}
                            key={key}
                            actions={actions}
                            index={key + 1}
                            buttonsOnClick={buttonsOnClick}
                            isStaff={isStaff}
                        />
                    ))}
                </Tbody>
            </Table>
        </>
    );
};
