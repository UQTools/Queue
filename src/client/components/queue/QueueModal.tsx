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
import { FormikCheckbox } from "../helpers/FormikCheckbox";

type Props = Omit<QueueProps, "createdAt"> & {
    header: string;
    close: () => void;
    isOpen: boolean;
    onSubmit: (queue: Omit<QueueProps, "createdAt">) => void;
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
    clearAfterMidnight,
    header,
    showEnrolledSession,
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
                    clearAfterMidnight,
                    showEnrolledSession,
                }}
                onSubmit={onSubmit}
            >
                <Form>
                    <ModalContent>
                        <ModalHeader>{header}</ModalHeader>
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
                            <FormikCheckbox
                                name="clearAfterMidnight"
                                label="Clear after Midnight?"
                            />
                            <FormikCheckbox
                                name="showEnrolledSession"
                                label="Show Student's Enrolled Session?"
                            />
                        </ModalBody>

                        <ModalFooter>
                            <Button mr={3} variant="ghost" onClick={close}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="blue"
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
