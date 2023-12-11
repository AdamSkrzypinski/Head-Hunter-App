import * as jwt from "jsonwebtoken";
import {config} from "../config/config";

export interface TokenInterface {
    id: string,
    role: string,
    iat: number,
    exp: number,
}

export const authUtils = (cookie: string) => {
    if(!cookie) {
        return {
            status: 'not logged in'
        }
    }
    const token = cookie.slice(cookie.indexOf('jwt') + 4)

    const decoded = jwt.verify(token, config.jwtSecret) as TokenInterface

    console.log(decoded)

    console.log(token)

    return {
        status: decoded.role
    }
}