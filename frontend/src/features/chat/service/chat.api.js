import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_URL || "http://localhost:3000",
    withCredentials: true, // ✅ Send cookies with requests
})


console.log(import.meta.env.VITE_URL)

export const sendMessageStream = async ({ message, chatId, onChat, onToken, onDone }) => {


  const response = await fetch(`${import.meta.env.VITE_URL}/api/chats/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ message, chat: chatId }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value);
    const lines = text.split("\n");

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;

      try {
        const data = JSON.parse(line.replace("data: ", "").trim());
        if (data.type === "chat") onChat?.(data.chat);
        if (data.type === "token") onToken?.(data.token);
        if (data.type === "done") onDone?.(data.AIMessage);
      } catch {
        // incomplete chunk — skip silently
        throw new Error("Failed to parse chunk");
      }
    }
  }
};



export const getChats = async () => {
  const response = await api.get("/chats/getChats");
  return response.data;
};

// ─── Get Messages for a Chat ──────────────────────────────────────────────────

export const getMessages = async (chatId) => {
  const response = await api.get(`/chats/getMessages/${chatId}`);
  return response.data;
};

// ─── Delete Chat ──────────────────────────────────────────────────────────────

export const deleteChat = async (chatId) => {
  const response = await api.delete(`/chats/delete/${chatId}`);
  return response.data;
};