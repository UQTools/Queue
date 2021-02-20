import { useColorModeValue } from "@chakra-ui/react";
import { QueueTheme } from "../../server/types/queue";
import { useMemo } from "react";

export const useQueueBgColour = (theme: QueueTheme) => {
    const colour = useMemo(() => {
        switch (theme) {
            case QueueTheme.GRAY:
                return { light: "gray.200", dark: "gray.500" };
            case QueueTheme.RED:
                return { light: "red.200", dark: "red.700" };
            case QueueTheme.ORANGE:
                return { light: "orange.300", dark: "orange.600" };
            case QueueTheme.YELLOW:
                return { light: "yellow.300", dark: "yellow.600" };
            case QueueTheme.GREEN:
                return { light: "green.300", dark: "green.600" };
            case QueueTheme.TEAL:
                return { light: "teal.300", dark: "teal.600" };
            case QueueTheme.BLUE:
                return { light: "blue.200", dark: "blue.700" };
            case QueueTheme.CYAN:
                return { light: "cyan.300", dark: "cyan.700" };
            case QueueTheme.PURPLE:
                return { light: "purple.200", dark: "purple.700" };
            case QueueTheme.PINK:
                return { light: "pink.200", dark: "pink.700" };
        }
    }, [theme]);
    return useColorModeValue(colour.light, colour.dark);
};

export const useQueueTextColour = (theme: QueueTheme) => {
    const colour = useMemo(() => {
        switch (theme) {
            case QueueTheme.GRAY:
                return { light: "gray.600", dark: "gray.300" };
            case QueueTheme.RED:
                return { light: "red.800", dark: "red.300" };
            case QueueTheme.ORANGE:
                return { light: "orange.700", dark: "orange.400" };
            case QueueTheme.YELLOW:
                return { light: "yellow.700", dark: "yellow.300" };
            case QueueTheme.GREEN:
                return { light: "green.700", dark: "green.400" };
            case QueueTheme.TEAL:
                return { light: "teal.700", dark: "teal.400" };
            case QueueTheme.BLUE:
                return { light: "blue.700", dark: "blue.300" };
            case QueueTheme.CYAN:
                return { light: "cyan.700", dark: "cyan.300" };
            case QueueTheme.PURPLE:
                return { light: "purple.700", dark: "purple.300" };
            case QueueTheme.PINK:
                return { light: "pink.700", dark: "pink.300" };
        }
    }, [theme]);
    return useColorModeValue(colour.light, colour.dark);
};
