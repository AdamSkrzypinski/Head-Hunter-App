export interface StudentEntity{
    id?: string;
    email: string;
    pwdHash?: string;
    accountType: string;
    courseCompletion: number;
    courseEngagment: number;
    projectDegree: number;
    teamProjectDegree: number;
    bonusProjectUrls: string;
}

export interface CreateStudentReq {
    email: string;
    accountType: string;
    courseCompletion: number;
    courseEngagment: number;
    projectDegree: number;
    teamProjectDegree: number;
    bonusProjectUrls: string;
}
