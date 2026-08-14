import { z } from "zod";

const createTaskSchema = z.object({
    body: z.object({
        question: z.string({ message: "Question is required" }),
        lessonId: z.string({ message: "Lesson ID is required" }),
        description: z.string().optional(),
        points: z.number().int().positive().optional(),
    }),
});

const updateTaskSchema = z.object({
    body: z.object({
        question: z.string().optional(),
        description: z.string().optional(),
        points: z.number().int().positive().optional(),
    }),
});

const submitTaskSchema = z.object({
    body: z.object({
        answer: z.string().optional(),
        fileUrl: z.string().url("Invalid URL format").optional(),
    }).refine((data) => data.answer || data.fileUrl, {
        message: "Either answer or fileUrl must be provided",
    }),
});

export const taskValidation = {
    createTaskSchema,
    updateTaskSchema,
    submitTaskSchema,
};
