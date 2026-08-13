import { z } from "zod";

const purchaseCreditSchema = z.object({
    body: z.object({
        packageId: z.string().min(1, "Package ID is required"),
        paymentMethod: z.enum(["STRIPE", "BKASH"], {
            message: "Payment method must be STRIPE or BKASH",
        }),
    }),
});

const absentLeaveSchema = z.object({
    body: z.object({
        lessonId: z.string().min(1, "Lesson ID is required"), // 👈 attendanceId remove
    }),
});

const addCreditManuallySchema = z.object({
    body: z.object({
        userId: z.string().min(1, "User ID is required"),
        amount: z.number().min(1, "Amount must be at least 1"),
    }),
});

export const creditValidation = {
    purchaseCreditSchema,
    absentLeaveSchema,
    addCreditManuallySchema,
};
