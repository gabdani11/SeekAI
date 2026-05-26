import express from 'express';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:5173', //frontend url
    credentials: true, //allow cookies to be sent
}));

app.use('/api/auth', authRouter);
export default app;