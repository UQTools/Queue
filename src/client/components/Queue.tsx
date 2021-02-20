import {
    Box,
    HStack,
    ListItem,
    Text,
    UnorderedList,
    useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { useQueueBgColour, useQueueTextColour } from "../hooks/useQueueColour";
import { GetRoomByIdQuery } from "../generated/graphql";
import { ArrayElement } from "../types/helpers";

type Props = ArrayElement<GetRoomByIdQuery["getRoomById"]["queues"]>;

export const Queue: React.FC<Props> = ({
    name,
    shortDescription,
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
                    {shortDescription}
                </Text>
            </Box>
            <UnorderedList>
                {examples.map((example, key) => (
                    <ListItem key={key}>{example}</ListItem>
                ))}
            </UnorderedList>
        </HStack>
    );
};
