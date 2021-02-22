import React from "react";
import { Flex, FormLabel, Select } from "@chakra-ui/react";

type Props = {
    onSelect: (roomId: string) => void;
    rooms: [roomId: string, roomName: string][];
};

export const RoomSelector: React.FC<Props> = ({ onSelect, rooms }) => {
    return (
        <Flex alignItems="center">
            <FormLabel>Choose room:</FormLabel>
            <Select
                onChange={(e) => {
                    onSelect(e.target.value);
                }}
                maxW="30%"
                defaultValue="default"
            >
                <option value="default" disabled>
                    Choose an option
                </option>
                {rooms.map(([roomId, roomName], key) => (
                    <option key={key} value={roomId}>
                        {roomName}
                    </option>
                ))}
            </Select>
        </Flex>
    );
};
