import React from "react";
import { Box, useMediaQuery } from "@chakra-ui/react";

type Props = {};

export const Container: React.FC<Props> = ({ children }) => {
    const [isSmallScreen] = useMediaQuery("(max-width: 540px)");
    return (
        <Box mt={6} maxW={isSmallScreen ? "95%" : "85%"} mx="auto">
            {children}
        </Box>
    );
};
