import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { subjectService } from "./subject.service";

const createSubject = catchAsync(async (req: Request, res: Response) => {
    const professorId = req.user!.id;
    const result = await subjectService.createSubject(professorId, req.body);

    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: "Subject created successfully",
        data: result,
    });
});

const getAllSubjects = catchAsync(async (_req: Request, res: Response) => {
    const result = await subjectService.getAllSubjects();

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Subjects fetched successfully",
        data: result,
    });
});

const getSingleSubject = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await subjectService.getSingleSubject(id as string);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Subject details fetched successfully",
        data: result,
    });
});

const updateSubject = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body
    const result = await subjectService.updateSubject(id as string, payload);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Subject updated successfully",
        data: result,
    });
});

const deleteSubject = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await subjectService.deleteSubject(id as string);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Subject deleted successfully",
        data: result,
    });
});

export const subjectController = {
    createSubject,
    getAllSubjects,
    getSingleSubject,
    updateSubject,
    deleteSubject,
};
