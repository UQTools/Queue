import {
    Box,
    Center,
    ListItem,
    Stack,
    Text,
    UnorderedList,
    useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import {
    useQueueBgColour,
    useQueueTextColour,
} from "../../hooks/useQueueColour";
import {
    QueueAction,
    QueueSortType,
    QueueTheme,
} from "../../generated/graphql";
import { QuestionProps } from "./Question";
import { QuestionList } from "./QuestionList";

export type Props = {
    id: string;
    theme: QueueTheme;
    name: string;
    shortDescription: string;
    examples: string[];
    actions: QueueAction[];
    sortType: QueueSortType;
    questions: QuestionProps[];
};

export const Queue: React.FC<Props> = ({
    id,
    theme,
    name,
    shortDescription,
    examples,
    actions,
    sortType,
    questions,
}) => {
    const queueBgColour = useQueueBgColour(theme);
    const queueTextColour = useQueueTextColour(theme);
    const descriptionColour = useColorModeValue("gray.700", "gray.300");
    return (
        <Stack spacing={2}>
            <Box bg={queueBgColour} borderRadius={5}>
                <Stack alignItems="center">
                    <Text fontSize="3xl" color={queueTextColour}>
                        {name}
                    </Text>
                    <Text fontSize="xl" color={descriptionColour}>
                        {shortDescription}
                    </Text>
                </Stack>
            </Box>
            <UnorderedList>
                {examples.map((example, key) => (
                    <ListItem key={key}>{example}</ListItem>
                ))}
            </UnorderedList>
            <QuestionList
                sortType={sortType}
                questions={questions}
                actions={actions}
            />
        </Stack>
    );
};
