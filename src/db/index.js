/**
 * @module DatabaseConnection
 * @description Handles MongoDB connection using Mongoose.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";
dotenv.config();
/**
 * Connects to the MongoDB database.
 *
 * @async
 * @function connectDB
 * @returns {Promise<Connection | void>} Resolves with the Mongoose connection instance or exits on failure.
 * @throws Will log an error and terminate the process if the connection fails.
 */
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        const connectionInstance = yield mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`✅ MongoDB connected! Host: ${connectionInstance.connection.host}`);
        return connectionInstance.connection;
    }
    catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with failure code
    }
});
export default connectDB;
