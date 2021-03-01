import React, { useContext, useMemo } from "react";
import { QuestionProps } from "../QuestionContainer";
import { ActionButton } from "../../components/queue/ActionButton2";
import { QuestionStatus, QueueAction } from "../../generated/graphql";
import { QueueContext } from "../../utils/queue";
import { CheckIcon } from "@chakra-ui/icons";

type Props = QuestionProps & {};

export const AcceptButtonContainer: React.FC<Props> = ({
    children: _,
    ...questionProps
}) => {
    const { id, status } = questionProps;
    const { updateQuestionStatus } = useContext(QueueContext);
    const claimed = useMemo(() => status === QuestionStatus.Claimed, [status]);
    return (
        <ActionButton
            id={id}
            action={QueueAction.Accept}
            onClick={() => {
                updateQuestionStatus(id, QuestionStatus.Accepted);
            }}
            colourScheme="green"
            icon={<CheckIcon />}
            isDisabled={claimed}
            helpText="Accept"
            variant="ghost"
        />
    );
};
