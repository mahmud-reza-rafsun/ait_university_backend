import { z } from "zod";

const absentLeaveSchema = z.object({
    body: z.object({
        lessonId: z.string({
            message: "Lesson ID is required",
        }),
    }),
});

const addCreditManuallySchema = z.object({
    body: z.object({
        userId: z.string({
            message: "User ID is required",
        }),
        amount: z
            .number({
                message: "Amount is required",
            })
            .positive("Amount must be a positive number"),
    }),
});

export const creditValidation = {
    absentLeaveSchema,
    addCreditManuallySchema,
};
