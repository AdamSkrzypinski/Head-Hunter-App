import {Router} from "express";
import * as multer from "multer";
import {readFile, rename} from "fs/promises";
import {join} from "path";
import {StudentRecord} from "../records/student.record";

export const studentRouter = Router();
const upload = multer({
    dest: "./data/uploads/",

}).single('studentsList')


studentRouter
    .get('/', async (req, res) => {
        res.json({message: "Cześć Kursancie zaloguj się"})
    })
    .post('/upload', async (req, res) => {


        upload(req, res, async err => {
            if (err instanceof multer.MulterError) {
                return res.status(400).send({message: err.message})
            }
            ;
            const {filename, originalname, destination} = req.file;

            if (originalname.slice(-4) === 'json') {
                await rename(
                    `./data/uploads/${filename}`,
                    `./data/uploads/${originalname}`,
                );

                const filePath = join(destination, originalname);
                const studentsList = JSON.parse(await readFile(filePath, 'utf8'))
                studentsList.map(async (student: StudentRecord) => {
                    const newStudent = new StudentRecord(student)
                    console.log(newStudent)
                    await newStudent.createUser()
                })
               const links = await StudentRecord.getAllLinks()

                res.status(201)
                    .send({
                        message: `Pomyślnie przesłano plik ${originalname}.`,
                        links
                    })


                res.end();
            } else {
                res.status(400)
                res.send({error: "To nie jest prawidłowy plik .json!"})
            }

        })

    })