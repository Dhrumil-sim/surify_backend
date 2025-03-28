import { Router } from 'express';
import AuthController from '../modules/user/user.controller.js';
import { validateRequest } from '../middlewares/validateRequest/validateRequest.js';
import {
  registerUserSchema,
  loginUserSchema,
} from '../modules/user/utils/auth.validator.js';
import { upload } from '../middlewares/fileUpload/multer.middleware.js';
const router = Router();

router.post(
  '/register',
  upload.single('profilePicture'),
  validateRequest(registerUserSchema),
  AuthController.registerUser
);
router.post(
  '/login',
  upload.none(),
  validateRequest(loginUserSchema),
  AuthController.loginUser
);
router.post('/logout', AuthController.logoutUser);
router.post('/refresh-token', AuthController.refreshAccessToken);

export default router;
