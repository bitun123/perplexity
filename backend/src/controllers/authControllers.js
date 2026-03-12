import userModel from "../models/user.model.js";

import { sendEmail } from "../services/mail.service.js";

async function registerController(req, res) {
  try {
    const { userName, email, password } = req.body;
    const isUserExists = await userModel.findOne({
      $or: [
        { email },
        {
          userName,
        },
      ],
    });

if(isUserExists){
    return res.status(400).json({
        success:false,
        message:"User already exists"
    })
}



const user = await userModel.create({
    userName,
    email,
    password
})

const token =  jwt.sign({id:user._id},{process.env.JWT_SECRET_KEY},{expiresIn:"1d"})





await sendEmail({
    to:email,
    subject:"Welcome to Perplexity",
    html:`<h1>Welcome to Perplexity</h1><p>Thank you for registering with us. We are excited to have you on board.</p><p>Best regards,<br/>The Perplexity Team</p>`,
    text:`Welcome to Perplexity\n\nThank you for registering with us. We are excited to have you on board.\n\nBest regards,\nThe Perplexity Team`
})

res.status(201).json({
    success:true,
    message:"User registered successfully",
    user
})

  } catch (error) {
    console.log(error);
  }
}

async function verifyEmailController(req,res){
const token = req.query.token;

if(!token){
    return res.status(400).json({
        success:false,
        message:"Token is missing"
    })
  }


let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

const user = await userModel.findById(decoded.id);


if(!user){
    return res.status(400).json({
        success:false,
        message:"Invalid token"
    })
}

user.isVerified = true;
await user.save();

res.status(200).json({
    success:true,
    message:"Email verified successfully"
})

}




export default { registerController ,verifyEmailController};
