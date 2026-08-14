import { Role } from "@prisma/client";
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { taskController } from "./task.controller";
import { taskValidation } from "../../validation/task.validation";

const router = Router();

// Admin / Professor Management Routes
router.post(
    "/create",
    checkAuth(Role.PROFESSOR, Role.SUPER_ADMIN, Role.ADMINISTRATOR),
    validateRequest(taskValidation.createTaskSchema),
    taskController.createTask,
);

router.patch(
    "/update/:id",
    checkAuth(Role.PROFESSOR, Role.SUPER_ADMIN, Role.ADMINISTRATOR),
    validateRequest(taskValidation.updateTaskSchema),
    taskController.updateTask,
);

router.delete(
    "/delete/:id",
    checkAuth(Role.SUPER_ADMIN, Role.ADMINISTRATOR),
    taskController.deleteTask,
);

// Student Routes
router.get(
    "/lesson/:lessonId",
    checkAuth(Role.STUDENT),
    taskController.getTasksByLesson,
);

router.post(
    "/submit/:id",
    checkAuth(Role.STUDENT),
    validateRequest(taskValidation.submitTaskSchema),
    taskController.submitTask,
);

export const taskRoutes = router;
