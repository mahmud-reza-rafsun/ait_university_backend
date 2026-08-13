export interface TCreateLesson {
    title: string;
    topic: string;
    content: string;
    summary?: string;
    examples: string;
    order: number;
    releaseDay: number;
    subjectId: string;
}

export interface TUpdateLesson {
    title?: string;
    topic?: string;
    content?: string;
    summary?: string;
    examples?: string;
    order?: number;
    releaseDay?: number;
}
