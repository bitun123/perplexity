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
  const messages = await messageModel.find({ chat: chatId || chat._id })

  //generate a response from the AI using the provided message and the chat history, and create a new message document for the AI's response
  const aiResponse = await generateGeminiResponse(messages);


  //AI message should also be created with the chatId if it exists, otherwise use the newly created chat's id
  const aiMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: aiResponse,
    role: "ai",
  });

  res.status(201).json({
    message: "Message sent successfully",
    AIMessage: aiMessage,
  });
};
