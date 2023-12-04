export interface HrEntity {
    id?: string;
    email: string;
    accountType: string;
    fullName: string;
    company: string;
    maxReservedStudents: number;
}

export type CreateHrReq = Omit<HrEntity, 'id'>

