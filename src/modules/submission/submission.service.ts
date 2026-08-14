import { prisma } from "../../database/prisma";
import { TReviewSubmission, TSubmissionQuery } from "../../interface/submission.interface";

// Admin / Professor Operations
const getAllSubmissions = async (query: TSubmissionQuery) => {
    const { taskId, studentId, status } = query;

    return await prisma.taskSubmission.findMany({
        where: {
            ...(taskId && { taskId }),
            ...(studentId && { studentId }),
            ...(status && { status }),
        },
        include: {
            student: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            task: {
                select: {
                    id: true,
                    question: true,
                },
            },
        },
        orderBy: {
            submittedAt: "desc",
        },
    });
};

const getSubmissionById = async (id: string) => {
    const submission = await prisma.taskSubmission.findUnique({
        where: { id },
        include: {
            student: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            task: true,
        },
    });

    if (!submission) {
        throw new Error("Submission not found");
    }

    return submission;
};

const reviewSubmission = async (id: string, payload: TReviewSubmission) => {
    const submission = await prisma.taskSubmission.findUnique({
        where: { id },
    });

    if (!submission) {
        throw new Error("Submission not found");
    }

    return await prisma.taskSubmission.update({
        where: { id },
        data: {
            status: payload.status,
            feedback: payload.feedback,
            reviewedAt: new Date(),
        },
    });
};

export const submissionService = {
    getAllSubmissions,
    getSubmissionById,
    reviewSubmission,
};
