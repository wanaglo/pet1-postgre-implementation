import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRouter } from './routers/auth-router';
import { errorMiddleware } from './middlewares/error-middleware';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api', authRouter);
app.use(errorMiddleware);
