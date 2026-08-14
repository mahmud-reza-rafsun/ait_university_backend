import { prisma } from "../../database/prisma";
import { TCreateTask, TSubmitTask, TUpdateTask } from "../../interface/task.interface";

const createTask = async (payload: TCreateTask) => {
    const lesson = await prisma.lesson.findUnique({
        where: { id: payload.lessonId },
    });

    if (!lesson) {
        throw new Error("Lesson not found");
    }

    return await prisma.task.create({
        data: {
            question: payload.question,
            description: payload.description,
            points: payload.points,
            lessonId: payload.lessonId,
        },
    });
};

const updateTask = async (id: string, payload: TUpdateTask) => {
    const task = await prisma.task.findUnique({
        where: { id },
    });

    if (!task) {
        throw new Error("Task not found");
    }

    return await prisma.task.update({
        where: { id },
        data: payload,
    });
};

const deleteTask = async (id: string) => {
    const task = await prisma.task.findUnique({
        where: { id },
    });

    if (!task) {
        throw new Error("Task not found");
    }

    return await prisma.task.delete({
        where: { id },
    });
};

const getTasksByLesson = async (lessonId: string, studentId: string) => {
    const tasks = await prisma.task.findMany({
        where: { lessonId },
        include: {
            submissions: {
                where: { studentId },
            },
        },
    });

    return tasks.map((task) => {
        const submission = task.submissions[0];

        return {
            id: task.id,
            question: task.question,
            description: task.description,
            lessonId: task.lessonId,
            submission: submission
                ? {
                    id: submission.id,
                    answer: submission.answer,
                    fileUrl: submission.fileUrl,
                    status: submission.status,
                    feedback: submission.feedback,
                    submittedAt: submission.submittedAt,
                }
                : null,
        };
    });
};

const submitTask = async (taskId: string, studentId: string, payload: TSubmitTask) => {
    const task = await prisma.task.findUnique({
        where: { id: taskId },
    });

    if (!task) {
        throw new Error("Task not found");
    }

    return await prisma.taskSubmission.upsert({
        where: {
            studentId_taskId: {
                studentId,
                taskId,
            },
        },
        update: {
            answer: payload.answer,
            fileUrl: payload.fileUrl,
            submittedAt: new Date(),
        },
        create: {
            studentId,
            taskId,
            answer: payload.answer,
            fileUrl: payload.fileUrl,
            submittedAt: new Date(),
        },
    });
};

export const taskService = {
    createTask,
    updateTask,
    deleteTask,
    getTasksByLesson,
    submitTask,
};
