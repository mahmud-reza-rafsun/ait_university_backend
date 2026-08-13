import { EnrollmentStatus } from "@prisma/client";
import { prisma } from "../../database/prisma";
import { TCreateEnrollment } from "../../interface/enrollment.interface";

const createEnrollment = async (studentId: string, payload: TCreateEnrollment) => {
    const subject = await prisma.subject.findUnique({
        where: { id: payload.subjectId },
    });

    if (!subject) {
        throw new Error("Subject not found");
    }

    if (!subject.isPublished) {
        throw new Error("Cannot enroll in an unpublished subject");
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
            studentId_subjectId: {
                studentId,
                subjectId: payload.subjectId,
            },
        },
    });

    if (existingEnrollment) {
        throw new Error("You are already enrolled in this subject");
    }

    const enrolledAt = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(enrolledAt.getDate() + subject.durationDays);

    return await prisma.$transaction(async (tx) => {
        const enrollment = await tx.enrollment.create({
            data: {
                studentId,
                subjectId: payload.subjectId,
                status: EnrollmentStatus.ACTIVE,
                enrolledAt,
                expiresAt,
            },
            include: {
                subject: {
                    select: { title: true, price: true, durationDays: true },
                },
            },
        });

        await tx.payment.create({
            data: {
                userId: studentId,
                subjectId: payload.subjectId,
                amount: subject.price,
                paymentMethod: "BKASH",
                paymentType: "SUBJECT_ADMISSION",
                paymentStatus: "SUCCESS",
                trxId: `TRX-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
            },
        });

        return enrollment;
    });
};

const getMyEnrollments = async (studentId: string) => {
    return await prisma.enrollment.findMany({
        where: { studentId },
        include: {
            subject: {
                include: {
                    professor: {
                        select: { name: true, email: true },
                    },
                },
            },
        },
        orderBy: { enrolledAt: "desc" },
    });
};

const getSingleEnrollment = async (id: string) => {
    const enrollment = await prisma.enrollment.findUnique({
        where: { id },
        include: {
            subject: {
                include: {
                    lessons: {
                        orderBy: { order: "asc" },
                    },
                },
            },
            student: {
                select: { id: true, studentId: true, name: true, email: true },
            },
        },
    });

    if (!enrollment) {
        throw new Error("Enrollment not found");
    }

    return enrollment;
};

export const enrollmentService = {
    createEnrollment,
    getMyEnrollments,
    getSingleEnrollment,
};
