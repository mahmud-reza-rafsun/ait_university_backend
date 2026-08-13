import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { creditRoutes } from "../modules/credit/credit.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/credit", creditRoutes);


export const apiRoutes = router;
