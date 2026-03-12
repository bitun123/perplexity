import {Router} from  'express';
import {registerValidationRules} from '../middleware/expressValidator.js';
import authController from '../controllers/authControllers.js';

const authRouter = Router();



authRouter.post("/register", registerValidationRules, authController.registerController);


authRouter.get("/verify-email",authController.verifyEmailController)

export default authRouter;