import {Router} from "express";
import {UserRecord} from "../records/user.record";

export const userRouter = Router()

userRouter
    .post('/register', async (req, res) => {
        if (!req.body.email || !req.body.pwdHash || !req.body.accountType) {
            return res.status(401).json({
                message: "Nieprawidłowe żądanie!"
            })
        }
        const newUser = new UserRecord(req.body)


        const newUserId = await newUser.register()
        res.status(201).json({
            message: `Użytkownik o ID ${newUserId} dodany pomyślnie.`,
            userId: newUserId,
        })

    })
    .get('/login', async (req, res) => {
        const loginData = req.body
        if (!loginData.email || !loginData.pwdHash) {
            return res.status(401).json({
                message: "Nieprawidłowe żądanie!"
            })
        }
        const loginResponse = await UserRecord.login(loginData.email, loginData.pwdHash)
        if (!loginResponse) {
            return res.status(401).json({
                message: 'Logowanie nieudane, dane niepoprawne.'
            })
        }


        const {user, token, maxAge} = loginResponse
        if (loginResponse) {
            res.status(200)
                .cookie("jwt", token, {
                    httpOnly: true,
                    maxAge: maxAge
                })
                .json({
                    message: `Pomyślnie zalogowano użytkownika o ID ${user.id}`,
                    userId: user.id,
                    userEmail: user.email


                })
        }
    })
    .get("/logout", async (req, res) => {
        const userId = req.body.userId
        if (!userId) {
            return res.status(401).json({
                message: "Nieprawidłowe żądanie!"
            })
        }
        const user = await UserRecord.findOne(userId)
        if (!user) {
            return res.status(401).json({
                message: "Nie znaleziono użytkownika o podanym ID!"
            })
        }
        const logoutRes = await user.logout()
        res.clearCookie("jwt", {
            httpOnly: true,
        })
        return res.status(200).json({
            message: "Pomyślnie wylogowano!"
        })

    })
