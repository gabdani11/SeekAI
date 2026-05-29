import { generateResponse, generateChatTitle } from "../services/ai.service.js"
import chatModel from '../model/chat.model.js'
import messageModel from '../model/message.model.js'


export async function sendMessage(req,res)
{
    const {message, chatId} = req.body
    
    
    let title = null, chat = null;

    if(!chatId){
        title = await generateChatTitle(message) //generate title from mistral
        chat = await chatModel.create({ //creating chat title and user id in DB
        user: req.user.id,
        title
    })
}
    
    const userMessage = await messageModel.create({ //creating content, chatid of user in DB
        chat:chatId || chat._id,
        content: message,
        role:'user'

    })
    const messages = await messageModel.find({chat:chatId || chat._id}) //find all message with similar chatid
    const response = await generateResponse(messages) //generate content of question

    const aiMessage = await messageModel.create({ //creating content , chatid of ai in DB
        chat:chatId || chat._id,
        content: response,
        role:'ai'

    })

    res.status(201).json({
       aiMessage:aiMessage,
       title: title,
       chat:chat
    })
}
export async function getCharts(req,res)
{
    const user = req.user
    
    const charts = await chatModel.find({
        user:user.id
    })
    res.status(200).json({
        message:"Chat received successfully",
        charts
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