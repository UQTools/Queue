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
} from "@chakra-ui/react";
import { CourseStaffForm } from "./CourseStaffForm";
import { StaffRole } from "../../generated/graphql";
import { Form, Formik } from "formik";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: { usernames: string[]; role: StaffRole }) => void;
    loading: boolean;
};

export const AddCourseStaffModal: React.FC<Props> = ({
    isOpen,
    onClose,
    onSubmit,
    loading,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
            <ModalOverlay />
            <ModalContent>
                <Formik
                    initialValues={{
                        usernames: "",
                        role: StaffRole.Staff,
                    }}
                    onSubmit={(values) => {
                        onSubmit({
                            ...values,
                            usernames: values.usernames
                                .split(",")
                                .map((username) => username.trim()),
                        });
                    }}
                >
                    <Form>
                        <ModalHeader>Add Course Staff</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <CourseStaffForm
                                onSubmit={onSubmit}
                                editable={true}
                            />
                        </ModalBody>

                        <ModalFooter>
                            <Button variant="ghost" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="blue"
                                mr={3}
                                type="submit"
                                isLoading={loading}
                            >
                                Add
                            </Button>
                        </ModalFooter>
                    </Form>
                </Formik>
            </ModalContent>
        </Modal>
    );
};
