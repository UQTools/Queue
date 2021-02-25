import {
    Box,
    HStack,
    Td,
    Tooltip,
    Tr,
    useColorModeValue,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { QuestionStatus, QueueAction } from "../../generated/graphql";
import { differenceInSeconds } from "date-fns";
import { ActionButton } from "./ActionButton";
import { secondsToText } from "../../utils/queue";
import { capitalCase, sentenceCase } from "change-case";

export type QuestionProps = {
    id: string;
    askerName: string;
    askerEmail: string;
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
    buttonsOnClick: (question: QuestionProps, queueAction: QueueAction) => void;
    showEnrolledSession: boolean;
};

export const Question: React.FC<Props> = ({
    id,
    index,
    askedTime,
    askerName,
    status,
    questionCount,
    actions,
    buttonsOnClick,
    isStaff,
    showEnrolledSession,
    enrolledSession,
    askerEmail,
    claimer,
}) => {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    // Continuously update the time every 10 seconds
    const updateTime: () => ReturnType<typeof setTimeout> = useCallback(() => {
        setElapsedSeconds(differenceInSeconds(new Date(), askedTime));
        return setTimeout(updateTime, 5000);
    }, [askedTime]);

    useEffect(() => {
        // Call this for the first time
        const timeout = updateTime();
        return () => clearInterval(timeout);
    }, [updateTime]);
    const elapsedTimeDisplay = useMemo(() => {
        return secondsToText(elapsedSeconds);
    }, [elapsedSeconds]);
    const claimedColour = useColorModeValue("pink.100", "pink.700");
    const buttonHelpText = useCallback(
        (action: QueueAction) => {
            if (
                action === QueueAction.Claim &&
                status === QuestionStatus.Claimed
            ) {
                return `Claimed by ${claimer?.name}`;
            } else {
                return capitalCase(action);
            }
        },
        [status, claimer]
    );
    return (
        <Tr bg={status === QuestionStatus.Claimed ? claimedColour : undefined}>
            <Td>{index}</Td>
            <Td>{askerName}</Td>
            <Td isNumeric>{questionCount}</Td>
            <Td>{sentenceCase(elapsedTimeDisplay)} ago</Td>
            {showEnrolledSession && <Td>{enrolledSession || "None"}</Td>}
            {isStaff && (
                <Td>
                    <HStack spacing={1}>
                        {actions.map((action, key) => (
                            <Tooltip
                                label={buttonHelpText(action)}
                                aria-label={`tooltip-button-${key}-${id}`}
                                key={key}
                            >
                                <Box>
                                    <ActionButton
                                        action={action}
                                        claimed={
                                            status === QuestionStatus.Claimed
                                        }
                                        onClick={() =>
                                            buttonsOnClick(
                                                {
                                                    id,
                                                    askerName,
                                                    askerEmail,
                                                    askedTime,
                                                    questionCount,
                                                    status,
                                                    enrolledSession,
                                                    claimer,
                                                },
                                                action
                                            )
                                        }
                                    />
                                </Box>
                            </Tooltip>
                        ))}
                    </HStack>
                </Td>
            )}
        </Tr>
    );
};
