import { TaskType } from "@prisma/client";
import { z } from "zod";

const createTaskSchema = z.object({
    body: z.object({
        title: z.string({ message: "Title is required" }),
        description: z.string({ message: "Description is required" }),
        type: z.nativeEnum(TaskType, {
            message: "Type must be ASSIGNMENT, QUIZ, PRACTICE, or PROJECT",
        }).optional(),
        points: z.number().int().positive().optional(),
        lessonId: z.string({ message: "Lesson ID is required" }),
    }),
});

const updateTaskSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        type: z.nativeEnum(TaskType, {
            message: "Type must be ASSIGNMENT, QUIZ, PRACTICE, or PROJECT",
        }).optional(),
        points: z.number().int().positive().optional(),
    }),
});

const submitTaskSchema = z.object({
    body: z.object({
        submissionUrl: z.string({ message: "Submission URL is required" }).url("Invalid URL format"),
        notes: z.string().optional(),
    }),
});

export const taskValidation = {
    createTaskSchema,
    updateTaskSchema,
    submitTaskSchema,
};
