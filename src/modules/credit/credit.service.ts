import { TransactionReason, TransactionType } from "@prisma/client";
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const absentLeave = async ({ userId, lessonId }: TAbsentLeave) => {
    const credit = await prisma.credit.findUnique({ where: { userId } });

    if (!credit) throw new Error("Credit not found");

    const available = credit.totalCredit - credit.usedCredit;
    if (available < 10) {
        throw new Error("Insufficient credit for leave");
    }

    return await prisma.$transaction(async (tx) => {
        const updated = await tx.credit.update({
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

        return updated;
    });
};

const getCreditHistory = async (userId: string) => {
    const credit = await prisma.credit.findUnique({ where: { userId } });
    if (!credit) throw new Error("Credit not found");

    return await prisma.creditTransaction.findMany({
        where: { creditId: credit.id },
        orderBy: { createdAt: "desc" },
    });
};

const addCreditManually = async ({ userId, amount }: TAddCreditManually) => {
    const credit = await prisma.credit.findUnique({ where: { userId } });
    if (!credit) throw new Error("Credit not found");

    return await prisma.$transaction(async (tx) => {
        const updated = await tx.credit.update({
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

        return updated;
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
