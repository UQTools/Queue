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
    Link,
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
    const [filename, setFilename] = useState("");
    const [hasError, setHasError] = useState(true);
    const [suffix, setSuffix] = useState("");
    const [prefix, setPrefix] = useState("");
    const [parsedData, setParsedData] = useState<
        List<UserEnrolledSessionInput>
    >(List());
    const successToast = useToast({
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
    });
    const errorToast = useToast({
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
    });
    useEffect(() => {
        document.title = "Student Enrolment";
    }, []);
    const [
        addEnrolmentMutation,
        { data: addEnrolmentData, loading: addEnrolmentLoading },
    ] = useMutationWithError(useAddStudentEnrolmentMutation, {
        errorPolicy: "all",
    });
    const onDrop = useCallback((files: File[]) => {
        const file = files[0];
        setFilename(file.name);
        const reader = new FileReader();
        const asBinary = !!reader.readAsBinaryString;
        reader.onload = (e) => {
            try {
                const buffer = e.target?.result;
                const workBook = XLSX.read(buffer, {
                    type: asBinary ? "binary" : "array",
                });
                const sheetName = workBook.SheetNames[0];
                const workSheet = workBook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
                setData(data as string[][]);
            } catch (e) {
                errorToast({
                    title: "Invalid file",
                    description: "An error happened while trying to the file",
                });
            }
        };
        if (asBinary) {
            reader.readAsBinaryString(file);
        } else {
            reader.readAsArrayBuffer(file);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (hasError) {
            return;
        }
        try {
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
        } catch (e) {
            errorToast({
                title: "Invalid file",
                description: "An error happened while trying to the file",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, hasError, prefix, suffix]);
    useEffect(() => {
        if (!addEnrolmentData) {
            return;
        }
        successToast({
            title: "Enrolment Applied",
            description:
                "Enrolment successfully applied and can now be seen on the queues",
        });
        setFilename("");
        setParsedData(List());
        setPrefix("");
        setSuffix("");
        setHasError(true);
        setData([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addEnrolmentData]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });
    const borderColour = useColorModeValue("gray.200", "gray.600");

    return (
        <Container>
            <Heading as="h1">Student Enrolment</Heading>
            <Text my={5}>
                Choose an Excel file downloaded from <i>Allocate+</i> with the
                data of the enrolment. An example of a valid file is located{" "}
                <Link
                    href="https://docs.google.com/spreadsheets/d/1xtPFAoRLQjpNG74tkB_gbT7v1IznHV6ippOtVFTc5Z0/edit?usp=sharing"
                    color="teal.500"
                    isExternal
                >
                    here
                </Link>
                .
            </Text>
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
            {filename && <Text>{filename}</Text>}
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
                    <Heading size="lg">Enrolment preview</Heading>
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
