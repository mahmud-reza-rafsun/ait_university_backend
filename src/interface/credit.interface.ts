import { TransactionReason, TransactionType } from "@prisma/client";

export interface TCreditPurchase {
    packageId: string;
    paymentMethod: "STRIPE" | "BKASH";
}

export interface TAbsentLeave {
    lessonId: string;
    userId: string;
}

export type TAddCreditManually = {
    userId: string;
    amount: number;
};

export type TCreditTransaction = {
    creditId: string;
    amount: number;
    type: TransactionType;
    reason: TransactionReason;
};
