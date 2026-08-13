import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { taskService } from "./task.service";

const createTask = catchAsync(async (req: Request, res: Response) => {
    const result = await taskService.createTask(req.body);

    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: "Task created successfully",
        data: result,
    });
});

const updateTask = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await taskService.updateTask(id as string, req.body);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Task updated successfully",
        data: result,
    });
});

const deleteTask = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await taskService.deleteTask(id as string);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Task deleted successfully",
        data: result,
    });
});

const getTasksByLesson = catchAsync(async (req: Request, res: Response) => {
    const studentId = req.user!.id as string;
    const { lessonId } = req.params;

    const result = await taskService.getTasksByLesson(lessonId as string, studentId);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Tasks fetched successfully",
        data: result,
    });
});

const submitTask = catchAsync(async (req: Request, res: Response) => {
    const studentId = req.user!.id as string;
    const { id } = req.params;

    const result = await taskService.submitTask(id as string, studentId, req.body);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Task submitted successfully",
        data: result,
    });
});

export const taskController = {
    createTask,
    updateTask,
    deleteTask,
    getTasksByLesson,
    submitTask,
};
