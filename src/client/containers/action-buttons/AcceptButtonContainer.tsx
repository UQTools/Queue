import React, { useContext, useMemo } from "react";
import { QuestionProps } from "../QuestionContainer";
import { ActionButton } from "../../components/queue/ActionButton";
import { QuestionStatus, QueueAction } from "../../generated/graphql";
import { QueueContext } from "../../utils/queue";
import { CheckIcon } from "@chakra-ui/icons";
import { UserContext } from "../../utils/user";

type Props = QuestionProps & {};

export const AcceptButtonContainer: React.FC<Props> = ({
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
            action={QueueAction.Accept}
            onClick={() => {
                updateQuestionStatus(id, QuestionStatus.Accepted);
            }}
            colourScheme="green"
            icon={<CheckIcon />}
            isDisabled={claimed && claimer?.username !== username}
            helpText="Done"
            variant="ghost"
        />
    );
};
