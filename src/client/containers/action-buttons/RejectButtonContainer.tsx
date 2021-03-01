import React, { useContext, useMemo } from "react";
import { QueueContext } from "../../utils/queue";
import { QuestionStatus, QueueAction } from "../../generated/graphql";
import { ActionButton } from "../../components/queue/ActionButton";
import { CloseIcon } from "@chakra-ui/icons";
import { QuestionProps } from "../QuestionContainer";
import { UserContext } from "../../utils/user";

type Props = QuestionProps & {};

export const RejectButtonContainer: React.FC<Props> = ({
    children: _,
    ...questionProps
}) => {
    const { id, status, claimer } = questionProps;
    const { updateQuestionStatus } = useContext(QueueContext);
    const { username } = useContext(UserContext)!;
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
            isDisabled={claimed && claimer?.username !== username}
            helpText="Remove"
            variant="ghost"
        />
    );
};
