import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { Container } from "../components/helpers/Container";
import { UserContext } from "../utils/user";
import { Map } from "immutable";
import {
    RoomInput,
    StaffRole,
    UpdateRoomMutation,
    useAddRoomMutation,
    useUpdateRoomMutation,
} from "../generated/graphql";
import { Form, Formik } from "formik";
import {
    Button,
    FormControl,
    FormLabel,
    Select,
    Stack,
    Text,
} from "@chakra-ui/react";
import { FormikInput } from "../components/helpers/FormikInput";
import { FormikNumberInput } from "../components/helpers/FormikNumberInput";
import { FormikCheckbox } from "../components/helpers/FormikCheckbox";
import { FormikActiveTimeInput } from "../components/helpers/FormikActiveTimeInput";
import { useMutationWithError } from "../hooks/useApolloHooksWithError";
import { CourseSelectContainer } from "./CourseSelectContainer";

type Props = {};

const placeholderRoom: RoomInput = {
    name: "",
    capacity: 0,
    enforceCapacity: false,
    manuallyDisabled: false,
    activeTimes: [],
};

export const RoomPageContainer: React.FC<Props> = () => {
    const user = useContext(UserContext)!;
    const [chosenRoom, setChosenRoom] = useState("");
    const [chosenCourse, setChosenCourse] = useState("");
    const [showing, setShowing] = useState<boolean>(false);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [courses, setCourses] = useState<
        Map<string, { [key: string]: RoomInput }>
    >(Map());
    const [
        updateRoomMutation,
        { data: updateRoomMutationData, loading: updateRoomMutationLoading },
    ] = useMutationWithError(useUpdateRoomMutation, { errorPolicy: "all" });
    const [
        addRoomMutation,
        { data: addRoomMutationData, loading: addRoomMutationLoading },
    ] = useMutationWithError(useAddRoomMutation, { errorPolicy: "all" });
    useEffect(() => {
        document.title = "Manage Rooms";
    }, []);
    const updateRoom = useCallback(
        (room: UpdateRoomMutation["updateRoom"]) => {
            setCourses((prev) =>
                prev.set(chosenCourse, {
                    ...prev.get(chosenCourse),
                    [room.id]: {
                        name: room.name,
                        capacity: room.capacity,
                        enforceCapacity: room.enforceCapacity,
                        manuallyDisabled: room.manuallyDisabled,
                        activeTimes: room.activeTimes,
                    },
                })
            );
        },
        [chosenCourse]
    );
    useEffect(() => {
        if (!updateRoomMutationData) {
            return;
        }
        const updatedRoom = updateRoomMutationData.updateRoom;
        updateRoom(updatedRoom);
    }, [updateRoomMutationData, updateRoom]);
    useEffect(() => {
        if (!addRoomMutationData) {
            return;
        }
        const newRoom = addRoomMutationData.createRoom;
        updateRoom(newRoom);
    }, [addRoomMutationData, updateRoom]);
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
    const room = useMemo<RoomInput>(() => {
        if (isAdding) {
            return placeholderRoom;
        } else {
            return courses.get(chosenCourse)?.[chosenRoom] || placeholderRoom;
        }
    }, [courses, chosenCourse, chosenRoom, isAdding]);
    return (
        <Container>
            <CourseSelectContainer
                selectCourse={setChosenCourse}
                selectedCourse={chosenCourse}
                allowedRoles={[StaffRole.Coordinator, StaffRole.Staff]}
            />
            {chosenCourse && (
                <>
                    <FormControl mt={3}>
                        <FormLabel>Choose room:</FormLabel>
                        <Select
                            value={chosenRoom}
                            onChange={(e) => {
                                setChosenRoom(e.target.value);
                                setShowing(true);
                                setIsAdding(false);
                            }}
                        >
                            <option disabled value="">
                                Choose room
                            </option>
                            {Object.entries(
                                courses.get(chosenCourse) || {}
                            ).map(([roomId, room]) => (
                                <option key={roomId} value={roomId}>
                                    {room.name}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                    <Text>or</Text>
                    <Button
                        colorScheme="green"
                        onClick={() => {
                            setIsAdding(true);
                            setShowing(true);
                            setChosenRoom("");
                        }}
                    >
                        Add Room
                    </Button>
                </>
            )}
            <Formik<RoomInput>
                initialValues={room}
                onSubmit={(values) => {
                    if (isAdding) {
                        addRoomMutation({
                            variables: {
                                courseId: chosenCourse,
                                roomInput: values,
                            },
                        });
                    } else {
                        updateRoomMutation({
                            variables: {
                                roomId: chosenRoom,
                                roomInput: values,
                            },
                        });
                    }
                }}
                enableReinitialize={true}
            >
                {showing && (
                    <Form>
                        <Stack spacing={3}>
                            <FormikInput name="name" />
                            <FormikNumberInput name="capacity" />
                            <FormikCheckbox
                                label="Enforce Capacity:"
                                name="enforceCapacity"
                            />
                            <FormikCheckbox
                                label="Disabled:"
                                name="manuallyDisabled"
                            />
                            <FormikActiveTimeInput
                                name="activeTimes"
                                label="Weekly Active Times"
                            />
                            <Button
                                type="submit"
                                colorScheme="blue"
                                w="6em"
                                isLoading={
                                    updateRoomMutationLoading ||
                                    addRoomMutationLoading
                                }
                            >
                                Save
                            </Button>
                        </Stack>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};
