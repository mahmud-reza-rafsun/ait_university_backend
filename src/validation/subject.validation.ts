import { z } from "zod";

const createSubjectSchema = z.object({
    body: z.object({
        title: z.string({ message: "Title is required" }),
        description: z.string({ message: "Description is required" }),
        thumbnail: z.string().optional(),
        price: z.number({ message: "Price is required" }).positive("Price must be positive"),
        durationDays: z.number().optional(),
    }),
});

const updateSubjectSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        thumbnail: z.string().optional(),
        price: z.number().positive().optional(),
        durationDays: z.number().optional(),
        isPublished: z.boolean().optional(),
    }),
});

export const subjectValidation = {
    createSubjectSchema,
    updateSubjectSchema,
};
