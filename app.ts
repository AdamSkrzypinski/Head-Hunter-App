import * as express from 'express';

import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });
import { adminRouter } from './routers/admin';
import { traineeRouter } from './routers/trainee';
import { hrRouter } from './routers/hr';
import {userRouter} from "./routers/user";

dotenv.config();

export const app = express();

const PORT = process.env.PORT


app.use(express.json());

app.use('/admin', adminRouter);
app.use('/trainee', traineeRouter);
app.use('/hr', hrRouter);
app.use('/hh/user', userRouter)

app.listen(3001, function () {
    console.log(`Server listening on http://localhost:${PORT}`);
})