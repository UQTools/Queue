import React from "react";
import { Box } from "@chakra-ui/react";

type Props = {};

export const Container: React.FC<Props> = ({ children }) => {
    return (
        <Box mt={6} maxW="80%" mx="auto">
            {children}
        </Box>
    );
};
