import {createHmac} from "crypto";
import {config} from "../config/config";

const salt = config.pwdSalt

export const  createHash  = (pwd: string) => {
    const hash = createHmac('sha512', salt)
        .update(pwd)
        .digest('hex')
    return hash
}
