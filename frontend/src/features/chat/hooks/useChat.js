import { initializeSocketConnection } from "../service/chat.socket";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
} from "../service/chat.api";
import { useDispatch } from "react-redux";
import {
  setChats,
  setCurrentChatId,
  setError,
  setLoading,
  createNewChat,
  addNewMessage,
} from "../chat.slice";

export const useChat = () => {
  const dispatch = useDispatch();

  const handleSendMessage = async ({ message, chatId }) => {
    try {
      dispatch(setLoading(true));

      const response = await sendMessage({ message, chatId });
      const { chat, AIMessage } = response;

      dispatch(
        createNewChat({
          chatId: chat._id,
          title: chat.title,
        }),
      );

      dispatch(setCurrentChatId(chat._id));

      dispatch(
        addNewMessage({
          chatId: chat._id,
          content: message,
          role: "user",
        }),
      );

      dispatch(
        addNewMessage({
          chatId: chat._id,
          content: AIMessage.content,
          role: AIMessage.role,
        }),
      );
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    initializeSocketConnection,
    handleSendMessage,
  };
};
