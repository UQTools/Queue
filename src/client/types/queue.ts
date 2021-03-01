import { QuestionStatus } from "../generated/graphql";
import { Dispatch, SetStateAction } from "react";

export type QueueUtils = {
    updateQuestionStatus: (
        questionId: string,
        status: QuestionStatus,
        message?: string
    ) => void;
    setSelectedQuestion: Dispatch<SetStateAction<string>>;
    openClaimModal: () => void;
    courseCode: string;
};
