import { RecurrenceRule } from "node-schedule";
import { In } from "typeorm";
import { CourseUserMeta, Question, Queue } from "../entities";

export const endOfDayRule = new RecurrenceRule();
endOfDayRule.hour = 0;
endOfDayRule.tz = "Australia/Brisbane";

export const resetQueues = async () => {
    const queues = await Queue.find({
        clearAfterMidnight: true,
    });
    const questionsToDelete = await Question.find({
        queue: In(queues),
    });
    await Question.remove(questionsToDelete);
};

export const resetQuestionCount = async () => {
    const metas = await CourseUserMeta.find();
    for (const meta of metas) {
        meta.questionsAsked = 0;
    }
    await CourseUserMeta.save(metas);
};
