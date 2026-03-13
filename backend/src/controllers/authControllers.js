import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export async function registerController(req, res) {
  const { username, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "User with this email or username already exists",
      success: false,
      err: "User already exists",
    });
  }

  const user = await userModel.create({ username, email, password });

  const emailVerificationToken = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET_KEY,
  );

  await sendEmail({
    to: email,
    subject: "Welcome to Perplexity!",
    html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Perplexity Team</p>
        `,
  });

  res.status(201).json({
    message: "User registered successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

async function verifyEmailController(req, res) {
  const token = req.query.token;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token is missing",
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  const user = await userModel.findOne({
    $or: [{ _id: decoded.id }, { email: decoded.email }],
  });

  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  user.isVerified = true;
  await user.save();

  const html = `<h1>Email Verified</h1><p>Your email has been successfully verified. You can now log in to your account.</p><p>Best regards,<br/>The Perplexity Team</p>`;

  res.send(html);
}

async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
        err: "Invalid email or password",
      });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
        err: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email before logging in",
        success: false,
        err: "Email not verified",
      });
    }

const token  = jwt.sign({
  id:user._id,
  email:user.email
},process.env.JWT_SECRET_KEY,{
  expiresIn:"7d"
})

res.cookie("token", token)

res.status(200).json({
  message:"Login successful",
  success:true,
  token
})

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while logging in",
      success: false,
      err: error.message,
    });
  }
}

export default { registerController, verifyEmailController, loginController };
