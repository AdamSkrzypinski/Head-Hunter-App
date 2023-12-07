import {Router} from "express";
import * as multer from "multer";
import {readFile, rename} from "fs/promises";
import {join} from "path";
import {StudentRecord} from "../records/student.record";
import {UpdateStudentReq} from "../types/student";
import {uploadedStudentValidation, ValidationRecord} from "../utils/uploadedStudentValidation";

export const studentRouter = Router();
const upload = multer({
    dest: "./data/uploads/",

}).single('studentsList')


studentRouter
    .get('/', async (req, res) => {
        const allStudents = await StudentRecord.getAllStudents()
        if (allStudents.isSuccess === false) {
            return res.status(400).json({
                message: `Przepraszamy, coś poszło nie tak, spróbuj ponownie później.`
            })
        }

        return res.status(200).json({
            studentsList: allStudents.studentsList
        })
    })

    .get('/:id', async (req, res) => {
        const {student} = await StudentRecord.getOne(req.params.id)
        if (!student) {
            return res.status(404).json({
                message: `Nie znaleziono użytkownika o podanym ID.`
            })
        }
        return res.status(200).json({
            student: student
        })

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

                const validation = studentsList.map(async (student: StudentRecord, index: number) => {
                    const newStudent = new StudentRecord(student)
                    const validationResult = await uploadedStudentValidation(newStudent, index)


                    if (validationResult.status === 'ok') {
                        await newStudent.create()
                    }

                    return validationResult

                })


                res.status(201)
                    .send({
                        message: `Pomyślnie przesłano plik ${originalname}.`,
                        validationInfo: await Promise.all(await validation)
                    })

            } else {
                res.status(400)
                res.send({error: "To nie jest prawidłowy plik .json!"})
            }

        })

    })

    .patch('/update', async (req, res) => {
        const updateReq = req.body as UpdateStudentReq
        const {
            id,
            email,
            tel,
            firstName,
            lastName,
            githubUsername,
            projectUrls,
            portfolioUrls,
            bio,
            expectedTypeWork,
            targetWorkCity,
            expectedContractType,
            expectedSalary,
            canTakeApprenticeship,
            monthsOfCommercialExp,
            education,
            workExperience,
            courses,
            avatarUrl
        } = updateReq;
        if (!id || !email || !tel || !firstName || !lastName || !githubUsername || !projectUrls || !portfolioUrls || !expectedContractType || !expectedSalary || !canTakeApprenticeship || !monthsOfCommercialExp || !education || !bio || !expectedTypeWork || !targetWorkCity || !workExperience || !courses || !avatarUrl) {
            return res.status(400).json({
                message: "Nieprawidłowe zapytanie!"
            })
        }
        const findRes = await StudentRecord.getOne(id)
        const studentToUpdate = new StudentRecord(findRes.student)
        if (!studentToUpdate) {
            return res.status(404).json({
                message: "Nie znaleziono kursanta o podanym ID!"
            })
        } else {
            const updateRes = await studentToUpdate.update(updateReq)
            if (updateRes.isSuccess === false) {
                return res.status(400).json({
                    message: `Przepraszamy, coś poszło nie tak, spróbuj ponownie później..`
                })
            }
            return res.status(201).json({
                message: `Użytkownik o ID ${id} pomyślnie zaktualizowany.`
            })
        }

    })