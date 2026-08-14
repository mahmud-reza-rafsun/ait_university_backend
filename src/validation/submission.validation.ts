import { SubmitStatus } from "@prisma/client";
import { z } from "zod";

const reviewSubmissionSchema = z.object({
    body: z.object({
        status: z.nativeEnum(SubmitStatus, {
            message: "Status must be a valid Submit Status value",
        }),
        feedback: z.string().optional(),
    }),
});

export const submissionValidation = {
    reviewSubmissionSchema,
};
