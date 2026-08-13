import { Role } from "@prisma/client";
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { subjectController } from "./subject.controller";
import { subjectValidation } from "../../validation/subject.validation";

const router = Router();

router.post(
    "/create",
    checkAuth(Role.PROFESSOR, Role.SUPER_ADMIN, Role.ADMINISTRATOR),
    validateRequest(subjectValidation.createSubjectSchema),
    subjectController.createSubject,
);

router.get("/get-all", subjectController.getAllSubjects);

router.get("/get-single/:id", subjectController.getSingleSubject);

router.patch(
    "/status-update/:id",
    checkAuth(Role.PROFESSOR, Role.SUPER_ADMIN, Role.ADMINISTRATOR),
    validateRequest(subjectValidation.updateSubjectSchema),
    subjectController.updateSubject,
);

router.delete(
    "/delete/:id",
    checkAuth(Role.SUPER_ADMIN, Role.ADMINISTRATOR),
    subjectController.deleteSubject,
);

export const subjectRoutes = router;
