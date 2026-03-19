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
    addMessages
  } from "../chat.slice";

  export const useChat = () => {
    const dispatch = useDispatch();

    const handleSendMessage = async ({ message, chatId }) => {
      try {
        dispatch(setLoading(true));

        const response = await sendMessage({ message, chatId });
        const { chat, AIMessage } = response;
  console.log(chat._id)
        dispatch(
          createNewChat({
            chatId: chat._id,
            title: chat.title,
          }),
        );

   if (chat.length > 0) {
  dispatch(setCurrentChatId(chat._id))
}
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

    async function handleGetChats() {
      try {
        dispatch(setLoading(true));
        const response = await getChats();
        const { chats } = response;
        dispatch(
          setChats(
            chats.reduce((acc, chat) => {
              acc[chat._id] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updatedAt,
              };
              return acc;
            }, {}),
          ),
        );
      } catch (error) {
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    }

    async function handleOpenChat(chatId) {
      try{
        dispatch(setLoading(true));
            const data = await getMessages(chatId )
          const { message } = data

          const formattedMessages = message.map(msg => ({
              content: msg.content,
              role: msg.role,
          }))
          dispatch(addMessages({
              chatId,
              messages: formattedMessages,
          }))
          console.log("Formatted Messages:", formattedMessages);
          dispatch(setCurrentChatId(chatId))
      }
      catch(error){
          dispatch(setError(error.message))
      }
    }

    return {
      initializeSocketConnection,
      handleSendMessage,
      handleGetChats,
      handleOpenChat,
    };
  };
