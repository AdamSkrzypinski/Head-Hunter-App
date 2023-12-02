export interface StudentEntity{
    id?: string;
    accountType: string;
    courseCompletion: number;
    courseEngagment: number;
    projectDegree: number;
    teamProjectDegree: number;
    bonusProjectUrls: string;
    //complete
    tel?: number;
    firstName?: string;
    lastName?: string;
    githubUsername?: string;
    portfolioUrls?: string;
    projectUrls?: string;
    bio?: string;
    expectedTypeWork?: string;
    targetWorkCity?:string;
    expectedContractType?: string;
    expectedSalary?: string;
    canTakeApprenticeship?: string;
    monthsOfCommercialExp?: number;
    education?: string;
    workExperience?: string;
    courses?: string;
    avatarUrl?: string;
    status?: string;
}



// https://nuidzruvvg.cfolks.pl/hh/student/upload
export interface CreateStudentReq {
    email: string;
    accountType: string;
    courseCompletion: number;
    courseEngagment: number;
    projectDegree: number;
    teamProjectDegree: number;
    bonusProjectUrls: string;
}



// https://nuidzruvvg.cfolks.pl/hh/student/update !!PATCH!!!
export interface UpdateStudentReq {
    id: string;
    pwdHash?: string;
    email: string;
    tel: number;
    firstName: string;
    lastName: string;
    githubUsername: string;
    portfolioUrls: string;
    projectUrls: string;
    bio: string;
    expectedTypeWork: string;
    targetWorkCity:string;
    expectedContractType: string;
    expectedSalary: string;
    canTakeApprenticeship: string;
    monthsOfCommercialExp: number;
    education: string;
    workExperience: string;
    courses: string;
    avatarUrl: string;
}





