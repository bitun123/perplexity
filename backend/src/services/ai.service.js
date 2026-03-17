import {ChatGoogleGenerativeAI} from "@langchain/google-genai"
import { ChatMistralAI } from "@langchain/mistralai";
import {AIMessage, HumanMessage,SystemMessage} from "langchain"
const geminiModel = new ChatGoogleGenerativeAI({
    model:"gemini-2.5-flash-lite",
apiKey:process.env.GOOGLE_GEMINI_API_KEY
})



const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
    apiKey:process.env.MISTRAL_API_KEY
})



export async function generateGeminiResponse(messages) {
 const response  = await geminiModel.invoke(
    messages.map((msg)=>{
        if(msg.role === "user"){
            return new HumanMessage(msg.content)
        }else if(msg.role === "ai"){
            return new AIMessage(msg.content)
        }
    })
 )
 return response.text;
}


export async function generateMistralChatTitle(message) {

const response = await mistralModel.invoke([

new SystemMessage(`You are a helpful assistant that answers questions concisely 
    and descriptive till for chat conversations.

    user will provide you with the first message of the chat conversation,and you will generate a concise title that captures the essence of the conversation in 2-4 words. the title should be descriptive and should give a clear idea about the topic of the conversation. The title should be in title case, meaning that the first letter of each major word should be capitalized. Do not include any special characters or punctuation in the title. The title should be relevant to the content of the conversation and should accurately reflect the main theme or subject matter being discussed.make sure the title should be 2-4 words only.
    `),

    new HumanMessage(`generate a concise title for a chat conversation with the first message: ${message}`)
])
return response.text;
}