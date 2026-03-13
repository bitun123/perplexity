import express from 'express';
import authRoutes from "../src/routes/auth.route.js";
import dotenv from "dotenv";
import cookie from 'cookie-parser'
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookie());

app.use("/api/auth", authRoutes);


export default app;
