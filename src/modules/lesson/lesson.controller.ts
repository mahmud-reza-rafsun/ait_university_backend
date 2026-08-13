import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { lessonService } from "./lesson.service";

const createLesson = catchAsync(async (req: Request, res: Response) => {
    const result = await lessonService.createLesson(req.body);

    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: "Lesson created successfully",
        data: result,
    });
});

const getAllLessons = catchAsync(async (req: Request, res: Response) => {
    const subjectId = req.query.subjectId as string | undefined;
    const result = await lessonService.getAllLessons(subjectId);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "All lessons fetched successfully",
        data: result,
    });
});

const getSingleLesson = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await lessonService.getSingleLesson(id as string);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Lesson details fetched successfully",
        data: result,
    });
});

const updateLesson = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await lessonService.updateLesson(id as string, req.body);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Lesson updated successfully",
        data: result,
    });
});

const deleteLesson = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await lessonService.deleteLesson(id as string);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Lesson deleted successfully",
        data: result,
    });
});

const getLessonsForStudent = catchAsync(async (req: Request, res: Response) => {
    const studentId = req.user!.id as string;
    const { subjectId } = req.params;

    const result = await lessonService.getLessonsForStudent(subjectId as string, studentId);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Student lessons fetched with status",
        data: result,
    });
});

const getSingleLessonForStudent = catchAsync(async (req: Request, res: Response) => {
    const studentId = req.user!.id as string;
    const { id } = req.params;

    const result = await lessonService.getSingleLessonForStudent(id as string, studentId);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Student lesson details fetched successfully",
        data: result,
    });
});

const completeLesson = catchAsync(async (req: Request, res: Response) => {
    const studentId = req.user!.id as string;
    const { id } = req.params;

    const result = await lessonService.completeLesson(id as string, studentId);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Lesson completed successfully",
        data: result,
    });
});

export const lessonController = {
    createLesson,
    getAllLessons,
    getSingleLesson,
    updateLesson,
    deleteLesson,
    getLessonsForStudent,
    getSingleLessonForStudent,
    completeLesson,
};
