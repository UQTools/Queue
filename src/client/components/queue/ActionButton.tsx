import { CheckIcon, CloseIcon, EmailIcon, LockIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import React, { useContext, useMemo } from "react";
import { QueueAction } from "../../generated/graphql";
import { UserContext } from "../../utils/user";

type Props = {
    action: QueueAction;
    claimed: boolean;
    onClick: () => void;
    claimer?: {
        username: string;
        name: string;
    };
};

export const ActionButton: React.FC<Props> = ({
    action,
    claimed,
    onClick,
    claimer,
}) => {
    const user = useContext(UserContext);
    const Icon = useMemo(() => {
        switch (action) {
            case QueueAction.Accept:
                return CheckIcon;
            case QueueAction.Claim:
                return LockIcon;
            case QueueAction.Email:
                return EmailIcon;
            case QueueAction.Remove:
                return CloseIcon;
        }
    }, [action]);
    const colourScheme = useMemo(() => {
        switch (action) {
            case QueueAction.Accept:
                return "green";
            case QueueAction.Claim:
                return "blue";
            case QueueAction.Email:
                return "teal";
            case QueueAction.Remove:
                return "red";
        }
    }, [action]);
    return (
        <IconButton
            aria-label={action}
            icon={<Icon />}
            colorScheme={colourScheme}
            variant={
                claimed && action === QueueAction.Claim ? "solid" : "ghost"
            }
            size="sm"
            onClick={onClick}
            isRound
            isDisabled={
                claimed &&
                action === QueueAction.Claim &&
                claimer !== undefined &&
                user?.username !== claimer.username
            }
        />
    );
};
