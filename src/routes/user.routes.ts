import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/fileUpload/multer.middleware.js";
const router = Router();


router.post("/register",upload.single("profile_pic"),registerUser);

export default router;