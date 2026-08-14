import { SubmitStatus } from "@prisma/client";

export interface TReviewSubmission {
    status: SubmitStatus;
    feedback?: string;
}

export interface TSubmissionQuery {
    taskId?: string;
    studentId?: string;
    status?: SubmitStatus;
}
