import {body, validationResult} from 'express-validator';


const registerValidationRules = [
    body('username').matches(/^[a-zA-Z0-9]+$/).withMessage('Username must be alphanumeric').isLength({min: 3}).withMessage('Username must be at least 3 characters long'),
    body("email").isEmail().withMessage('Invalid email address'),
    body("password").isLength({min: 6}).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    (req,res,next)=>{
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(400).json({errors: error.array()})
        }
        next();

    }
]


export { registerValidationRules };
