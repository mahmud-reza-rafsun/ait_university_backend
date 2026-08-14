import { Role } from "@prisma/client";
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { weeklyExamController } from "./weeklyExam.controller";
import { weeklyExamValidation } from "../../validation/weeklyExam.validation";

const router = Router();

// 1. Create Weekly Exam (Professor / Admin)
router.post(
    "/create",
    checkAuth(Role.PROFESSOR, Role.SUPER_ADMIN, Role.ADMINISTRATOR),
    validateRequest(weeklyExamValidation.createWeeklyExamSchema),
    weeklyExamController.createWeeklyExam,
);

// 2. Submit Exam Answers (Student)
router.post(
    "/submit",
    checkAuth(Role.STUDENT),
    validateRequest(weeklyExamValidation.submitExamSchema),
    weeklyExamController.submitExam,
);

// 3. Get Exams by Subject ID
router.get(
    "/subject/:subjectId",
    checkAuth(Role.STUDENT, Role.PROFESSOR, Role.SUPER_ADMIN, Role.ADMINISTRATOR),
    weeklyExamController.getExamsBySubject,
);

// 4. Evaluate Submission (Professor / Admin)
router.patch(
    "/submissions-evaluate/:submissionId",
    checkAuth(Role.PROFESSOR, Role.SUPER_ADMIN, Role.ADMINISTRATOR),
    validateRequest(weeklyExamValidation.evaluateSubmissionSchema),
    weeklyExamController.evaluateSubmission,
);

// 5. Dynamic Single Exam ID Route (MUST be at the bottom)
router.get(
    "exam/:id",
    checkAuth(Role.STUDENT, Role.PROFESSOR, Role.SUPER_ADMIN, Role.ADMINISTRATOR),
    weeklyExamController.getSingleExam,
);

export const weeklyExamRoutes = router;
