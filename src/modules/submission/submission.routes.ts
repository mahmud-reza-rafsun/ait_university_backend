import { Role } from "@prisma/client";
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { submissionController } from "./submission.controller";
import { submissionValidation } from "../../validation/submission.validation";

const router = Router();

// Professor & Admin Only Routes
router.get(
    "/",
    checkAuth(Role.PROFESSOR, Role.SUPER_ADMIN, Role.ADMINISTRATOR),
    submissionController.getAllSubmissions,
);

router.get(
    "/:id",
    checkAuth(Role.PROFESSOR, Role.SUPER_ADMIN, Role.ADMINISTRATOR),
    submissionController.getSubmissionById,
);

router.patch(
    "/review/:id",
    checkAuth(Role.PROFESSOR, Role.SUPER_ADMIN, Role.ADMINISTRATOR),
    validateRequest(submissionValidation.reviewSubmissionSchema),
    submissionController.reviewSubmission,
);

export const submissionRoutes = router;
