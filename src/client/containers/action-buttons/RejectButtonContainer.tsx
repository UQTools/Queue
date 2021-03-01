import React, { useContext, useMemo } from "react";
import { QueueContext } from "../../utils/queue";
import { QuestionStatus, QueueAction } from "../../generated/graphql";
import { ActionButton } from "../../components/queue/ActionButton2";
import { CloseIcon } from "@chakra-ui/icons";
import { QuestionProps } from "../QuestionContainer";

type Props = QuestionProps & {};

export const RejectButtonContainer: React.FC<Props> = ({
    children: _,
    ...questionProps
}) => {
    const { id, status } = questionProps;
    const { updateQuestionStatus } = useContext(QueueContext);
    const claimed = useMemo(() => status === QuestionStatus.Claimed, [status]);
    return (
        <ActionButton
            id={id}
            action={QueueAction.Remove}
            onClick={() => {
                updateQuestionStatus(id, QuestionStatus.Closed);
            }}
            colourScheme="red"
            icon={<CloseIcon />}
            isDisabled={claimed}
            helpText="Remove"
            variant="ghost"
        />
    );
};
