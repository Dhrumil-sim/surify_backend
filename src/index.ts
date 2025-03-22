import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";


dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`⚙️ Server is running at: http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed!", err);
    });
