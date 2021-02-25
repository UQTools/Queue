import { SearchIcon } from "@chakra-ui/icons";
import {
    Box,
    Input,
    InputGroup,
    InputLeftElement,
    Stack,
    Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

type Props = {};

export const HomePageContainer: React.FC<Props> = () => {
    const history = useHistory();
    const [course, setCourse] = useState("");
    return (
        <Box h="90vh">
            <Stack h="100%" justifyContent="center" alignItems="center">
                <Text fontSize="10em">Q</Text>
                <InputGroup maxW="50vh">
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
