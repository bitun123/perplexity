import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_URL || "http://localhost:3000",
    withCredentials: true, // ✅ Send cookies with requests
})




export const sendMessageStream = async ({
  message,
  chatId,
  onChat,
  onToken,
  onDone,
}) => {
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

  let buffer = ""; // 🔥 IMPORTANT

  // 🔥 delay helper
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n"); // ✅ correct
    buffer = events.pop(); // incomplete part

    for (const event of events) {
      if (!event.startsWith("data:")) continue;

      const jsonStr = event.replace("data:", "").trim();

      try {
        const data = JSON.parse(jsonStr);

        if (data.type === "chat") {
          onChat?.(data.chat);
        }

        if (data.type === "token") {
        await sleep(20 + Math.random() * 40);
          onToken?.(data.token);
        }

        if (data.type === "done") {
          onDone?.(data.AIMessage);
        }

      } catch {
        console.log("skip incomplete chunk");
      }
    }
  }
};



export const getChats = async () => {
  const response = await api.get("api/chats/getChats");
  return response.data;
};

// ─── Get Messages for a Chat ──────────────────────────────────────────────────

export const getMessages = async (chatId) => {
  const response = await api.get(`api/chats/getMessages/${chatId}`);
  return response.data;
};

// ─── Delete Chat ──────────────────────────────────────────────────────────────

export const deleteChat = async (chatId) => {
  const response = await api.delete(`api/chats/delete/${chatId}`);
  return response.data;
};