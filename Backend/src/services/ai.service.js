import {ChatGoogleGenerativeAI} from '@langchain/google-genai'
import {ChatMistralAI} from '@langchain/mistralai'
import {HumanMessage, SystemMessage, AIMessage, createAgent, tool} from 'langchain'
import getDataFromInternet from './internet.service.js'
import * as z from 'zod'// Define a Zod schema for the tool input

const model = new ChatGoogleGenerativeAI({
    model:"gemini-2.5-flash",
    apiKey:process.env.GOOGLE_GEMINI_API_KEY
})
const model2 = new ChatMistralAI({
    model:"mistral-small-latest",
    apiKey:process.env.MISTRALAI_API_KEY
})

const searchInternetTool = tool(
    getDataFromInternet,
    {
        name:"searchInternet",
        description:"use this tool to search for latest information on the internet.",
        schema: z.object({
            query: z.string().describe("The search query to fetch information from the internet.")
        })
    }

)


const agent = createAgent({
    model:model, 
    tools:[searchInternetTool],
 })


export async function generateResponse(message)
{
    const response = await agent.invoke({messages:[

        new SystemMessage(`
            You are a helpful assistant that provides information and answers questions based on the user's message.
             If you need to search for information with latest updates on the internet to provide a better response, use the "searchInternet" tool.`),
        ...(message.map(msg=>{
        if(msg.role == 'user')
        {
           return new HumanMessage(msg.content)
        }else if(msg.role == 'ai')
        {
           return new AIMessage(msg.content)
        }
    })
)]
})
return response.messages[response.messages.length-1].text
}
export async function generateChatTitle(message)
{
    const response = await model2.invoke([
        new SystemMessage(`You are a helpful assistant that generates a concise title for a conversation based on the following message.
            User will provide a message, and you will generate a title that captures the essence of the conversation in a few words. The title should be clear, relevant, and engaging.
            title shoud be in sentence case, and should not exceed 6 words.`),
        new HumanMessage(`
            generate a title for the following message : ${message}`)
    ])
    return response.text
}