import React from "react";
import { Checkbox, FormControl, FormLabel } from "@chakra-ui/react";
import { useField } from "formik";

type Props = {
    name: string;
    label: string;
    displayedValues?: [string, string];
};

export const FormikCheckbox: React.FC<Props> = ({
    name,
    label,
    displayedValues,
}) => {
    const [, { value }, { setValue }] = useField<boolean>(name);
    return (
        <FormControl mt={3}>
            <FormLabel>{label}</FormLabel>
            <Checkbox
                isChecked={value}
                onChange={(e) => setValue(e.target.checked)}
            >
                {(displayedValues || ["No", "Yes"])[+value]}
            </Checkbox>
        </FormControl>
    );
};
