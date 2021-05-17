import React from "react";
import { Box, useMediaQuery } from "@chakra-ui/react";
import { FOOTER_REAL_HEIGHT, NAVBAR_REAL_HEIGHT } from "../../constants";
import { Footer } from "../Footer";

type Props = {};

export const Container: React.FC<Props> = ({ children }) => {
    const [isSmallScreen] = useMediaQuery("(max-width: 540px)");
    return (
        <>
            <Box
                py={6}
                maxW={isSmallScreen ? "95%" : "85%"}
                mx="auto"
                minH={`calc(100vh - ${
                    NAVBAR_REAL_HEIGHT + FOOTER_REAL_HEIGHT
                }px)`}
            >
                {children}
            </Box>
            <Footer />
        </>
    );
};
