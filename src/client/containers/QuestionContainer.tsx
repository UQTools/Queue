import { HStack, Td, Tr, useColorModeValue } from "@chakra-ui/react";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { QuestionStatus, QueueAction } from "../generated/graphql";
import { differenceInSeconds } from "date-fns";
import { secondsToText } from "../utils/queue";
import { sentenceCase } from "change-case";
import { redacted } from "../../constants";
import { AcceptButtonContainer } from "./action-buttons/AcceptButtonContainer";
import { RejectButtonContainer } from "./action-buttons/RejectButtonContainer";
import { MarkNotNeededQuestionContainer } from "./action-buttons/MarkNotNeededQuestionContainer";
import { ClaimButtonContainer } from "./action-buttons/ClaimButtonContainer";
import { EmailButtonContainer } from "./action-buttons/EmailButtonContainer";
import { UserContext } from "../utils/user";
import { useInterval } from "../hooks/useInterval";

export type QuestionProps = {
    id: string;
    askerName: string;
    askerEmail: string;
    askerUsername: string;
    askedTime: Date;
    questionCount: number;
    status: QuestionStatus;
    enrolledSession: string | null | undefined;
    claimer?: null | {
        name: string;
        username: string;
    };
};

type Props = QuestionProps & {
    isStaff: boolean;
    index: number;
    actions: QueueAction[];
    // buttonsOnClick: (question: QuestionProps, queueAction: QueueAction) => void;
    showEnrolledSession: boolean;
};

export const QuestionContainer: React.FC<Props> = ({
    // buttonsOnClick,
    isStaff,
    showEnrolledSession,
    actions,
    index,
    children: _,
    ...questionProps
}) => {
    const {
        askedTime,
        askerName,
        askerUsername,
        status,
        questionCount,
        enrolledSession,
    } = questionProps;
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    // Continuously update the time every 10 seconds
    const updateTime = useCallback(() => {
        setElapsedSeconds(differenceInSeconds(new Date(), askedTime));
    }, [askedTime]);
    const { username } = useContext(UserContext)!;
    useInterval(updateTime, 5000);

    const elapsedTimeDisplay = useMemo(() => {
        return secondsToText(elapsedSeconds);
    }, [elapsedSeconds]);
    const claimedColour = useColorModeValue("pink.100", "pink.900");
    const notNeededColour = useColorModeValue("gray.100", "gray.700");
    const getActionButton = useCallback((action: QueueAction) => {
        switch (action) {
            case QueueAction.Accept:
                return AcceptButtonContainer;
            case QueueAction.Remove:
                return RejectButtonContainer;
            case QueueAction.MarkNotNeeded:
                return MarkNotNeededQuestionContainer;
            case QueueAction.Claim:
                return ClaimButtonContainer;
            case QueueAction.Email:
                return EmailButtonContainer;
        }
    }, []);
    return (
        <Tr
            bg={
                status === QuestionStatus.Claimed
                    ? claimedColour
                    : status === QuestionStatus.NotNeeded
                    ? notNeededColour
                    : undefined
            }
            textDecor={
                status === QuestionStatus.NotNeeded ? "line-through" : undefined
            }
        >
            <Td>{index}</Td>
            <Td>{askerName === redacted ? askerUsername : askerName}</Td>
            <Td isNumeric>{questionCount}</Td>
            <Td>{sentenceCase(elapsedTimeDisplay)} ago</Td>
            {showEnrolledSession && <Td>{enrolledSession || "None"}</Td>}
            <Td>
                <HStack spacing={1}>
                    {Object.values(QueueAction)
                        .filter((action) => actions.includes(action))
                        .map((action, key) => {
                            if (action === QueueAction.MarkNotNeeded) {
                                if (username !== questionProps.askerUsername) {
                                    return undefined;
                                }
                                if (
                                    questionProps.status !==
                                        QuestionStatus.Open &&
                                    questionProps.status !==
                                        QuestionStatus.NotNeeded
                                ) {
                                    return undefined;
                                }
                                return (
                                    <MarkNotNeededQuestionContainer
                                        {...questionProps}
                                        key={key}
                                    />
                                );
                            } else {
                                if (!isStaff) {
                                    return undefined;
                                }
                                const ActionButton = getActionButton(action);
                                return (
                                    <ActionButton
                                        {...questionProps}
                                        key={key}
                                    />
                                );
                            }
                        })}
                </HStack>
            </Td>
        </Tr>
    );
};
