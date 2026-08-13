import { z } from "zod";

const createEnrollmentSchema = z.object({
    body: z.object({
        subjectId: z.string({
            message: "Subject ID is required",
        }),
    }),
});

export const enrollmentValidation = {
    createEnrollmentSchema,
};
