export interface TCreateEnrollment {
    subjectId: string;
}

export interface TEnrollmentResponse {
    id: string;
    registrationNo: string;
    status: string;
    enrolledAt: Date;
    expiresAt: Date;
    studentId: string;
    subjectId: string;
}
