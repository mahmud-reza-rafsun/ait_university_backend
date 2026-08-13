import { Role } from "@prisma/client";
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { lessonController } from "./lesson.controller";
import { lessonValidation } from "../../validation/lesson.validation";

const router = Router();

// Admin / Professor Routes (Full Control)
router.post(
    "/create",
    checkAuth(Role.PROFESSOR, Role.SUPER_ADMIN, Role.ADMINISTRATOR),
    validateRequest(lessonValidation.createLessonSchema),
    lessonController.createLesson,
);

router.get(
    "/get-all",
    checkAuth(Role.PROFESSOR, Role.SUPER_ADMIN, Role.ADMINISTRATOR),
    lessonController.getAllLessons,
);

router.get(
    "/get-single/:id",
    checkAuth(Role.PROFESSOR, Role.SUPER_ADMIN, Role.ADMINISTRATOR),
    lessonController.getSingleLesson,
);

router.patch(
    "/update/:id",
    checkAuth(Role.PROFESSOR, Role.SUPER_ADMIN, Role.ADMINISTRATOR),
    validateRequest(lessonValidation.updateLessonSchema),
    lessonController.updateLesson,
);

router.delete(
    "delete/:id",
    checkAuth(Role.SUPER_ADMIN, Role.ADMINISTRATOR),
    lessonController.deleteLesson,
);

// Student Routes (Read & Complete)
router.get(
    "/student/subject/:subjectId",
    checkAuth(Role.STUDENT),
    lessonController.getLessonsForStudent,
);

router.get(
    "/get-single-student/:id",
    checkAuth(Role.STUDENT),
    lessonController.getSingleLessonForStudent,
);

router.post(
    "/student/:id/complete",
    checkAuth(Role.STUDENT),
    lessonController.completeLesson,
);

export const lessonRoutes = router;
