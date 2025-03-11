import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import exp from "constants";
import userRouter from './routes/user.routes.js';
import { errorHandler } from "./middlewares/errorHandler/errorHandler.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

app.use(express.json({limit:'16kb'}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(errorHandler);




app.use("/api/user",userRouter);

app.get('/', (req, res) => {
    res.send("Hello ");
});


export {app};