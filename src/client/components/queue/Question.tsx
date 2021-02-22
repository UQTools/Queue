import { HStack, Td, Tr, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { QuestionStatus, QueueAction } from "../../generated/graphql";
import { differenceInSeconds } from "date-fns";
import { ActionButton } from "./ActionButton";
import { secondsToText } from "../../utils/queue";

export type QuestionProps = {
    id: string;
    askerName: string;
    askedTime: Date;
    questionCount: number;
    status: QuestionStatus;
};

type Props = QuestionProps & {
    index: number;
    actions: QueueAction[];
};

export const Question: React.FC<Props> = ({
    id,
    index,
    askedTime,
    askerName,
    status,
    questionCount,
    actions,
}) => {
    // TODO: Different colors for different status
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    useEffect(() => {
        setInterval(() => {
            setElapsedSeconds(differenceInSeconds(new Date(), askedTime));
        }, 10000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const elapsedTimeDisplay = useMemo(() => {
        return secondsToText(elapsedSeconds);
    }, [elapsedSeconds]);
    const claimedColour = useColorModeValue("pink.200", "pink.700");
    return (
        <Tr bg={status === QuestionStatus.Claimed ? claimedColour : undefined}>
            <Td>{index}</Td>
            <Td>{askerName}</Td>
            <Td isNumeric>{questionCount}</Td>
            <Td>{elapsedTimeDisplay} ago</Td>
            <Td>
                <HStack spacing={2}>
                    {actions.map((action, key) => (
                        <ActionButton
                            action={action}
                            questionId={id}
                            key={key}
                            claimed={status === QuestionStatus.Claimed}
                        />
                    ))}
                </HStack>
            </Td>
        </Tr>
    );
};
