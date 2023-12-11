import {v4 as uuid} from 'uuid';
import {pool} from "../utils/db";
import {UserEntity} from "../types/user";
import {FieldPacket} from "mysql2";
import {createHash} from "../utils/hash";
import * as jwt from "jsonwebtoken";
import {config} from "../config/config";


type UserRecordResults = [UserRecord[], FieldPacket[]]

export class UserRecord implements UserEntity {
    public id?: string;
    public email: string;
    public pwdHash: string;
    public accountType: string;
    public createAccountLink: string;

    constructor(obj: UserRecord) {
        this.id = obj.id;
        this.email = obj.email;
        this.pwdHash = createHash(obj.pwdHash);
        this.accountType = obj.accountType;
        this.createAccountLink = obj.createAccountLink;
    }

    async register() {
        if (!this.id) {
            this.id = uuid();
        }

        try {
            await pool.execute('INSERT INTO `accounts` (id, email, pwdHash, accountType) VALUES (:id, :email, :pwdHash, :accountType)', {
                id: this.id,
                email: this.email,
                pwdHash: this.pwdHash,
                accountType: this.accountType
            })

            return this.id

        } catch (err) {
            console.log(err)
        }
    }

    static async login(email: string, pwdHash: string)  {
        try {
            const [results] = (await pool.execute('SELECT * FROM `accounts` WHERE `email` = :email AND `pwdHash` = :pwdHash', {
                email: email,
                pwdHash: createHash(pwdHash)
            })) as UserRecordResults;

            if(results.length === 0){
                return null
            }

            const user = new UserRecord(results[0])
            const maxAge = 30 * 24 * 60 * 60;
            const token = jwt.sign(
                {id: user.id, role: user.accountType},
                config.jwtSecret,
                {
                    expiresIn: maxAge,
                }
            );

            await pool.execute('UPDATE `accounts` SET `jwtCookie` = :jwtCookie WHERE `id` = :id', {
                id: user.id,
                jwtCookie: token
            })

            return {token, user, maxAge}


        } catch (err) {
            console.log(err)
        }
    }

    static async findOne(id: string): Promise<UserRecord> | null {
        try {
            const [results] = (await pool.execute('SELECT * FROM `accounts` WHERE `id` = :id', {
                id: id,
            })) as UserRecordResults;
            return results.length === 0 ? null : new UserRecord(results[0]);

        } catch (err) {
            console.log(err)
        }
    }

   async logout () {
       const res = await pool.execute('UPDATE `accounts` SET `jwtCookie` = null WHERE `id` = :id', {
           id: this.id,
       })
    return {
           isSuccess: true
    }
    }
}
