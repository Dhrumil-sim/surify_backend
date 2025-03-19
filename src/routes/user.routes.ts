import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user/user.controllers.js";
import { upload } from "../middlewares/fileUpload/multer.middleware.js";
import { verifyJWT } from "../middlewares/authHandler/auth.middleware.js";
const router = Router();


router.post("/register",upload.single("profile_pic"),registerUser);

router.post("/login",loginUser);

router.route("/logout").post(verifyJWT,logoutUser);


export default router;