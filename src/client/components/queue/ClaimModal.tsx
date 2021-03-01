import React, { useContext, useState } from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Textarea,
} from "@chakra-ui/react";
import { QueueContext } from "../../utils/queue";
import { QuestionStatus } from "../../generated/graphql";

type Props = {
    questionId: string;
    isOpen: boolean;
    close: () => void;
};

export const ClaimModal: React.FC<Props> = ({ questionId, isOpen, close }) => {
    const [message, setMessage] = useState("");
    const { updateQuestionStatus } = useContext(QueueContext);

    return (
        <Modal isOpen={isOpen} onClose={close} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Enter Claim Message</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={() => {
                            updateQuestionStatus(
                                questionId,
                                QuestionStatus.Claimed,
                                message
                            );
                            close();
                        }}
                    >
                        Claim
                    </Button>
                    <Button variant="ghost" onClick={close}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
