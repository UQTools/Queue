import React from "react";
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

type Props = {
    isOpen: boolean;
    close: () => void;
    setMessage: (message: string) => void;
    message: string;
    submit: (message: string) => void;
};

export const ClaimModal: React.FC<Props> = ({
    isOpen,
    close,
    setMessage,
    message,
    submit,
}) => {
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
                            submit(message);
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
