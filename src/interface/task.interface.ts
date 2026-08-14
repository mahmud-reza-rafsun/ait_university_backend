export interface TCreateTask {
    question: string;
    description?: string;
    points?: number;
    lessonId: string;
}

export interface TUpdateTask {
    question?: string;
    description?: string;
    points?: number;
}

export interface TSubmitTask {
    answer?: string;
    fileUrl?: string;
}
