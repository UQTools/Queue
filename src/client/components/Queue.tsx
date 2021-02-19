import {
    Box,
    HStack,
    ListItem,
    Text,
    UnorderedList,
    useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { QueueTheme } from "../../types/queue";
import { useQueueBgColour, useQueueTextColour } from "../hooks/useQueueColour";

// TODO: types
type Props = {
    id: number;
    name: string;
    quickDescription: string;
    examples: string[];
    theme: QueueTheme;
    studentList: Array<any>;
};

export const Queue: React.FC<Props> = ({
    name,
    quickDescription,
    examples,
    theme,
}) => {
    const queueBgColour = useQueueBgColour(theme);
    const queueTextColour = useQueueTextColour(theme);
    const descriptionColour = useColorModeValue("gray.700", "gray.300");
    return (
        <HStack spacing={2}>
            <Box bg={queueBgColour}>
                <Text fontSize="4xl" colour={queueTextColour}>
                    {name}
                </Text>
                <Text fontSize="3xl" colour={descriptionColour}>
                    {quickDescription}
                </Text>
            </Box>
            <UnorderedList>
                {examples.map((example) => (
                    <ListItem>{example}</ListItem>
                ))}
            </UnorderedList>
        </HStack>
    );
};
