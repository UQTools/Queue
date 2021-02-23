import React from "react";
import { QueueProps } from "./Queue";
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { FormikInput } from "../helpers/FormikInput";
import { FormikCheckboxGroup } from "../helpers/FormikCheckboxGroup";
import { QueueAction } from "../../generated/graphql";

type Props = QueueProps & {
    close: () => void;
    isOpen: boolean;
    onSubmit: (queue: QueueProps) => void;
};

export const QueueModal: React.FC<Props> = ({
    isOpen,
    close,
    id,
    onSubmit,
    name,
    actions,
    theme,
    shortDescription,
    sortType,
    examples,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={close}>
            <ModalOverlay />
            <Formik
                initialValues={{
                    id,
                    name,
                    actions,
                    theme,
                    shortDescription,
                    sortType,
                    examples,
                }}
                onSubmit={onSubmit}
            >
                <Form>
                    <ModalContent>
                        <ModalHeader>Edit Queue</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormikInput name="name" />
                            <FormikCheckboxGroup
                                values={[
                                    QueueAction.Accept,
                                    QueueAction.Remove,
                                    QueueAction.Claim,
                                    QueueAction.Remove,
                                ]}
                                name="actions"
                            />
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={close}>
                                Close
                            </Button>
                            <Button variant="ghost">Secondary Action</Button>
                        </ModalFooter>
                    </ModalContent>
                </Form>
            </Formik>
        </Modal>
    );
};
