import { RecurrenceRule } from "node-schedule";
import { In } from "typeorm";
import { CourseUserMeta, Question, Queue } from "../entities";
import { QuestionStatus } from "../types/question";

export const endOfDayRule = new RecurrenceRule();
endOfDayRule.hour = 23;
endOfDayRule.minute = 59;
endOfDayRule.tz = "Australia/Brisbane";

export const resetQueues = async () => {
    const queues = await Queue.find({
        clearAfterMidnight: true,
    });
    const questionsToClose = await Question.find({
        queueId: In(queues.map((queue) => queue.id)),
    });
    for (const question of questionsToClose) {
        question.closedTime = new Date();
        question.status = QuestionStatus.CLOSED;
    }
    await Question.save(questionsToClose);
};

export const resetQuestionCount = async () => {
    const metas = await CourseUserMeta.find();
    for (const meta of metas) {
        meta.questionsAsked = 0;
    }
    await CourseUserMeta.save(metas);
};
