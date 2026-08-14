import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { weeklyExamService } from "./weeklyExam.service";

const createWeeklyExam = catchAsync(async (req: Request, res: Response) => {
    const result = await weeklyExamService.createWeeklyExam(req.body);

    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: "Weekly Exam created successfully",
        data: result,
    });
});

const getExamsBySubject = catchAsync(async (req: Request, res: Response) => {
    const { subjectId } = req.params;
    const result = await weeklyExamService.getExamsBySubject(subjectId as string);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Weekly Exams fetched successfully",
        data: result,
    });
});

const getSingleExam = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await weeklyExamService.getSingleExam(id as string);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Weekly Exam fetched successfully",
        data: result,
    });
});

const submitExam = catchAsync(async (req: Request, res: Response) => {
    const studentId = req.user.id;
    const result = await weeklyExamService.submitExam(studentId, req.body);

    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: "Exam submitted successfully",
        data: result,
    });
});

const evaluateSubmission = catchAsync(async (req: Request, res: Response) => {
    const { submissionId } = req.params;
    const result = await weeklyExamService.evaluateSubmission(
        submissionId as string,
        req.body,
    );

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Exam evaluation completed successfully",
        data: result,
    });
});
const getAllExams = catchAsync(async (req: Request, res: Response) => {
    const result = await weeklyExamService.getAllExams(req.query);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "All weekly exams fetched successfully",
        data: result,
    });
});

export const weeklyExamController = {
    createWeeklyExam,
    getExamsBySubject,
    getSingleExam,
    submitExam,
    getAllExams,
    evaluateSubmission,
};
