import {
    Box,
    Button,
    Center,
    ListItem,
    Stack,
    Text,
    UnorderedList,
    useColorModeValue,
    useMediaQuery,
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
import { capitalCase, noCase } from "change-case";

export type Props = {
    id: string;
    theme: QueueTheme;
    name: string;
    shortDescription: string;
    examples: string[];
    actions: QueueAction[];
    sortType: QueueSortType;
    questions: QuestionProps[];
    queueCount: number;
    askQuestion: (queueId: string) => void;
    buttonsOnClick: (questionId: string, queueAction: QueueAction) => void;
    isStaff: boolean;
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
    queueCount,
    askQuestion,
    buttonsOnClick,
    isStaff,
}) => {
    const [isSmallerThan540] = useMediaQuery("(max-width: 540px)");
    const queueBgColour = useQueueBgColour(theme);
    const queueTextColour = useQueueTextColour(theme);
    const descriptionColour = useColorModeValue("gray.600", "gray.300");
    return (
        <Stack
            spacing={2}
            w={isSmallerThan540 ? "90%" : `${100 / queueCount - 5}%`}
            minW="400px"
        >
            <Box
                bg={queueBgColour}
                borderRadius={5}
                p={3}
                b={1}
                borderColor={queueTextColour}
            >
                <Stack alignItems="center">
                    <Text fontSize="4xl" color={queueTextColour}>
                        {name}
                    </Text>
                    <Text fontSize="xl" color={descriptionColour}>
                        {shortDescription}
                    </Text>
                </Stack>
            </Box>
            <Text>Some examples of {capitalCase(name)} Queue questions:</Text>
            <UnorderedList stylePosition="inside">
                {examples.map((example, key) => (
                    <ListItem key={key}>{example}</ListItem>
                ))}
            </UnorderedList>
            <Center>
                <Button
                    colorScheme={noCase(theme)}
                    onClick={() => {
                        askQuestion(id);
                    }}
                >
                    Request {name} help
                </Button>
            </Center>
            <QuestionList
                sortType={sortType}
                questions={questions}
                actions={actions}
                buttonsOnClick={buttonsOnClick}
                isStaff={isStaff}
            />
        </Stack>
    );
};