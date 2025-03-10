import connectDB from "./db/index.js";
import express from "express";
import { app } from './app.js';

const PORT = process.env.PORT || 3000;
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

