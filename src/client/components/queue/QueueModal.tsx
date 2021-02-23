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
import {
    QueueAction,
    QueueSortType,
    QueueTheme,
} from "../../generated/graphql";
import { FormikRadioGroup } from "../helpers/FormikRadioGroup";
import { FormikSelect } from "../helpers/FormikSelect";
import { FormikInputGroup } from "../helpers/FormikInputGroup";

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
        <Modal
            isOpen={isOpen}
            onClose={close}
            size="xl"
            scrollBehavior="inside"
        >
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
                                    QueueAction.Email,
                                ]}
                                name="actions"
                                direction="row"
                            />
                            <FormikRadioGroup
                                name="theme"
                                values={[
                                    QueueTheme.Red,
                                    QueueTheme.Orange,
                                    QueueTheme.Yellow,
                                    QueueTheme.Green,
                                    QueueTheme.Cyan,
                                    QueueTheme.Teal,
                                    QueueTheme.Blue,
                                    QueueTheme.Purple,
                                    QueueTheme.Pink,
                                    QueueTheme.Gray,
                                ]}
                                stackDirection="column"
                            />
                            <FormikInput name="shortDescription" />
                            <FormikSelect
                                name="sortType"
                                options={[
                                    QueueSortType.Time,
                                    QueueSortType.Questions,
                                    QueueSortType.QuestionsAndTime,
                                ]}
                            />
                            <FormikInputGroup
                                name="examples"
                                label="Question Examples"
                            />
                        </ModalBody>

                        <ModalFooter>
                            <Button variant="ghost" onClick={close}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="blue"
                                mr={3}
                                type="submit"
                                onClick={close}
                            >
                                Save
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Form>
            </Formik>
        </Modal>
    );
};
