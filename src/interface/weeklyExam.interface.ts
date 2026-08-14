export interface TCreateExamQuestion {
    question: string;
}

export interface TCreateWeeklyExam {
    title: string;
    description?: string;
    weekNumber: number;
    totalMarks?: number;
    subjectId: string;
    questions: TCreateExamQuestion[];
}

export interface TSubmitExamAnswer {
    questionId: string;
    answer: string;
}

export interface TSubmitExam {
    weeklyExamId: string;
    answers: TSubmitExamAnswer[];
}

export interface TEvaluateSubmission {
    obtainedMark: number;
    feedback?: string;
    grade?: string;
}
