import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { submissionService } from "./submission.service";

const getAllSubmissions = catchAsync(async (req: Request, res: Response) => {
    const result = await submissionService.getAllSubmissions(req.query);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Submissions fetched successfully",
        data: result,
    });
});

const getSubmissionById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await submissionService.getSubmissionById(id as string);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Submission fetched successfully",
        data: result,
    });
});

const reviewSubmission = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await submissionService.reviewSubmission(id as string, req.body);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Submission reviewed successfully",
        data: result,
    });
});

export const submissionController = {
    getAllSubmissions,
    getSubmissionById,
    reviewSubmission,
};
