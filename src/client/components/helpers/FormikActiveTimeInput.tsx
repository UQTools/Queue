import React from "react";
import { useField } from "formik";
import { EventInput } from "../../generated/graphql";
import {
    Flex,
    FormControl,
    FormLabel,
    IconButton,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    Stack,
    StackProps,
} from "@chakra-ui/react";
import { capitalCase } from "change-case";
import { removeAtIndex, updateElementAtIndex } from "../../utils/array";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { IsoDay } from "../../../types/day";
import { isoNumberToDay } from "../../../utils/day";

type Props = {
    name: string;
    label?: string;
};

export const FormikActiveTimeInput: React.FC<Props> = ({ name, label }) => {
    const [, { value: values }, { setValue: setValues }] = useField<
        Array<EventInput>
    >(name);
    return (
        <FormControl mt={3}>
            <FormLabel>{label || capitalCase(name)}</FormLabel>
            <Stack spacing={2} my={2}>
                {values.map((value, index) => (
                    <Flex key={index}>
                        <Select
                            value={value.day}
                            onChange={(e) =>
                                setValues(
                                    updateElementAtIndex(values, index, {
                                        ...value,
                                        day: parseInt(e.target.value),
                                    })
                                )
                            }
                            size="sm"
                        >
                            {[
                                IsoDay.MON,
                                IsoDay.TUE,
                                IsoDay.WED,
                                IsoDay.THU,
                                IsoDay.FRI,
                                IsoDay.SAT,
                                IsoDay.SUN,
                            ].map((day) => (
                                <option value={day} key={day}>
                                    {isoNumberToDay(day)}
                                </option>
                            ))}
                        </Select>
                        <NumberInput
                            onChange={(_, valueAsNumber) => {
                                setValues(
                                    updateElementAtIndex(values, index, {
                                        ...value,
                                        startTime: valueAsNumber,
                                    })
                                );
                            }}
                            value={value.startTime}
                            size="sm"
                            min={0}
                            max={value.endTime - 1}
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <NumberInput
                            onChange={(_, valueAsNumber) => {
                                setValues(
                                    updateElementAtIndex(values, index, {
                                        ...value,
                                        endTime: valueAsNumber,
                                    })
                                );
                            }}
                            value={value.endTime}
                            size="sm"
                            min={value.startTime + 1}
                            max={24}
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <IconButton
                            aria-label={`remove-active-event-${index}`}
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
                    setValues([
                        ...values,
                        { day: IsoDay.MON, startTime: 0, endTime: 24 },
                    ]);
                }}
                colorScheme="green"
            />
        </FormControl>
    );
};
