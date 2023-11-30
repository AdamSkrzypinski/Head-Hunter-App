import { Router } from "express";

export const hrRouter = Router();

hrRouter
.get('/', async (req,res) => {
    res.json({message: "Dzień dobry pracowniku HR. Zapraszam do zalogowania się do bazy"});
})