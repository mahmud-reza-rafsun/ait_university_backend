import { prisma } from "../../database/prisma";
import { TCreateSubject, TUpdateSubject } from "../../interface/subject.interface";

const createSubject = async (professorId: string, payload: TCreateSubject) => {
    return await prisma.subject.create({
        data: {
            ...payload,
            professorId,
        },
    });
};

const getAllSubjects = async () => {
    return await prisma.subject.findMany({
        where: { isPublished: true },
        include: {
            professor: {
                select: { id: true, name: true, email: true, photo: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};

const getSingleSubject = async (id: string) => {
    const subject = await prisma.subject.findUnique({
        where: { id },
        include: {
            professor: {
                select: { id: true, name: true, email: true, photo: true },
            },
            lessons: {
                select: { id: true, title: true, topic: true, order: true, releaseDay: true },
                orderBy: { order: "asc" },
            },
        },
    });

    if (!subject) throw new Error("Subject not found");
    return subject;
};

const updateSubject = async (id: string, payload: TUpdateSubject) => {
    return await prisma.subject.update({
        where: { id },
        data: payload,
    });
};

const deleteSubject = async (id: string) => {
    return await prisma.subject.delete({
        where: { id },
    });
};

export const subjectService = {
    createSubject,
    getAllSubjects,
    getSingleSubject,
    updateSubject,
    deleteSubject,
};
