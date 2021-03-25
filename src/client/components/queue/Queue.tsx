import {
    Box,
    Button,
    Center,
    Flex,
    IconButton,
    ListItem,
    Stack,
    Text,
    Tooltip,
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
import { QuestionProps } from "../../containers/QuestionContainer";
import { QuestionList } from "./QuestionList";
import { capitalCase, noCase } from "change-case";
import { EditIcon } from "@chakra-ui/icons";
import { IoArrowUndo } from "react-icons/io5";

export type QueueProps = {
    id: string;
    theme: QueueTheme;
    name: string;
    shortDescription: string;
    examples: string[];
    actions: QueueAction[];
    sortType: QueueSortType;
    clearAfterMidnight: boolean;
    showEnrolledSession: boolean;
    createdAt: Date;
};

export type Props = QueueProps & {
    sessionFilter: string;
    questions: QuestionProps[];
    askQuestion: (queueId: string) => void;
    onUndo: (queueId: string) => void;
    isStaff: boolean;
    openEditQueueModal: (queueId: string) => void;
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
    askQuestion,
    isStaff,
    openEditQueueModal,
    showEnrolledSession,
    sessionFilter,
    onUndo,
}) => {
    const [isSmallerThan540] = useMediaQuery("(max-width: 540px)");
    const queueBgColour = useQueueBgColour(theme);
    const queueTextColour = useQueueTextColour(theme);
    const descriptionColour = useColorModeValue("gray.600", "gray.300");
    return (
        <Stack spacing={2} w={isSmallerThan540 ? "90%" : "47%"} mt={4}>
            <Box
                bg={queueBgColour}
                borderRadius={5}
                p={3}
                b={1}
                borderColor={queueTextColour}
                position="relative"
            >
                {isStaff && (
                    <IconButton
                        aria-label={`edit-queue-${id}`}
                        icon={<EditIcon />}
                        variant="ghost"
                        colorScheme={noCase(theme)}
                        onClick={() => {
                            openEditQueueModal(id);
                        }}
                        position="absolute"
                        top={0}
                        right={0}
                        isRound
                    />
                )}
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
            <Flex justifyItems="flex-end">
                <Tooltip
                    label="Undo close most recent question"
                    aria-label="Undo most recent question tooltip"
                >
                    <IconButton
                        icon={<IoArrowUndo />}
                        aria-label={`Undo ${name} queue`}
                        isRound
                        ml="auto"
                        variant="ghost"
                        onClick={() => {
                            onUndo(id);
                        }}
                    />
                </Tooltip>
            </Flex>
            <QuestionList
                sortType={sortType}
                questions={questions}
                actions={actions}
                isStaff={isStaff}
                showEnrolledSession={showEnrolledSession}
                sessionFilter={sessionFilter}
            />
        </Stack>
    );
};
