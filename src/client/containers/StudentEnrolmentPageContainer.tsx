import {
    Box,
    Center,
    Heading,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Container } from "../components/helpers/Container";
import XLSX from "xlsx";
import { CourseSelectContainer } from "./CourseSelectContainer";
import { DataValidator } from "../components/student-enrolment/DataValidator";

type Props = {};

export const StudentEnrolmentPageContainer: React.FC<Props> = ({}) => {
    const [courseId, setCourseId] = useState("");
    const [data, setData] = useState<Array<Array<string>>>([]);
    const onDrop = useCallback((files) => {
        /* Boilerplate to set up FileReader */
        console.log(files);
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
            {data.length > 0 && <DataValidator data={data} />}
        </Container>
    );
};
