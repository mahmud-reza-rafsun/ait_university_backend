import { prisma } from "../../database/prisma";
import { TCreateWeeklyExam, TEvaluateSubmission, TSubmitExam } from "../../interface/weeklyExam.interface";


// 1. Create Exam with Questions (Professor / Admin)
const createWeeklyExam = async (payload: TCreateWeeklyExam) => {
    const { title, description, weekNumber, totalMarks, subjectId, questions } =
        payload;

    return await prisma.weeklyExam.create({
        data: {
            title,
            description,
            weekNumber,
            totalMarks,
            subjectId,
            questions: {
                create: questions.map((q) => ({
                    question: q.question,
                })),
            },
        },
        include: {
            questions: true,
            subject: true,
        },
    });
};

// 2. Get Exams by Subject ID
const getExamsBySubject = async (subjectId: string) => {
    return await prisma.weeklyExam.findMany({
        where: { subjectId },
        include: {
            questions: true,
        },
        orderBy: {
            weekNumber: "asc",
        },
    });
};

// 3. Get Single Exam Details
const getSingleExam = async (id: string) => {
    const exam = await prisma.weeklyExam.findUnique({
        where: { id },
        include: {
            questions: true,
            subject: true,
        },
    });

    if (!exam) {
        throw new Error("Weekly Exam not found");
    }

    return exam;
};

const getAllExams = async (query: {
    subjectId?: string;
    searchTerm?: string;
}) => {
    const { subjectId, searchTerm } = query;

    return await prisma.weeklyExam.findMany({
        where: {
            ...(subjectId && { subjectId }),
            ...(searchTerm && {
                OR: [
                    { title: { contains: searchTerm, mode: "insensitive" } },
                    { description: { contains: searchTerm, mode: "insensitive" } },
                ],
            }),
        },
        include: {
            subject: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                },
            },
            _count: {
                select: {
                    questions: true,
                    submissions: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

// 4. Submit Exam Answers (Student)
const submitExam = async (studentId: string, payload: TSubmitExam) => {
    const { weeklyExamId, answers } = payload;

    const exam = await prisma.weeklyExam.findUnique({
        where: { id: weeklyExamId },
    });

    if (!exam) {
        throw new Error("Weekly Exam not found");
    }

    const existingSubmission = await prisma.examSubmission.findUnique({
        where: {
            studentId_weeklyExamId: {
                studentId,
                weeklyExamId,
            },
        },
    });

    if (existingSubmission) {
        throw new Error("You have already submitted answers for this exam");
    }

    return await prisma.examSubmission.create({
        data: {
            studentId,
            weeklyExamId,
            answers: {
                create: answers.map((a) => ({
                    questionId: a.questionId,
                    answer: a.answer,
                })),
            },
        },
        include: {
            answers: true,
        },
    });
};

// 5. Evaluate Exam Submission (Professor / Admin)
const evaluateSubmission = async (
    submissionId: string,
    payload: TEvaluateSubmission,
) => {
    const submission = await prisma.examSubmission.findUnique({
        where: { id: submissionId },
    });

    if (!submission) {
        throw new Error("Exam submission not found");
    }

    return await prisma.examSubmission.update({
        where: { id: submissionId },
        data: {
            obtainedMark: payload.obtainedMark,
            feedback: payload.feedback,
            grade: payload.grade,
            isEvaluated: true,
            evaluatedAt: new Date(),
        },
    });
};

export const weeklyExamService = {
    createWeeklyExam,
    getExamsBySubject,
    getAllExams,
    getSingleExam,
    submitExam,
    evaluateSubmission,
};
