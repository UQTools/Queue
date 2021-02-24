import React from "react";
import { Box, Center, Text } from "@chakra-ui/react";

type Props = {};

export const PermissionDenied: React.FC<Props> = ({}) => {
    return (
        <Box h="90vh" w="100%">
            <Center>
                <Text size="6xl" color="tomato">
                    Oopsie, it seems like you don&apos;t have permission to
                    visit this page
                </Text>
            </Center>
        </Box>
    );
};
