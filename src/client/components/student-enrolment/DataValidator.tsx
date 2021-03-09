import { Box, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { List } from "immutable";

type Props = {
    data: Array<Array<string>>;
    setHasError: (hasError: boolean) => void;
};

export const DataValidator: React.FC<Props> = ({ data, setHasError }) => {
    const [errors, setErrors] = useState<List<string>>(List());
    useEffect(() => {
        setErrors((prev) => prev.clear());
        if (data.length === 0) {
            setErrors((prev) => prev.push("File has no rows"));
            return;
        }
        if (!data[0].includes("STUDENT_CODE")) {
            setErrors((prev) => prev.push('Column "STUDENT_CODE" not found'));
        }
        if (!data[0].includes("ACTIVITY_GROUP_CODE")) {
            setErrors((prev) =>
                prev.push('Column "ACTIVITY_GROUP_CODE" not found')
            );
        }
        if (!data[0].includes("ACTIVITY_CODE")) {
            setErrors((prev) => prev.push('Column "ACTIVITY_CODE" not found'));
        }
        const studentIndex = data[0].indexOf("STUDENT_CODE");
        const activityGroupIndex = data[0].indexOf("ACTIVITY_GROUP_CODE");
        const activityIndex = data[0].indexOf("ACTIVITY_CODE");
        const maxIndex = Math.max(
            studentIndex,
            activityGroupIndex,
            activityIndex
        );
        if (maxIndex === -1) {
            return;
        }
        for (const [rowNum, row] of Object.entries(data)) {
            if (row.length < maxIndex) {
                setErrors((prev) => prev.push(`Row ${rowNum} is missing data`));
            }
        }
    }, [data]);
    useEffect(() => {
        setHasError(errors.size > 0);
    }, [errors, setHasError]);
    if (errors.size === 0) {
        return (
            <Text color="green.500" fontWeight="bold">
                This file seems valid
            </Text>
        );
    }
    return (
        <Box color="red.500">
            <Text fontWeight="bold">Error(s) found</Text>
            <UnorderedList>
                {errors.map((error, key) => (
                    <ListItem key={key}>{error}</ListItem>
                ))}
            </UnorderedList>
        </Box>
    );
};
