import {HrEntity} from "../types/hr";
import {v4 as uuid} from "uuid";
import {pool} from "../utils/db";
import {config} from "../config/config";

export class HrRecord implements HrEntity{
    public id?: string;
    public email: string;
    public pwdHash?: string;
    public accountType: string;
    public fullName: string;
    public company: string;
    public maxReservedStudents: number;

    constructor(obj: HrRecord) {
        this.id = obj.id;
        this.email = obj.email;
        this.pwdHash = obj.pwdHash
        this.accountType = obj.accountType
        this.company = obj.company;
        this.fullName = obj.fullName;
        this.maxReservedStudents = obj.maxReservedStudents;
    }

    async create() {
        if (!this.id) {
            this.id = uuid();
        }
        try {
            await pool.execute('INSERT INTO `accounts` (id, email, createAccountLink, accountType) VALUES (:id, :email, :createAccountLink, :accountType)', {
                id: this.id,
                email: this.email,
                createAccountLink: `${config.domain}/hh/hr/register/${this.id}`,
                accountType: this.accountType
            })

            await pool.execute('INSERT INTO `hr` (id, email,fullName, company, maxReservedStudents) VALUES (:id, :email, :fullName, :company, :maxReservedStudents)', {
                id: this.id,
                email: this.email,
                fullName: this.fullName,
                company: this.company,
                maxReservedStudents: this.maxReservedStudents,
            })

            return {
                isSuccess:true,
                id: this.id
            }


        } catch (err) {
            console.log(err)
            return {
                isSuccess: false
            }
        }
    }

}