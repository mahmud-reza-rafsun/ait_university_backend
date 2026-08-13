import { Role } from "@prisma/client";
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { enrollmentController } from "./enrollment.controller";
import { enrollmentValidation } from "../../validation/enrollment.validation";

const router = Router();

router.post(
    "/",
    checkAuth(Role.STUDENT),
    validateRequest(enrollmentValidation.createEnrollmentSchema),
    enrollmentController.createEnrollment,
);

router.get(
    "/my-enrollments",
    checkAuth(Role.STUDENT),
    enrollmentController.getMyEnrollments,
);

router.get(
    "/:id",
    checkAuth(Role.STUDENT, Role.PROFESSOR, Role.ADMINISTRATOR, Role.SUPER_ADMIN),
    enrollmentController.getSingleEnrollment,
);

export const enrollmentRoutes = router;
