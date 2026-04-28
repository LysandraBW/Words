import 'dotenv/config';
import cors from "cors";
import router from './routes.js';
import cookieParser from "cookie-parser";
import express, { json, type Application } from 'express';

const app: Application = express();
app.use(cookieParser());
app.use(json());
app.use(cors({
	origin: "http://127.0.0.1:3000",
	credentials: true
}));
app.use((req, res, next) => {
    console.log(req.url);
    next();
});
app.use(router);

export default app;