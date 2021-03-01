import React, { useContext, useMemo } from "react";
import { QuestionProps } from "../QuestionContainer";
import { ActionButton } from "../../components/queue/ActionButton2";
import { QuestionStatus, QueueAction } from "../../generated/graphql";
import { QueueContext } from "../../utils/queue";
import { NotAllowedIcon } from "@chakra-ui/icons";

type Props = QuestionProps & {};

export const MarkNotNeededQuestionContainer: React.FC<Props> = ({
    children: _,
    ...questionProps
}) => {
    const { id, status } = questionProps;
    const { updateQuestionStatus } = useContext(QueueContext);
    const claimed = useMemo(() => status === QuestionStatus.Claimed, [status]);
    return (
        <ActionButton
            id={id}
            action={QueueAction.MarkNotNeeded}
            onClick={() => {
                if (status === QuestionStatus.NotNeeded) {
                    updateQuestionStatus(id, QuestionStatus.Open);
                } else if (status === QuestionStatus.Open) {
                    updateQuestionStatus(id, QuestionStatus.NotNeeded);
                }
            }}
            colourScheme="gray"
            icon={<NotAllowedIcon />}
            isDisabled={claimed}
            helpText="Mark question as not needed anymore"
            variant="ghost"
        />
    );
};
