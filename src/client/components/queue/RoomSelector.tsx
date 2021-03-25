import React from "react";
import { Flex, FormLabel, Select } from "@chakra-ui/react";

type Props = {
    selected: string;
    onSelect: (roomId: string) => void;
    rooms: [roomId: string, roomName: string][];
};

export const RoomSelector: React.FC<Props> = ({
    onSelect,
    rooms,
    selected,
}) => {
    return (
        <Flex alignItems="center">
            <FormLabel>Choose room:</FormLabel>
            <Select
                onChange={(e) => {
                    onSelect(e.target.value);
                }}
                w="25vw"
                value={selected}
            >
                <option value="default" disabled>
                    Choose an option
                </option>
                {rooms.map(([roomId, roomName]) => (
                    <option key={roomId} value={roomId}>
                        {roomName}
                    </option>
                ))}
            </Select>
        </Flex>
    );
};
