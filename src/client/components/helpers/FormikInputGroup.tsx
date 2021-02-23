import React from "react";
import { useField } from "formik";
import {
    Flex,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    Stack,
    StackProps,
} from "@chakra-ui/react";
import { capitalCase } from "change-case";
import { removeAtIndex, updateElementAtIndex } from "../../utils/array";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

type Props = {
    name: string;
    label?: string;
    formatValue?: (value: string) => string;
    direction?: StackProps["direction"];
};

export const FormikInputGroup: React.FC<Props> = ({
    name,
    label,
    direction,
    formatValue,
}) => {
    const [, { value: values }, { setValue: setValues }] = useField<
        Array<string>
    >(name);
    return (
        <FormControl mt={3}>
            <FormLabel>{label || capitalCase(name)}</FormLabel>
            <Stack direction={direction} spacing={2} my={2}>
                {values.map((value, index) => (
                    <Flex key={index}>
                        <Input
                            onChange={(e) => {
                                setValues(
                                    updateElementAtIndex(
                                        values,
                                        index,
                                        e.target.value
                                    )
                                );
                            }}
                            value={value}
                            id={`formik-input-group-${name}-${index}`}
                            size="sm"
                            width="50%"
                        />
                        <IconButton
                            aria-label={`remove-queue-example-${index}`}
                            icon={<MinusIcon />}
                            variant="ghost"
                            colorScheme="red"
                            size="sm"
                            ml={1}
                            onClick={() => {
                                setValues(removeAtIndex(values, index));
                            }}
                        />
                    </Flex>
                ))}
            </Stack>
            <IconButton
                aria-label="add-queue-example"
                icon={<AddIcon />}
                size="sm"
                onClick={() => {
                    setValues([...values, ""]);
                }}
                colorScheme="green"
            />
        </FormControl>
    );
};
