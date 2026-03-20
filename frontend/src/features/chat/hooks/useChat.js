import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessageStream, getChats, getMessages } from "../service/chat.api";
import { useDispatch, useSelector } from "react-redux";
import {
  setChats,
  setCurrentChatId,
  setError,
  setLoading,
  createNewChat,
  addNewMessage,
  addMessages,
  addStreamingMessage,
  appendToken,
  finalizeMessage,
} from "../chat.slice";

export const useChat = () => {
  const dispatch = useDispatch();

  // ─── Send Message (Streaming) ───────────────────────────────────────────────
 const handleSendMessage = async ({ message, chatId }) => {
  try {
    dispatch(setLoading(true));

    if (chatId) {
      dispatch(addNewMessage({ chatId, content: message, role: "user" }));
    }

    let resolvedChatId = chatId;
    const streamingMessageId = crypto.randomUUID();

    await sendMessageStream({
      message,
      chatId,

      onChat: (chat) => {
        resolvedChatId = chat._id;
        dispatch(createNewChat({ chatId: chat._id, title: chat.title }));

        if (!chatId) {
          dispatch(addNewMessage({ chatId: chat._id, content: message, role: "user" }));
        }

        dispatch(addStreamingMessage({ chatId: chat._id, id: streamingMessageId }));
        dispatch(setCurrentChatId(chat._id));
      },

      onToken: (token) => {
        dispatch(appendToken({ chatId: resolvedChatId, id: streamingMessageId, token }));
      },

      onDone: (AIMessage) => {
        dispatch(finalizeMessage({ chatId: resolvedChatId, id: streamingMessageId, AIMessage }));
        dispatch(setLoading(false)); // ✅ stream khatam hone pe
      },
    });

  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false)); // ✅ sirf error pe
  }
};

  
  const handleGetChats = async () => {
    try {
      dispatch(setLoading(true));

      const response = await getChats();
      const { chats } = response;

      const formatted = chats.reduce((acc, chat) => {
        acc[chat._id] = {
          id: chat._id,
          title: chat.title,
          messages: [],
          lastUpdated: chat.updatedAt,
        };
        return acc;
      }, {});

      dispatch(setChats(formatted));

      if (chats.length > 0) {
        dispatch(setCurrentChatId(chats[0]._id));
      }
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };


  const handleOpenChat = async (chatId) => {
    try {
      dispatch(setLoading(true));
      dispatch(setCurrentChatId(chatId));

      const data = await getMessages(chatId);
      const { messages } = data;
      const messagesArray = Array.isArray(messages) ? messages : [messages];

      const formattedMessages = messagesArray.map((msg) => ({
        id: crypto.randomUUID(),
        content: msg.content,
        role: msg.role,
      }));

      dispatch(addMessages({ chatId, messages: formattedMessages }));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
  };
};