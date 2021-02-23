import {
    Checkbox,
    FormControl,
    FormLabel,
    Stack,
    StackProps,
} from "@chakra-ui/react";
import React from "react";
import { useField } from "formik";
import { capitalCase } from "change-case";

type Props<T extends number | string> = {
    values: T[];
    name: string;
    transformValue?: (value: T) => string;
    direction?: StackProps["direction"];
};

export const FormikCheckboxGroup = <T extends number | string>({
    values,
    name,
    transformValue,
    direction,
}: Props<T>) => {
    const [
        ,
        { value: checkedValues },
        { setValue: setCheckedValues },
    ] = useField<T[]>(name);
    return (
        <FormControl mt={3}>
            <FormLabel>{capitalCase(name)}</FormLabel>
            <Stack spacing={2} direction={direction}>
                {values.map((value, key) => (
                    <Checkbox
                        value={value}
                        key={key}
                        isChecked={checkedValues.includes(value)}
                        onChange={(e) => {
                            e.target.checked
                                ? setCheckedValues([...checkedValues, value])
                                : setCheckedValues(
                                      checkedValues.filter(
                                          (checkedValue) =>
                                              checkedValue !== value
                                      )
                                  );
                        }}
                    >
                        {transformValue?.(value) || capitalCase(String(value))}
                    </Checkbox>
                ))}
            </Stack>
        </FormControl>
    );
};
