import * as express from 'express';


import {adminRouter} from './routers/admin';
import {studentRouter} from './routers/student';
import {hrRouter} from './routers/hr';
import {userRouter} from "./routers/user";
import * as cors from 'cors';


export const app = express();
app.use(cors());

const PORT = process.env.PORT


app.use(express.json());

app.use('/admin', adminRouter);
app.use('/hh/student', studentRouter);
app.use('/hh/hr', hrRouter);
app.use('/hh/user', userRouter)

app.listen(3001, function () {
    console.log(`Server listening on http://localhost:3001`);
})