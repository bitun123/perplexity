import { ChatGroq } from "@langchain/groq";
import { ChatMistralAI } from "@langchain/mistralai";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

// ─── Models ───────────────────────────────────────────────────────────────────

export const groqModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama3-70b-8192",
  temperature: 0.7,
  streaming: true,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

// ─── Format messages for LangChain ───────────────────────────────────────────

const formatMessages = (messages) => {
  return messages.map((msg) => {
    if (msg.role === "user") return new HumanMessage(msg.content);
    if (msg.role === "ai") return new AIMessage(msg.content);
  }).filter(Boolean);
};

// ─── Normal Response (non-streaming) ─────────────────────────────────────────

export async function generateGroqResponse(messages) {
  const formatted = formatMessages(messages);
  const response = await groqModel.invoke(formatted);
  return response.text;
}

// ─── Streaming Response ───────────────────────────────────────────────────────

export async function generateGroqResponseStream(messages, onToken) {
  const formatted = formatMessages(messages);

  let fullContent = "";

  const stream = await groqModel.stream(formatted);

  for await (const chunk of stream) {
    const token = chunk.content || "";
    if (token) {
      fullContent += token;
      onToken(token); // send each token to controller
    }
  }

  return fullContent; // return full response for DB save
}

// ─── Generate Chat Title ──────────────────────────────────────────────────────

export async function generateMistralChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`You are a helpful assistant that generates concise titles for chat conversations.

      The user will provide you with the first message of the chat conversation, and you will generate a concise title that captures the essence of the conversation in 2-4 words.

      Rules:
      - Title should be 2-4 words only
      - Use Title Case (capitalize first letter of each major word)
      - No special characters or punctuation
      - Be descriptive and relevant to the topic
    `),
    new HumanMessage(`Generate a concise title for this first message: ${message}`),
  ]);

  return response.text;
}