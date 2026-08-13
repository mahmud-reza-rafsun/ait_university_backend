import { AttendanceStatus, TransactionReason, TransactionType } from "@prisma/client";
import { prisma } from "../../database/prisma";
import { TAbsentLeave, TAddCreditManually } from "../../interface/credit.interface";

const autoCreateCredit = async (userId: string) => {
    const existing = await prisma.credit.findUnique({ where: { userId } });
    if (existing) return existing;

    return await prisma.credit.create({
        data: {
            userId,
            totalCredit: 100,
            usedCredit: 0,
            transactions: {
                create: {
                    amount: 100,
                    type: TransactionType.CREDIT,
                    reason: TransactionReason.BONUS,
                },
            },
        },
    });
};

const getMyCredit = async (userId: string) => {
    return await prisma.credit.findUnique({
        where: { userId },
        include: {
            transactions: {
                orderBy: { createdAt: "desc" },
                take: 10,
            },
        },
    });
};

const getCreditPackages = async () => {
    return await prisma.creditPackage.findMany({
        where: { isActive: true },
        orderBy: { creditAmount: "asc" },
    });
};

const absentLeave = async ({ userId, lessonId }: TAbsentLeave) => {
    const credit = await prisma.credit.findUnique({ where: { userId } });

    if (!credit) {
        throw new Error("Credit account not found");
    }

    const available = credit.totalCredit - credit.usedCredit;
    if (available < 10) {
        throw new Error("Insufficient credit for applying leave");
    }

    return await prisma.$transaction(async (tx) => {
        const updatedCredit = await tx.credit.update({
            where: { userId },
            data: { usedCredit: { increment: 10 } },
        });

        await tx.creditTransaction.create({
            data: {
                creditId: credit.id,
                amount: 10,
                type: TransactionType.DEBIT,
                reason: TransactionReason.ABSENT_LEAVE,
            },
        });

        await tx.attendance.upsert({
            where: {
                studentId_lessonId: {
                    studentId: userId,
                    lessonId,
                },
            },
            update: {
                status: AttendanceStatus.LEAVE,
            },
            create: {
                studentId: userId,
                lessonId,
                status: AttendanceStatus.LEAVE,
            },
        });

        return updatedCredit;
    });
};

const getCreditHistory = async (userId: string) => {
    const credit = await prisma.credit.findUnique({ where: { userId } });
    if (!credit) {
        throw new Error("Credit account not found");
    }

    return await prisma.creditTransaction.findMany({
        where: { creditId: credit.id },
        orderBy: { createdAt: "desc" },
    });
};

const addCreditManually = async ({ userId, amount }: TAddCreditManually) => {
    const credit = await prisma.credit.findUnique({ where: { userId } });
    if (!credit) {
        throw new Error("Credit account not found");
    }

    return await prisma.$transaction(async (tx) => {
        const updatedCredit = await tx.credit.update({
            where: { userId },
            data: { totalCredit: { increment: amount } },
        });

        await tx.creditTransaction.create({
            data: {
                creditId: credit.id,
                amount,
                type: TransactionType.CREDIT,
                reason: TransactionReason.BONUS,
            },
        });

        return updatedCredit;
    });
};

export const creditService = {
    autoCreateCredit,
    getMyCredit,
    getCreditPackages,
    absentLeave,
    getCreditHistory,
    addCreditManually,
};
