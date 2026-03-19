import {
  generateGroqResponseStream,
  generateMistralChatTitle,
} from "../services/ai.service.js";
import chatModel from "../models/chats.model.js";
import messageModel from "../models/message.model.js";

// ─── Send Message (Streaming) ─────────────────────────────────────────────────

export const sendMessage = async (req, res) => {
  const { message, chat: chatId } = req.body;

  let chat = null;

  if (!chatId) {
    const title = await generateMistralChatTitle(message);
    chat = await chatModel.create({ title, user: req.user.id, role: "user" });
  } else {
    chat = await chatModel.findById(chatId);
  }

  const resolvedChatId = chat._id;

  await messageModel.create({
    chat: resolvedChatId,
    content: message,
    role: "user",
  });

  const messages = await messageModel.find({ chat: resolvedChatId });

  // ✅ SSE Headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // ✅ Send chat info first so frontend gets the chatId
  res.write(`data: ${JSON.stringify({ type: "chat", chat })}\n\n`);

  // ✅ Stream tokens to frontend
  const fullContent = await generateGroqResponseStream(
    messages,
    (token) => {
      res.write(`data: ${JSON.stringify({ type: "token", token })}\n\n`);
    }
  );

  // ✅ Save complete AI message to DB
  const aiMessage = await messageModel.create({
    chat: resolvedChatId,
    content: fullContent,
    role: "ai",
  });

  // ✅ Signal stream end
  res.write(`data: ${JSON.stringify({ type: "done", AIMessage: aiMessage })}\n\n`);
  res.end();
};

// ─── Get All Chats ────────────────────────────────────────────────────────────

export const getChats = async (req, res) => {
  const user = req.user.id;

  const chats = await chatModel.find({ user });

  if (!chats) {
    return res.status(404).json({
      message: "No chats found",
      success: false,
      err: "No chats found for this user",
    });
  }

  res.status(200).json({
    message: "Chats fetched successfully",
    success: true,
    chats,
  });
};

// ─── Get Messages ─────────────────────────────────────────────────────────────

export const getMessages = async (req, res) => {
  const { chatId } = req.params;

  const messages = await messageModel.find({ chat: chatId });

  if (!messages) {
    return res.status(404).json({
      message: "No messages found",
      success: false,
      err: "No messages found for this chat",
    });
  }

  res.status(200).json({
    message: "Messages fetched successfully",
    success: true,
    messages,
  });
};

// ─── Delete Chat ──────────────────────────────────────────────────────────────

export const deleteChat = async (req, res) => {
  const { chatId } = req.params;

  const chat = await chatModel.findOneAndDelete({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(404).json({
      message: "Chat not found",
      success: false,
      err: "No chat found with this id for this user",
    });
  }

  await messageModel.deleteMany({ chat: chatId });

  res.status(200).json({
    message: "Chat deleted successfully",
    success: true,
  });
};