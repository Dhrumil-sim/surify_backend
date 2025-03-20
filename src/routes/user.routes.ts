import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../modules/user/user.controllers.js";
import { upload } from "../middlewares/fileUpload/multer.middleware.js";
import { verifyJWT } from "../middlewares/authHandler/auth.middleware.js";
import { validateRequest } from "../middlewares/validateRequest/validateRequest.js";
import { registerUserSchema } from "../modules/user/utils/auth.validator.js";
const router = Router();


router.post("/register",upload.single("profile_pic"),validateRequest(registerUserSchema),registerUser);

router.post("/login",loginUser);

router.route("/logout").post(verifyJWT,logoutUser);


export default router;