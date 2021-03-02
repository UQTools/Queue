import {
    Box,
    Button,
    Center,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    IconButton,
    Input,
    Stack,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Container } from "../components/helpers/Container";
import XLSX from "xlsx";
import { CourseSelectContainer } from "./CourseSelectContainer";
import { DataValidator } from "../components/student-enrolment/DataValidator";
import {
    useAddStudentEnrolmentMutation,
    UserEnrolledSessionInput,
} from "../generated/graphql";
import { List } from "immutable";
import { useMutationWithError } from "../hooks/useApolloHooksWithError";
import { CloseIcon } from "@chakra-ui/icons";

type Props = {};

export const StudentEnrolmentPageContainer: React.FC<Props> = () => {
    const [courseId, setCourseId] = useState("");
    const [data, setData] = useState<Array<Array<string>>>([]);
    const [hasError, setHasError] = useState(true);
    const [suffix, setSuffix] = useState("");
    const [prefix, setPrefix] = useState("");
    const [parsedData, setParsedData] = useState<
        List<UserEnrolledSessionInput>
    >(List());
    const toast = useToast();
    const [
        addEnrolmentMutation,
        { data: addEnrolmentData, loading: addEnrolmentLoading },
    ] = useMutationWithError(useAddStudentEnrolmentMutation, {
        errorPolicy: "all",
    });
    const onDrop = useCallback((files) => {
        /* Boilerplate to set up FileReader */
        const file = files[0];
        const reader = new FileReader();
        const asBinary = !!reader.readAsBinaryString;
        reader.onload = (e) => {
            /* Parse data */
            const buffer = e.target?.result;
            const workBook = XLSX.read(buffer, {
                type: asBinary ? "binary" : "array",
            });
            /* Get first worksheet */
            const sheetName = workBook.SheetNames[0];
            const workSheet = workBook.Sheets[sheetName];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
            /* Update state */
            // this.setState({ data: data, cols: make_cols(ws['!ref']) });
            setData(data as string[][]);
        };
        if (asBinary) {
            reader.readAsBinaryString(file);
        } else {
            reader.readAsArrayBuffer(file);
        }
    }, []);
    useEffect(() => {
        if (hasError) {
            return;
        }
        setParsedData((prev) => prev.clear());
        const studentIndex = data[0].indexOf("STUDENT_CODE");
        const activityGroupIndex = data[0].indexOf("ACTIVITY_GROUP_CODE");
        const activityIndex = data[0].indexOf("ACTIVITY_CODE");
        for (const row of data.slice(1)) {
            const username = `s${row[studentIndex].substring(
                0,
                row[studentIndex].length - 1
            )}`;
            const session =
                row[activityIndex] === "unallocated"
                    ? "Unallocated"
                    : `${prefix}${row[activityGroupIndex][0]}${row[activityIndex]}${suffix}`;
            setParsedData((prev) =>
                prev.push({
                    username,
                    session,
                })
            );
        }
    }, [data, hasError, prefix, suffix]);
    useEffect(() => {
        if (!addEnrolmentData) {
            return;
        }
        toast({
            status: "success",
            title: "Enrolment Applied",
            description:
                "Enrolment successfully applied and can now be seen on the queues",
            isClosable: true,
            duration: 5000,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addEnrolmentData]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });
    const borderColour = useColorModeValue("gray.200", "gray.600");

    return (
        <Container>
            <Heading>Student Enrolment</Heading>
            <CourseSelectContainer
                selectCourse={setCourseId}
                selectedCourse={courseId}
            />
            {courseId !== "" && (
                <Box
                    {...getRootProps()}
                    w="50%"
                    h="200px"
                    borderWidth={5}
                    borderColor={borderColour}
                    borderRadius={5}
                    borderStyle="dashed"
                    mt={4}
                >
                    <Center h="100%">
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <Text>
                                Drop the student enrolment Excel file here...
                            </Text>
                        ) : (
                            <Text>
                                Drag and drop the student enrolment Excel file
                                here, or click to select file...
                            </Text>
                        )}
                    </Center>
                </Box>
            )}
            {data.length > 0 && (
                <DataValidator data={data} setHasError={setHasError} />
            )}
            {!hasError && (
                <Stack spacing={3}>
                    <HStack>
                        <FormControl>
                            <FormLabel>Session prefix (optional)</FormLabel>
                            <Input
                                value={prefix}
                                onChange={(e) => setPrefix(e.target.value)}
                                placeholder="e.g. CSSE7030, CSSE7023"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Session suffix (optional)</FormLabel>
                            <Input
                                value={suffix}
                                onChange={(e) => setSuffix(e.target.value)}
                                placeholder="e.g. External, Flexible"
                            />
                        </FormControl>
                    </HStack>
                    <Heading size="lg">Session preview</Heading>
                    <Box h="80vh" overflowY="auto">
                        <Table variant="striped">
                            <Thead>
                                <Tr>
                                    <Th isNumeric>#</Th>
                                    <Th>Username</Th>
                                    <Th>Session</Th>
                                    <Th isNumeric />
                                </Tr>
                            </Thead>
                            <Tbody>
                                {parsedData.map((userSession, i) => (
                                    <Tr key={i}>
                                        <Td isNumeric>{i + 1}</Td>
                                        <Td>{userSession.username}</Td>
                                        <Td>{userSession.session}</Td>
                                        <Td isNumeric>
                                            <IconButton
                                                colorScheme="red"
                                                aria-label={`remove-enrolment-${i}`}
                                                onClick={() => {
                                                    setParsedData((prev) =>
                                                        prev.remove(i)
                                                    );
                                                }}
                                                icon={<CloseIcon />}
                                            />
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                    <Button
                        colorScheme="blue"
                        isLoading={addEnrolmentLoading}
                        onClick={() => {
                            addEnrolmentMutation({
                                variables: {
                                    courseId,
                                    userEnrolledSessions: parsedData.toArray(),
                                },
                            });
                        }}
                        w="10em"
                    >
                        Apply
                    </Button>
                </Stack>
            )}
        </Container>
    );
};
