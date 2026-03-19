import {
  generateGeminiResponse,
  generateMistralChatTitle,
} from "../services/ai.service.js";
import chatModel from "../models/chats.model.js";
import messageModel from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  const { message, chat: chatId } = req.body;

  //declare title and chat variables to be used later
  let title = null,
    chat = null;
  //if chatId is not provided, create a new chat and generate a title for it using the first message
  if (!chatId) {
    title = await generateMistralChatTitle(message);

    chat = await chatModel.create({
      title,
      user: req.user.id,
      role: "user",
    });
  }

  //user message should be created with the chatId if it exists, otherwise use the newly created chat's id
  const userMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: message,
    role: "user",
  });

  //fetch all messages for the chat, create a new message document for the user's message, generate a response from the AI, and create a new message document for the AI's response
  const messages = await messageModel.find({ chat: chatId || chat._id });

  //generate a response from the AI using the provided message and the chat history, and create a new message document for the AI's response
  const aiResponse = await generateGeminiResponse(messages);

  //AI message should also be created with the chatId if it exists, otherwise use the newly created chat's id
  const aiMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: aiResponse,
    role: "ai",
  });


  //if a new chat was created, return the chat and the AI's response, otherwise just return the AI's response
  res.status(201).json({
    message: "Message sent successfully",
    chat,
    AIMessage: aiMessage,
  });
};


//fetch all chats for the authenticated user, and fetch messages for a specific chat, and delete a specific chat along with its messages
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


//fetch messages for a specific chat
export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  console.log(chatId);
  const messages = await messageModel.findOne({
    chat: chatId,
  });

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


//delete a specific chat along with its messages
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

  await messageModel.deleteMany({
    chat: chatId,
  });

  res.status(200).json({
    message: "Chat deleted successfully",
    success: true,
  });
};
