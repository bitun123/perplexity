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

  } catch (error) {}
}

export default { registerController };
