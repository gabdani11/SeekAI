import axios from 'axios'

const api = axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true,
})

//message to ai
export const sendMessage = async ({message, chatId}) =>{
    const reponse = await api.post("/api/chat/message",{
        message, chatId
    })
    return response.data
}
//get chart history
export const getChats = async ()=>{
    const response = await api.get("/api/chat")
    return response.data
}
//get message history
export const getMessages = async (chatId)=>{
    const response = await api.get(`/api/chat/${chatId}/messages`)
    return response.data
}
//delete chat
export const deleteChat = async (chatId)=>{
    const response = await api.get(`/api/chat/delete/${chatId}`)
    return response.data
}