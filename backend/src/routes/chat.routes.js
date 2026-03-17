import { Router } from "express";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
} from "../controllers/chat.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
const chatRouter = Router();

chatRouter.post("/message", authUser, sendMessage);
chatRouter.get("/getChats", authUser, getChats);
chatRouter.get("/getMessages/:chatId", authUser, getMessages);
chatRouter.delete("/delete/:chatId", authUser, deleteChat);

export default chatRouter;
