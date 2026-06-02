import {ChatGoogleGenerativeAI} from '@langchain/google-genai'
import {ChatMistralAI} from '@langchain/mistralai'
import {HumanMessage, SystemMessage, AIMessage} from 'langchain'

const model = new ChatGoogleGenerativeAI({
    model:"gemini-2.5-flash",
    apiKey:process.env.GOOGLE_GEMINI_API_KEY
})
const model2 = new ChatMistralAI({
    model:"mistral-small-latest",
    apiKey:process.env.MISTRALAI_API_KEY
})


export async function generateResponse(message)
{
    const response = await model.invoke(message.map(msg=>{
        if(msg.role == 'user')
        {
           return new HumanMessage(msg.content)
        }else if(msg.role == 'ai')
        {
           return new AIMessage(msg.content)
        }
    }))
    return response.text
}
export async function generateChatTitle(message)
{
    const response = await model2.invoke([
        new SystemMessage(`You are a helpful assistant that generates a concise title for a conversation based on the following message.
            User will provide a message, and you will generate a title that captures the essence of the conversation in a few words. The title should be clear, relevant, and engaging.`),
        new HumanMessage(`
            generate a title for the following message: ${message}`)
    ])
    return response.text
}