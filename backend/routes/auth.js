import { Router } from "express";
import { loginValidator, resetPasswordValidator, signupValidator, validate } from "../middlewares/validators.js";
import authContoller from "../controllers/authenticationController.js";
import { upload } from "../utils/constants.js";

const authRoutes = Router();

authRoutes.post('/register', upload.single('image'), validate(signupValidator), authContoller.register)
authRoutes.post('/login', validate(loginValidator), authContoller.login)
authRoutes.get('/logout', authContoller.logout)
authRoutes.get('/activate/:crypto/:otp', authContoller.activateAccount)
authRoutes.post('/forgot-password', authContoller.forgotPassword)
authRoutes.post('/reset-password/:crypto', validate(resetPasswordValidator), authContoller.resetPassword)
authRoutes.get('/verify', authContoller.verify)
authRoutes.put('/update-profile', upload.single('image'), authContoller.updateProfilePics)

export default authRoutes;