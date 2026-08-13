import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { creditService } from "./credit.service";

const getMyCredit = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await creditService.getMyCredit(userId);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Credit fetched successfully",
        data: result,
    });
});

const getCreditPackages = catchAsync(async (_req: Request, res: Response) => {
    const result = await creditService.getCreditPackages();

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Credit packages fetched successfully",
        data: result,
    });
});

const absentLeave = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { lessonId } = req.body;

    const result = await creditService.absentLeave({ userId, lessonId });

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Absent leave applied successfully",
        data: result,
    });
});

const getCreditHistory = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await creditService.getCreditHistory(userId);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Credit history fetched successfully",
        data: result,
    });
});

const addCreditManually = catchAsync(async (req: Request, res: Response) => {
    const { userId, amount } = req.body;
    const result = await creditService.addCreditManually({ userId, amount });

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Credit added successfully",
        data: result,
    });
});

export const creditController = {
    getMyCredit,
    getCreditPackages,
    absentLeave,
    getCreditHistory,
    addCreditManually,
};
