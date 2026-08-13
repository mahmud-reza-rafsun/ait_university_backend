import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { creditRoutes } from "../modules/credit/credit.routes";
import { subjectRoutes } from "../modules/subject/subject.routes";
import { enrollmentRoutes } from "../modules/enrollment/enrollment.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/credit", creditRoutes);
router.use("/subject", subjectRoutes);
router.use("/enrollment", enrollmentRoutes);


export const apiRoutes = router;
