import { useColorModeValue } from "@chakra-ui/react";
import { useMemo } from "react";
import { QueueTheme } from "../generated/graphql";

export const useQueueBgColour = (theme: QueueTheme) => {
    const colour = useMemo(() => {
        switch (theme) {
            case QueueTheme.Gray:
                return { light: "gray.200", dark: "gray.500" };
            case QueueTheme.Red:
                return { light: "red.200", dark: "red.700" };
            case QueueTheme.Orange:
                return { light: "orange.300", dark: "orange.600" };
            case QueueTheme.Yellow:
                return { light: "yellow.300", dark: "yellow.600" };
            case QueueTheme.Green:
                return { light: "green.300", dark: "green.600" };
            case QueueTheme.Teal:
                return { light: "teal.300", dark: "teal.600" };
            case QueueTheme.Blue:
                return { light: "blue.200", dark: "blue.700" };
            case QueueTheme.Cyan:
                return { light: "cyan.300", dark: "cyan.700" };
            case QueueTheme.Purple:
                return { light: "purple.200", dark: "purple.700" };
            case QueueTheme.Pink:
                return { light: "pink.200", dark: "pink.700" };
        }
    }, [theme]);
    return useColorModeValue(colour.light, colour.dark);
};

export const useQueueTextColour = (theme: QueueTheme) => {
    const colour = useMemo(() => {
        switch (theme) {
            case QueueTheme.Gray:
                return { light: "gray.600", dark: "gray.300" };
            case QueueTheme.Red:
                return { light: "red.800", dark: "red.300" };
            case QueueTheme.Orange:
                return { light: "orange.700", dark: "orange.400" };
            case QueueTheme.Yellow:
                return { light: "yellow.700", dark: "yellow.300" };
            case QueueTheme.Green:
                return { light: "green.700", dark: "green.400" };
            case QueueTheme.Teal:
                return { light: "teal.700", dark: "teal.400" };
            case QueueTheme.Blue:
                return { light: "blue.700", dark: "blue.300" };
            case QueueTheme.Cyan:
                return { light: "cyan.700", dark: "cyan.300" };
            case QueueTheme.Purple:
                return { light: "purple.700", dark: "purple.300" };
            case QueueTheme.Pink:
                return { light: "pink.700", dark: "pink.300" };
        }
    }, [theme]);
    return useColorModeValue(colour.light, colour.dark);
};
