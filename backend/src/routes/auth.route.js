import {Router} from  'express';
import { registerValidationRules } from '../middleware/expressValidator.js';
import authController from '../controllers/authControllers.js';
import { authUser } from "../middleware/auth.middleware.js";
const authRouter = Router();



authRouter.post("/register", registerValidationRules, authController.registerController);


authRouter.get("/verify-email",authController.verifyEmailController);


authRouter.get("/recent-email", authController.recentEmailController);


authRouter.post("/login", authController.loginController);

authRouter.get("/get-me", authUser, authController.getMeController);

authRouter.post("/logout", authController.logoutController);

export default authRouter;