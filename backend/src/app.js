import express from 'express';
import authRoutes from "../src/routes/auth.route.js";
import dotenv from "dotenv";
import cookie from 'cookie-parser'
dotenv.config();

import cors from 'cors';

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: [ "GET", "POST", "PUT", "DELETE" ],
}))


app.use(express.json());
app.use(cookie());

app.use("/api/auth", authRoutes);


export default app;
