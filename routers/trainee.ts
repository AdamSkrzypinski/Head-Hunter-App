import { Router } from "express";

export const traineeRouter = Router();

traineeRouter
.get('/', async (req,res) => {
    res.json({message: "Cześć Kursancie zaloguj się"})
})