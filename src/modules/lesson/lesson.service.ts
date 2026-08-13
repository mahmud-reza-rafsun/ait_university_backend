import { LessonStatus } from "@prisma/client";
import { prisma } from "../../database/prisma";
import { TCreateLesson, TUpdateLesson } from "../../interface/lesson.interface";

// Admin / Professor Operations
const createLesson = async (payload: TCreateLesson) => {
    const subject = await prisma.subject.findUnique({
        where: { id: payload.subjectId },
    });

    if (!subject) {
        throw new Error("Subject not found");
    }

    return await prisma.lesson.create({
        data: payload,
    });
};

const getAllLessons = async (subjectId?: string) => {
    return await prisma.lesson.findMany({
        where: subjectId ? { subjectId } : {},
        include: {
            subject: { select: { title: true } },
        },
        orderBy: [{ releaseDay: "asc" }, { order: "asc" }],
    });
};

const getSingleLesson = async (id: string) => {
    const lesson = await prisma.lesson.findUnique({
        where: { id },
        include: { subject: true, tasks: true },
    });

    if (!lesson) {
        throw new Error("Lesson not found");
    }

    return lesson;
};

const updateLesson = async (id: string, payload: TUpdateLesson) => {
    return await prisma.lesson.update({
        where: { id },
        data: payload,
    });
};

const deleteLesson = async (id: string) => {
    return await prisma.lesson.delete({
        where: { id },
    });
};

// Student Operations
const getLessonsForStudent = async (subjectId: string, studentId: string) => {
    const lessons = await prisma.lesson.findMany({
        where: { subjectId },
        orderBy: [{ releaseDay: "asc" }, { order: "asc" }],
        include: {
            progresses: {
                where: { studentId },
            },
        },
    });

    let isPreviousCompleted = true;

    return lessons.map((lesson, index) => {
        const progress = lesson.progresses[0];
        const isCompleted = progress?.status === LessonStatus.COMPLETED;

        let currentStatus: LessonStatus = LessonStatus.LOCKED;

        if (index === 0 || isPreviousCompleted) {
            currentStatus = isCompleted ? LessonStatus.COMPLETED : LessonStatus.UNLOCKED;
        }

        if (!isCompleted) {
            isPreviousCompleted = false;
        }

        return {
            id: lesson.id,
            title: lesson.title,
            topic: lesson.topic,
            order: lesson.order,
            releaseDay: lesson.releaseDay,
            status: currentStatus,
            unlockedAt: progress?.unlockedAt || null,
            completedAt: progress?.completedAt || null,
        };
    });
};

const getSingleLessonForStudent = async (id: string, studentId: string) => {
    const lesson = await prisma.lesson.findUnique({
        where: { id },
        include: { tasks: true, subject: true },
    });

    if (!lesson) {
        throw new Error("Lesson not found");
    }

    const allLessons = await prisma.lesson.findMany({
        where: { subjectId: lesson.subjectId },
        orderBy: [{ releaseDay: "asc" }, { order: "asc" }],
        include: {
            progresses: {
                where: { studentId },
            },
        },
    });

    const currentIndex = allLessons.findIndex((l) => l.id === id);

    if (currentIndex > 0) {
        const previousLesson = allLessons[currentIndex - 1];
        const prevCompleted = previousLesson.progresses[0]?.status === LessonStatus.COMPLETED;

        if (!prevCompleted) {
            throw new Error("This lesson is locked. Complete the previous lesson first.");
        }
    }

    return lesson;
};

const completeLesson = async (id: string, studentId: string) => {
    const lesson = await prisma.lesson.findUnique({
        where: { id },
    });

    if (!lesson) {
        throw new Error("Lesson not found");
    }

    return await prisma.lessonProgress.upsert({
        where: {
            studentId_lessonId: {
                studentId,
                lessonId: id,
            },
        },
        update: {
            status: LessonStatus.COMPLETED,
            completedAt: new Date(),
        },
        create: {
            studentId,
            lessonId: id,
            status: LessonStatus.COMPLETED,
            unlockedAt: new Date(),
            completedAt: new Date(),
        },
    });
};

export const lessonService = {
    createLesson,
    getAllLessons,
    getSingleLesson,
    updateLesson,
    deleteLesson,
    getLessonsForStudent,
    getSingleLessonForStudent,
    completeLesson,
};
