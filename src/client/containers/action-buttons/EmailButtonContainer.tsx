import React, { useContext } from "react";
import { ActionButton } from "../../components/queue/ActionButton";
import { QuestionProps } from "../QuestionContainer";
import { generateMailto, QueueContext } from "../../utils/queue";
import { QueueAction } from "../../generated/graphql";
import { redacted } from "../../../constants";
import { UserContext } from "../../utils/user";
import { EmailIcon } from "@chakra-ui/icons";

type Props = QuestionProps & {};

export const EmailButtonContainer: React.FC<Props> = ({
    children: _,
    ...questionProps
}) => {
    const { id, askerEmail, askerName, askerUsername } = questionProps;
    const { courseCode } = useContext(QueueContext);
    const user = useContext(UserContext);
    return (
        <ActionButton
            id={id}
            action={QueueAction.Accept}
            onClick={() => {
                document.location.href = generateMailto(
                    askerEmail,
                    courseCode,
                    askerName === redacted ? askerUsername : askerName,
                    user?.name || ` ${courseCode} Tutor team`
                );
            }}
            colourScheme="teal"
            icon={<EmailIcon />}
            isDisabled={false}
            helpText="Email"
            variant="ghost"
        />
    );
};
