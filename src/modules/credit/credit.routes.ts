import { Role } from "@prisma/client";
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { creditValidation } from "../../validation/credit.validation";
import { creditController } from "./credit.controller";

const router = Router();

router.get(
    "/me",
    checkAuth(Role.STUDENT, Role.PROFESSOR, Role.ADMINISTRATOR, Role.SUPER_ADMIN),
    creditController.getMyCredit,
);

router.get(
    "/packages",
    checkAuth(Role.STUDENT),
    creditController.getCreditPackages,
);

router.get(
    "/history",
    checkAuth(Role.STUDENT, Role.PROFESSOR, Role.ADMINISTRATOR, Role.SUPER_ADMIN),
    creditController.getCreditHistory,
);

router.post(
    "/absent-leave",
    checkAuth(Role.STUDENT),
    validateRequest(creditValidation.absentLeaveSchema),
    creditController.absentLeave,
);

router.post(
    "/add",
    checkAuth(Role.SUPER_ADMIN, Role.ADMINISTRATOR),
    validateRequest(creditValidation.addCreditManuallySchema),
    creditController.addCreditManually,
);

export const creditRoutes = router;
