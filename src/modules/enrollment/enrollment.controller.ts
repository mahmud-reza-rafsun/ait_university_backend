import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { enrollmentService } from "./enrollment.service";

const createEnrollment = catchAsync(async (req: Request, res: Response) => {
    const studentId = req.user!.id;
    const result = await enrollmentService.createEnrollment(studentId, req.body);

    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: "Enrolled in subject successfully",
        data: result,
    });
});

const getMyEnrollments = catchAsync(async (req: Request, res: Response) => {
    const studentId = req.user!.id;
    const result = await enrollmentService.getMyEnrollments(studentId);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Enrolled subjects fetched successfully",
        data: result,
    });
});

const getSingleEnrollment = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await enrollmentService.getSingleEnrollment(id as string);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Enrollment details fetched successfully",
        data: result,
    });
});

export const enrollmentController = {
    createEnrollment,
    getMyEnrollments,
    getSingleEnrollment,
};
