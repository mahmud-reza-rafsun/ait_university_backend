export interface TStudentProgress {
    totalLessons: number;
    completedLessons: number;
    totalTasks: number;
    submittedTasks: number;
    reviewedTasks: number;
    progressPercentage: number;
}

export interface TAdminAnalytics {
    totalStudents: number;
    totalProfessors: number;
    totalCourses: number;
    totalLessons: number;
    totalSubmissions: number;
    pendingSubmissions: number;
}
