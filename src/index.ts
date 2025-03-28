import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
import { Request, Response } from "express";
import { console } from "inspector";
dotenv.config();

const PORT = process.env["PORT"] || 3000;
console.log("hello");

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`⚙️ Server is running at: http://localhost:${PORT}`);
      console.log("Hello");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed!", err);
  });
