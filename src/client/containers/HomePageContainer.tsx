import { SearchIcon } from "@chakra-ui/icons";
import {
    Box,
    Input,
    InputGroup,
    InputLeftElement,
    Stack,
    Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

type Props = {};

export const HomePageContainer: React.FC<Props> = () => {
    const history = useHistory();
    const [course, setCourse] = useState("");
    useEffect(() => {
        document.title = "Q";
    }, []);
    return (
        <Box h="90vh">
            <Stack h="100%" justifyContent="center" alignItems="center">
                <Text fontSize="10em" fontFamily="'Courier New', monospace">
                    Q
                </Text>
                <InputGroup w="30vw" size="lg">
                    <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.300" />
                    </InputLeftElement>
                    <Input
                        placeholder="Enter your course code here:"
                        value={course}
                        onChange={(e) => {
                            setCourse(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                history.push(`/${course.toUpperCase()}`);
                            }
                        }}
                    />
                </InputGroup>
            </Stack>
        </Box>
    );
};
