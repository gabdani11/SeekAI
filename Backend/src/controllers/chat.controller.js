import { generateResponse, generateChatTitle } from "../services/ai.service.js"
import chatModel from '../model/chat.model.js'
import messageModel from '../model/message.model.js'
import {storeRAGData} from '../services/rag.service.js'
import {PDFParse} from 'pdf-parse'


export async function sendMessage(req, res) {
    try {
        const { message, chatId } = req.body
        let title = null, chat = null

        if (!chatId) {
            title = await generateChatTitle(message)
            chat = await chatModel.create({
                user: req.user.id,
                title
            })
        }

        const finalChatId = chatId || chat._id

        await messageModel.create({
            chat: finalChatId,
            content: message,
            role: 'user'
        })

        // respond immediately so frontend isn't blocked while streaming happens
        res.status(202).json({
            title,
            chat,
            chatId: finalChatId
        })

        const messages = await messageModel.find({ chat: finalChatId })

        // stream response over socket
        const response = await generateResponse(messages, finalChatId)

        // save after streaming completes
        await messageModel.create({
            chat: finalChatId,
            content: response,
            role: 'ai'
        })

    } catch (err) {
        console.error(err)
        if (!res.headersSent) {
            res.status(500).json({ error: "Failed to generate response" })
        }
    }
}
export async function getChats(req,res)
{
    const user = req.user
    
    const chats = await chatModel.find({
        user:user.id
    })
    res.status(200).json({
        message:"Chat received successfully",
        success:true,
        chats
    })
}
export async function getMessages(req,res)
{
    const {chatId} = req.params;

    const chat = await chatModel.findOne({
        _id:chatId,
        user:req.user.id
    })
    if(!chat)
    {
        return res.status(404).json({
            chat:chatId
        })
    }
    const messages = await messageModel.find({
        chat:chatId
    })
    res.status(200).json({
        message:"Succesfully received messages",
        messages
    })
}
export async function deleteChat(req, res)
{
    const chatId = req.params

    const chat = await chatModel.findOneAndDelete({
        _id:chatId,
        user:req.user.id
    })
    await messageModel.deleteMany({
        chat: chatId
    })
    if(!chat)
    {
        return res.status(404).json({
            message:"Chat not found"
        })
    }
    res.status(200).json({
        message:"Chat deleted successfully"
    })

}
export async function uploadFile(req,res)
{
    const file = req.file
    if(!file)
    {
        return res.status(400).json({
            message:"No file uploaded"
        })
    }
    try{
    
    const parse = new PDFParse({data:file.buffer})
    const result = await parse.getText()
    parse.destroy()
    const response = await storeRAGData(result)
    if(!response)
    {
        return res.status(500).json({
            message:"Error occurred while uploading file"
        })
    }
    res.status(200).json({
        message:"File uploaded successfully",
        result:"success"
    })

    
    }catch(err)
    {
        console.error(err)
    }
    



}