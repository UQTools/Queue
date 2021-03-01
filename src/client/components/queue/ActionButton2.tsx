import {
    Box,
    ButtonProps,
    IconButton,
    IconButtonProps,
    Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { QueueAction } from "../../generated/graphql";

type Props = {
    id: string;
    action: QueueAction;
    onClick: () => void;
    colourScheme: ButtonProps["colorScheme"];
    icon: IconButtonProps["icon"];
    isDisabled: boolean;
    helpText: string;
    variant: ButtonProps["variant"];
};

export const ActionButton: React.FC<Props> = ({
    id,
    action,
    onClick,
    colourScheme,
    isDisabled,
    helpText,
    variant,
    icon,
}) => {
    return (
        <Tooltip label={helpText} aria-label={`tooltip-button-${id}-${action}`}>
            <Box>
                <IconButton
                    aria-label={`icon-button-${id}-${action}`}
                    icon={icon}
                    colorScheme={colourScheme}
                    variant={variant}
                    size="sm"
                    onClick={onClick}
                    isRound
                    isDisabled={isDisabled}
                />
            </Box>
        </Tooltip>
    );
};
