import {Router} from "express";
import {HrRecord} from "../records/hr.record";

export const hrRouter = Router();

hrRouter


    .post('/create', async (req, res) => {
        if (!req.body.email || !req.body.fullName || !req.body.accountType || !req.body.company || !req.body.maxReservedStudents) {
            return res.status(401).json({
                message: "Nieprawidłowe żądanie!"
            })
        }

        const newHr = new HrRecord(req.body)
        const newHrRes = await newHr.create()

        if (!newHrRes.id) {
            return res.status(401).json({
                message: `Przepraszamy, coś poszło nie tak, spróbuj ponownie później..`
            })
        }

        return res.status(201).json({
            message: `HR o ID ${newHrRes.id} pomyślnie dodany.`
        })

    })