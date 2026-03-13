import userModel from "../models/user.model.js";

import { sendEmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";

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

    if (isUserExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await userModel.create({
      userName,
      email,
      password,
    });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      },
    );

    const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${token}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Verify Your Email - Perplexity",
        html: `<h1>Verify Your Email</h1><p>Click the link below to verify your email address and complete your registration:</p><a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a><p>Or copy this link: ${verificationLink}</p><p>This link will expire in 24 hours.</p><p>Best regards,<br/>The Perplexity Team</p>`,
        text: `Verify Your Email\n\nClick the link below to verify your email address:\n${verificationLink}\n\nThis link will expire in 24 hours.\n\nBest regards,\nThe Perplexity Team`,
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError.message);
      return res.status(500).json({
        success: false,
        message: "User created but email failed to send. Check environment variables.",
        error: emailError.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please check your email to verify.",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error during registration",
      error: error.message,
    });
  }
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

  const user = await userModel.findOne(
    { $or: [{ _id: decoded.id }, { email: decoded.email }] },
  );

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

export default { registerController, verifyEmailController };
