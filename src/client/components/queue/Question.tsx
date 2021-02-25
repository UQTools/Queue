import { HStack, Td, Tr, useColorModeValue } from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { QuestionStatus, QueueAction } from "../../generated/graphql";
import { differenceInSeconds } from "date-fns";
import { ActionButton } from "./ActionButton";
import { secondsToText } from "../../utils/queue";
import { sentenceCase } from "change-case";

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
    // TODO: Different colors for different status
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    // Continuously update the time every 10 seconds
    const updateTime = useCallback(() => {
        setElapsedSeconds(differenceInSeconds(new Date(), askedTime));
        setTimeout(updateTime, 10000);
    }, [askedTime]);

    useEffect(() => {
        // Call this for the first time
        updateTime();
        // TODO: Clean up timeout
    }, [updateTime]);
    const elapsedTimeDisplay = useMemo(() => {
        return secondsToText(elapsedSeconds);
    }, [elapsedSeconds]);
    const claimedColour = useColorModeValue("pink.200", "pink.700");
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
                            <ActionButton
                                action={action}
                                key={key}
                                claimed={status === QuestionStatus.Claimed}
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
                        ))}
                    </HStack>
                </Td>
            )}
        </Tr>
    );
};
