import {Router} from  'express';
import {registerValidationRules} from '../middleware/expressValidator.js';
import authController from '../controllers/auth.controller.js';

const authRouter = Router();



authRouter.post("/register", registerValidationRules, authController.registerController)