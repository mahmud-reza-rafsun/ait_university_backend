import { z } from "zod";

const createWeeklyExamSchema = z.object({
    body: z.object({
        title: z.string({ message: "Title is required" }),
        description: z.string().optional(),
        weekNumber: z.number({ message: "Week number is required" }),
        totalMarks: z.number().optional().default(100),
        subjectId: z.string({ message: "Subject ID is required" }),
        questions: z
            .array(
                z.object({
                    question: z.string({ message: "Question text is required" }),
                }),
            )
            .nonempty({ message: "At least one question is required" }),
    }),
});

const submitExamSchema = z.object({
    body: z.object({
        weeklyExamId: z.string({ message: "Weekly Exam ID is required" }),
        answers: z
            .array(
                z.object({
                    questionId: z.string({ message: "Question ID is required" }),
                    answer: z.string({ message: "Answer text is required" }),
                }),
            )
            .nonempty({ message: "At least one answer must be provided" }),
    }),
});

const evaluateSubmissionSchema = z.object({
    body: z.object({
        obtainedMark: z.number({ message: "Obtained mark is required" }),
        feedback: z.string().optional(),
        grade: z.string().optional(),
    }),
});

export const weeklyExamValidation = {
    createWeeklyExamSchema,
    submitExamSchema,
    evaluateSubmissionSchema,
};
