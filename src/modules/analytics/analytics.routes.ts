import { Role } from "@prisma/client";
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { analyticsController } from "./analytics.controller";

const router = Router();

// Student Route
router.get(
    "/my-progress",
    checkAuth(Role.STUDENT),
    analyticsController.getMyProgress,
);

// Admin / Professor Route
router.get(
    "/overview",
    checkAuth(Role.SUPER_ADMIN, Role.ADMINISTRATOR, Role.PROFESSOR),
    analyticsController.getOverview,
);

export const analyticsRoutes = router;
