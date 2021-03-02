import { LockIcon } from "@chakra-ui/icons";
import React, { useContext, useMemo } from "react";
import { ActionButton } from "../../components/queue/ActionButton";
import { QuestionProps } from "../QuestionContainer";
import { QuestionStatus, QueueAction } from "../../generated/graphql";
import { QueueContext } from "../../utils/queue";
import { UserContext } from "../../utils/user";

type Props = QuestionProps & {};

export const ClaimButtonContainer: React.FC<Props> = ({
    children: _,
    ...questionProps
}) => {
    const { id, status, claimer } = questionProps;
    const { username } = useContext(UserContext)!;
    const {
        updateQuestionStatus,
        setSelectedQuestion,
        openClaimModal,
    } = useContext(QueueContext);
    const claimed = useMemo(() => status === QuestionStatus.Claimed, [status]);
    return (
        <ActionButton
            id={id}
            action={QueueAction.Claim}
            onClick={() => {
                if (status === QuestionStatus.Open) {
                    setSelectedQuestion(id);
                    openClaimModal();
                } else if (claimed && claimer?.username === username) {
                    updateQuestionStatus(id, QuestionStatus.Open);
                }
            }}
            colourScheme="blue"
            icon={<LockIcon />}
            isDisabled={claimed && username !== claimer?.username}
            helpText={
                claimed
                    ? `Claimed by ${claimer?.name}`
                    : `Claim ${questionProps.askerName}`
            }
            variant={claimed ? "solid" : "ghost"}
        />
    );
};
