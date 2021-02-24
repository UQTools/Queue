import React, { useContext, useEffect, useState } from "react";
import { Container } from "../components/helpers/Container";
import { UserContext } from "../utils/user";
import { Map } from "immutable";
import { RoomInput } from "../generated/graphql";
import { Form, Formik } from "formik";
import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { FormikInput } from "../components/helpers/FormikInput";
import { FormikNumberInput } from "../components/helpers/FormikNumberInput";
import { FormikCheckbox } from "../components/helpers/FormikCheckbox";
import { FormikActiveTimeInput } from "../components/helpers/FormikActiveTimeInput";

type Props = {};

export const RoomPageContainer: React.FC<Props> = ({}) => {
    const user = useContext(UserContext)!;
    const [chosenRoom, setChosenRoom] = useState("");
    const [chosenCourse, setChosenCourse] = useState("");
    const [courses, setCourses] = useState<
        Map<string, { [key: string]: RoomInput }>
    >(Map());
    useEffect(() => {
        user.courseStaff.forEach((courseStaff) => {
            setCourses((prev) =>
                prev.set(
                    courseStaff.course.id,
                    courseStaff.course.rooms.reduce<{
                        [key: string]: RoomInput;
                    }>(
                        (prevValue, currentRoom) => ({
                            ...prevValue,
                            [currentRoom.id]: {
                                name: currentRoom.name,
                                capacity: currentRoom.capacity,
                                enforceCapacity: currentRoom.enforceCapacity,
                                manuallyDisabled: currentRoom.manuallyDisabled,
                                activeTimes: currentRoom.activeTimes,
                            },
                        }),
                        {}
                    )
                )
            );
        });
    }, [user]);
    return (
        <Container>
            <FormControl>
                <FormLabel>Choose course:</FormLabel>
                <Select
                    value={chosenCourse}
                    onChange={(e) => {
                        setChosenCourse(e.target.value);
                    }}
                >
                    <option disabled value="">
                        Choose course
                    </option>
                    {user.courseStaff.map((courseStaff, key) => (
                        <option key={key} value={courseStaff.course.id}>
                            {courseStaff.course.code}
                        </option>
                    ))}
                </Select>
            </FormControl>
            <FormControl mt={3}>
                <FormLabel>Choose room:</FormLabel>
                <Select
                    value={chosenRoom}
                    onChange={(e) => {
                        setChosenRoom(e.target.value);
                    }}
                >
                    <option disabled value="">
                        Choose room
                    </option>
                    {Object.entries(courses.get(chosenCourse) || {}).map(
                        ([roomId, room]) => (
                            <option key={roomId} value={roomId}>
                                {room.name}
                            </option>
                        )
                    )}
                </Select>
            </FormControl>
            <Formik<RoomInput>
                initialValues={{
                    name: courses.get(chosenCourse)?.[chosenRoom]?.name || "",
                    capacity:
                        courses.get(chosenCourse)?.[chosenRoom]?.capacity || 0,
                    enforceCapacity:
                        courses.get(chosenCourse)?.[chosenRoom]
                            ?.enforceCapacity || false,
                    manuallyDisabled:
                        courses.get(chosenCourse)?.[chosenRoom]
                            ?.manuallyDisabled || false,
                    activeTimes:
                        courses.get(chosenCourse)?.[chosenRoom]?.activeTimes ||
                        [],
                }}
                onSubmit={() => {}}
                enableReinitialize={true}
            >
                <Form>
                    <FormikInput name="name" />
                    <FormikNumberInput name="capacity" />
                    <FormikCheckbox
                        label="Enforce Capacity:"
                        name="enforceCapacity"
                    />
                    <FormikCheckbox label="Disabled:" name="manuallyDisabled" />
                    <FormikActiveTimeInput
                        name="activeTimes"
                        label="Weekly Active Times"
                    />
                </Form>
            </Formik>
        </Container>
    );
};
