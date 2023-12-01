import {StudentEntity} from "../types/student";
import {v4 as uuid} from "uuid";
import {pool} from "../utils/db";
import {config} from "../config/config";

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

    async createUser() {
        if (!this.id) {
            this.id = uuid();
        }


        try {
            await pool.execute('INSERT INTO `accounts` (id, email, createAccountLink) VALUES (:id, :email, :createAccountLink)', {
                id: this.id,
                email: this.email,
                createAccountLink: `${config.domain}/hh/student/register/${this.id}`
            })

            // return `${config.domain}/hh/student/register/${this.id}`

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
}