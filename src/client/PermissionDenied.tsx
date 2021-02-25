import React from "react";
import { Center, Text } from "@chakra-ui/react";
import { Container } from "./components/helpers/Container";

type Props = {};

export const PermissionDenied: React.FC<Props> = () => {
    return (
        <Container>
            <Center>
                <Text fontSize="6xl" color="tomato">
                    Oopsie, it seems like you don&apos;t have permission to
                    visit this page
                </Text>
            </Center>
        </Container>
    );
};
