import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { analyticsService } from "./analytics.service";

const getMyProgress = catchAsync(async (req: Request, res: Response) => {
    const studentId = req.user.id;
    const result = await analyticsService.getStudentProgress(studentId);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Student progress analytics fetched successfully",
        data: result,
    });
});

const getOverview = catchAsync(async (req: Request, res: Response) => {
    const result = await analyticsService.getOverviewAnalytics();

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Overview analytics fetched successfully",
        data: result,
    });
});

export const analyticsController = {
    getMyProgress,
    getOverview,
};
