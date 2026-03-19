import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: {},
  currentChatId: null,
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    setChats: (state, action) => {
      state.chats = action.payload;
    },

    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },

    createNewChat: (state, action) => {
      const { chatId, title } = action.payload;
      if (!state.chats[chatId]) {
        state.chats[chatId] = {
          id: chatId,
          title,
          messages: [],
          lastUpdated: new Date().toISOString(),
        };
      }
    },

    addNewMessage: (state, action) => {
      const { chatId, content, role } = action.payload;
      if (!state.chats[chatId]) return;
      state.chats[chatId].messages.push({
        id: crypto.randomUUID(),
        content,
        role,
      });
    },

    addMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      if (!state.chats[chatId]) return;
      state.chats[chatId].messages = messages;
    },

    // ✅ Add empty AI message placeholder before streaming starts
    addStreamingMessage: (state, action) => {
      const { chatId, id } = action.payload;
      if (!state.chats[chatId]) return;
      state.chats[chatId].messages.push({
        id,
        content: "",
        role: "ai",
        streaming: true,
      });
    },

    // ✅ Append each token to the streaming message
    appendToken: (state, action) => {
      const { chatId, id, token } = action.payload;
      if (!state.chats[chatId]) return;
      const msg = state.chats[chatId].messages.find((m) => m.id === id);
      if (msg) msg.content += token;
    },

    // ✅ Replace placeholder with final DB saved message
    finalizeMessage: (state, action) => {
      const { chatId, id, AIMessage } = action.payload;
      if (!state.chats[chatId]) return;
      const index = state.chats[chatId].messages.findIndex((m) => m.id === id);
      if (index !== -1) {
        state.chats[chatId].messages[index] = {
          id: AIMessage._id,
          content: AIMessage.content,
          role: "ai",
          streaming: false,
        };
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setChats,
  setCurrentChatId,
  createNewChat,
  addNewMessage,
  addMessages,
  addStreamingMessage,
  appendToken,
  finalizeMessage,
} = chatSlice.actions;

export default chatSlice.reducer;