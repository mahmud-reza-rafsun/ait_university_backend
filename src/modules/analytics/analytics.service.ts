import { SubmitStatus } from "@prisma/client";
import { prisma } from "../../database/prisma";

// Student's Personal Progress Dashboard
const getStudentProgress = async (studentId: string) => {
    const [totalLessons, totalTasks, submittedTasks, reviewedTasks] = await Promise.all([
        prisma.lesson.count(),
        prisma.task.count(),
        prisma.taskSubmission.count({
            where: { studentId },
        }),
        prisma.taskSubmission.count({
            where: {
                studentId,
                status: SubmitStatus.REVIEWED,
            },
        }),
    ]);

    const progressPercentage = totalTasks > 0
        ? Number(((submittedTasks / totalTasks) * 100).toFixed(2))
        : 0;

    return {
        totalLessons,
        totalTasks,
        submittedTasks,
        reviewedTasks,
        progressPercentage,
    };
};

// Admin & Professor Overview Analytics
const getOverviewAnalytics = async () => {
    const [
        totalStudents,
        totalProfessors,
        totalCourses,
        totalLessons,
        totalSubmissions,
        pendingSubmissions,
    ] = await Promise.all([
        prisma.user.count({ where: { role: "STUDENT" } }),
        prisma.user.count({ where: { role: "PROFESSOR" } }),
        prisma.subject.count(),
        prisma.lesson.count(),
        prisma.taskSubmission.count(),
        prisma.taskSubmission.count({ where: { status: SubmitStatus.PENDING } }),
    ]);

    return {
        totalStudents,
        totalProfessors,
        totalCourses,
        totalLessons,
        totalSubmissions,
        pendingSubmissions,
    };
};

export const analyticsService = {
    getStudentProgress,
    getOverviewAnalytics,
};
