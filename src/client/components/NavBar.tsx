import { ChevronDownIcon, Icon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
    Box,
    Divider,
    Flex,
    Heading,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spacer,
    Tooltip,
    useColorMode,
    useColorModeValue,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { UserContext } from "../utils/user";
import { BsPersonFill } from "react-icons/all";
import { NavBarMenuButton } from "./navbar/NavBarMenuButton";
import { Link as RouterLink } from "react-router-dom";
import { StaffRole } from "../generated/graphql";

type Props = {};

export const NavBar: React.FunctionComponent<Props> = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const bgColor = useColorModeValue("gray.100", "gray.900");
    const user = useContext(UserContext);
    return (
        <>
            <Box w="100%" bgColor={bgColor}>
                <Flex w="80%" mx="auto" h={14} alignItems="center">
                    <Box>
                        <RouterLink to="/">
                            <Heading
                                size="md"
                                fontWeight="bold"
                                fontFamily="'Courier New', monospace"
                            >
                                Q
                            </Heading>
                        </RouterLink>
                    </Box>
                    <Spacer />
                    {user && (user.isAdmin || user.courseStaff.length > 0) && (
                        <Menu>
                            <MenuButton
                                as={NavBarMenuButton}
                                rightIcon={<ChevronDownIcon />}
                                style={{ cursor: "pointer" }}
                            >
                                Tools
                            </MenuButton>
                            <MenuList style={{ margin: 0 }}>
                                <MenuItem>
                                    <RouterLink to="/rooms">Rooms</RouterLink>
                                </MenuItem>
                                {(user.isAdmin ||
                                    user.courseStaff.filter(
                                        (courseStaff) =>
                                            courseStaff.role ===
                                            StaffRole.Coordinator
                                    ).length > 0) && (
                                    <>
                                        <MenuItem>
                                            <RouterLink to="/course-staff">
                                                Course Staff
                                            </RouterLink>
                                        </MenuItem>
                                        <MenuItem>
                                            <RouterLink to="/student-enrolment">
                                                Student Enrolment
                                            </RouterLink>
                                        </MenuItem>
                                    </>
                                )}
                            </MenuList>
                        </Menu>
                    )}
                    <Menu>
                        <MenuButton
                            as={NavBarMenuButton}
                            leftIcon={<Icon as={BsPersonFill} mr={1} />}
                            rightIcon={<ChevronDownIcon ml={1} />}
                            style={{ cursor: "pointer" }}
                        >
                            {user?.name}
                        </MenuButton>
                        <MenuList>
                            <MenuItem
                                as="a"
                                href="https://api.uqcloud.net/logout/"
                            >
                                Log out
                            </MenuItem>
                        </MenuList>
                    </Menu>
                    <Tooltip
                        label={
                            colorMode === "light"
                                ? "Toggle Dark Mode"
                                : "Toggle Light Mode"
                        }
                    >
                        <NavBarMenuButton
                            onClick={toggleColorMode}
                            style={{ cursor: "pointer" }}
                        >
                            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                        </NavBarMenuButton>
                    </Tooltip>
                </Flex>
            </Box>
            <Divider />
        </>
    );
};
