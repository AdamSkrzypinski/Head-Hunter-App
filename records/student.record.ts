import {StudentEntity, UpdateStudentReq} from "../types/student";
import {v4 as uuid} from "uuid";
import {pool} from "../utils/db";
import {config} from "../config/config";
import {FieldPacket} from "mysql2/index";
import {createHash} from "../utils/hash";

type StudentRecordResults = [StudentRecord[], FieldPacket[]]


export class StudentRecord implements StudentEntity {
    public id?: string;
    public email: string;
    public pwdHash?: string;
    public accountType: string;
    public courseCompletion: number;
    public courseEngagment: number;
    public projectDegree: number;
    public teamProjectDegree: number;
    public bonusProjectUrls: string;

    constructor(obj: StudentRecord) {
        this.id = obj.id;
        this.email = obj.email;
        this.pwdHash = obj.pwdHash
        this.accountType = obj.accountType
        this.courseCompletion = obj.courseCompletion
        this.courseEngagment = obj.courseEngagment
        this.projectDegree = obj.projectDegree
        this.teamProjectDegree = obj.teamProjectDegree
        this.bonusProjectUrls = obj.bonusProjectUrls
    }

    async create() {
        if (!this.id) {
            this.id = uuid();
        }


        try {
            await pool.execute('INSERT INTO `accounts` (id, email, createAccountLink, accountType) VALUES (:id, :email, :createAccountLink, :accountType)', {
                id: this.id,
                email: this.email,
                createAccountLink: `${config.domain}/hh/student/register/${this.id}`,
                accountType: 'student'
            })


        } catch (err) {
            console.log(err)
        }
        try {
            await pool.execute('INSERT INTO `students` (id, email,courseCompletion, courseEngagment, projectDegree, teamProjectDegree, bonusProjectUrls) VALUES (:id, :email, :courseCompletion, :courseEngagment, :projectDegree, :teamProjectDegree, :bonusProjectUrls)', {
                id: this.id,
                email: this.email,
                courseCompletion: this.courseCompletion,
                courseEngagment: this.courseEngagment,
                projectDegree: this.projectDegree,
                teamProjectDegree: this.teamProjectDegree,
                bonusProjectUrls: this.bonusProjectUrls
            })

        } catch (err) {
            console.log(err)
        }

    }

    static async getAllLinks() {

        try {
            const links = await pool.execute('SELECT createAccountLink, email FROM accounts WHERE createAccountLink IS NOT NULL')
            return links[0]
        } catch (err) {
            console.log(err)
        }

    }

    static async getAllStudents() {
        try {
            const allStudents = await pool.execute('SELECT * from students WHERE status= :status', {
                status: 'zarejestrowany'
            }) as StudentRecordResults
            return {
                studentsList: allStudents[0],
                isSuccess: true
            }
        } catch (err) {
            console.log(err)
            return {
                isSuccess: false
            }
        }
    }

    static async getOne(id: string) {
        try {
            const studentToUpdate = await pool.execute('SELECT * FROM students WHERE id = :id', {
                id: id
            }) as StudentRecordResults
            return {
                isSuccess: true,
                student: studentToUpdate[0][0]
            }
        } catch (err) {
            console.log(err)
            return {isSuccess: false}
        }
    }

    async update(req: UpdateStudentReq) {
        console.log(req)
        try {
            await pool.execute('UPDATE `students` SET `email`= :email, `tel`= :tel, `firstName` = :firstName, `lastName`= :lastName, `githubUsername`= :githubUsername, `portfolioUrls`= :portfolioUrls, `projectUrls`=:portfolioUrls, `bio`= :bio, `expectedTypeWork`= :expectedTypeWork, `targetWorkCity`= :targetWorkCity, `expectedContractType`= :expectedContractType, `expectedSalary`= :expectedSalary, `canTakeApprenticeship`= :canTakeApprenticeship, `monthsOfCommercialExp`= :monthsOfCommercialExp, `education`= :education, `workExperience`= :workExperience, `courses` = :courses, `avatarUrl`= :avatarUrl, `status`= :status WHERE `id` = :id', {
                id: req.id,
                email: req.email,
                tel: req.tel,
                firstName: req.firstName,
                lastName: req.lastName,
                githubUsername: req.githubUsername,
                portfolioUrls: req.portfolioUrls,
                projectUrls: req.projectUrls,
                bio: req.bio,
                expectedTypeWork: req.expectedTypeWork,
                targetWorkCity: req.targetWorkCity,
                expectedContractType: req.expectedContractType,
                expectedSalary: req.expectedSalary,
                canTakeApprenticeship: req.canTakeApprenticeship,
                monthsOfCommercialExp: req.monthsOfCommercialExp,
                education: req.education,
                workExperience: req.workExperience,
                courses: req.courses,
                avatarUrl: req.avatarUrl,
                status: 'zarejestrowany'
            })

            if (req.pwdHash) {
                await pool.execute('UPDATE `accounts` SET `createAccountLink` = :status, pwdHash= :pwdHash WHERE `id` = :id', {
                    id: req.id,
                    pwdHash: createHash(req.pwdHash),
                    status: 'zarejestrowany'
                })
            }

            await pool.execute('UPDATE `accounts` SET `createAccountLink` = :status WHERE `id` = :id', {
                id: req.id,
                status: 'zarejestrowany'
            })

            return {isSuccess: true}
        } catch (err) {
            console.log(err)
            return {isSuccess: false}

        }
    }
}