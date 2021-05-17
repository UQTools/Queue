import React, { useContext } from "react";
import {
    Box,
    Divider,
    HStack,
    Link,
    StackDivider,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";
import { FOOTER_HEIGHT } from "../constants";
import { Icon } from "@chakra-ui/icons";
import { UserContext } from "../utils/user";
import { bugReportMailTo, featureRequestMailto } from "../utils/feedback";

type Props = {};

export const Footer: React.FunctionComponent<Props> = () => {
    const bgColor = useColorModeValue("gray.100", "gray.900");
    const user = useContext(UserContext)!;
    return (
        <>
            <Divider />
            <Box w="100%" bgColor={bgColor} color="gray.500" fontSize={15}>
                <VStack h={FOOTER_HEIGHT} py={4} spacing={0}>
                    <Box>
                        Made with <Icon as={FaHeart} color="red.500" /> by MP
                    </Box>
                    <HStack divider={<StackDivider />}>
                        <Link
                            onClick={(event) => {
                                event.preventDefault();
                                document.location.href = bugReportMailTo(
                                    user.name
                                );
                            }}
                        >
                            Bug report
                        </Link>
                        <Link
                            onClick={(event) => {
                                event.preventDefault();
                                document.location.href = featureRequestMailto(
                                    user.name
                                );
                            }}
                        >
                            Feature request
                        </Link>
                    </HStack>
                </VStack>
            </Box>
        </>
    );
};
