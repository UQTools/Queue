import { Queue } from "../entities";

export const updatedQueue = async (queue: Queue) => {
    queue.lastAccessed = new Date();
    return await queue.save();
};
