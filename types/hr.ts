export interface HrEntity {
    id?: string;
    email: string;
    accountType: string;
    fullName: string;
    company: string;
    maxReservedStudents: number;
}
// https://nuidzruvvg.cfolks.pl/hh/hr/create
export type CreateHrReq = Omit<HrEntity, 'id'>

