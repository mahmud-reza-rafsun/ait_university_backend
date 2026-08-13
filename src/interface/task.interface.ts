import { TaskType } from "@prisma/client";

export interface TCreateTask {
    title: string;
    topic: string;
    question: string;
    description?: string;
    type?: TaskType;
    points?: number;
    lessonId: string;
}

export interface TUpdateTask {
    title?: string;
    description?: string;
    type?: TaskType;
    points?: number;
}

export interface TSubmitTask {
    submissionUrl: string;
    notes?: string;
}
