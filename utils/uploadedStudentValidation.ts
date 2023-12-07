import {StudentRecord} from "../records/student.record";
import {pool} from "./db";
import {FieldPacket} from "mysql2/index";
type StudentRecordResults = [StudentRecord[], FieldPacket[]]
export interface ValidationRecord  {
    message: string,
    status: string
}


export const uploadedStudentValidation = async (student: StudentRecord, index: number) => {
    if (!student.email || !student.accountType || !student.courseCompletion || !student.courseEngagment || !student.projectDegree || !student.teamProjectDegree || !student.bonusProjectUrls) {
        return {
            message: `Pozycja ${index + 1} nie przeszła walidacji, brak wszystkich danych.`,
            status: 'error'
        }
    }

    const {email, accountType, courseCompletion, courseEngagment, projectDegree, teamProjectDegree, bonusProjectUrls} = student

    const emailCheck = await pool.execute('SELECT * FROM accounts WHERE email = :email', {
        email
    }) as StudentRecordResults


    if (emailCheck[0].length !== 0) {
        return {
            message: `Pozycja ${index + 1} nie przeszła walidacji, podany adres email jest juz w systemie.`,
            status: 'error'
        }
    }



    return {message: `Pozycja ${index + 1} (${email}) przeszła walidację.`,
        status: 'ok'}
}