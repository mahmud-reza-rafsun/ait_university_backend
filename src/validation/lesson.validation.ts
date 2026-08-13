import { z } from "zod";

const createLessonSchema = z.object({
    body: z.object({
        subjectId: z.string({ message: "Subject ID is required" }),
        title: z.string({ message: "Title is required" }),
        topic: z.string({ message: "Topic is required" }),
        content: z.string({ message: "Content is required" }),
        summary: z.string().optional(),
        examples: z.string({ message: "Examples are required" }),
        order: z.number({ message: "Order is required" }).int().positive(),
        releaseDay: z.number({ message: "Release day is required" }).int().positive(),
    }),
});

const updateLessonSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        topic: z.string().optional(),
        content: z.string().optional(),
        summary: z.string().optional(),
        examples: z.string().optional(),
        order: z.number().int().positive().optional(),
        releaseDay: z.number().int().positive().optional(),
    }),
});

export const lessonValidation = {
    createLessonSchema,
    updateLessonSchema,
};
