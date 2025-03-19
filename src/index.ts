import connectDB from "./db/index.js";
import express from "express";
import { app } from './app.js';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 3000;

console.log(typeof process.env.ACCESS_TOKEN_EXPIRY);
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : http://localhost:${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

