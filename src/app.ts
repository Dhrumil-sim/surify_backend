import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import exp from "constants";

const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

app.use(express.json({limit:'16kb'}));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from './routes/user.routes.js';


app.use("api/user",userRouter);

app.get('/', (req, res) => {
    res.send("Hello ");
});


export {app};