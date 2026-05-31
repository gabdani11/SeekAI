import { initializedSocketConnection } from "../services/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../services/chat.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, createNewMessage, updateChatMessages } from "../chat.slice";
import { useDispatch } from "react-redux";
export const useChat = () =>{

    const dispatch = useDispatch()


    async function handleSendMessage({message, chatId})
    {
    try{
        dispatch(setLoading(true))
        const response= await sendMessage({message, chatId})
        const {aiMessage, chat} = response
        dispatch(createNewChat({chatId: chat._id, title: chat.title}))
        
        dispatch(createNewMessage({chatId: chat._id, content: message, role: 'user'}))
        dispatch(createNewMessage({chatId: chat._id, content: aiMessage.content, role: aiMessage.role}))
        dispatch(setCurrentChatId(chat._id))
        }catch(error)
        {
            console.log(error)
        }finally
        {
            dispatch(setLoading(false))
        }
    }


    //bring all the chats of the user
     async function handleGetChats() {
        dispatch(setLoading(true))
        const data = await getChats()
        const { chats } = data
        const formattedChats = {}
        chats.forEach((chat)=>{
            formattedChats[chat._id] = {
                id: chat._id,
                title: chat.title,
                messages:[],
                lastUpdated: chat.updatedAt
            }
        })
        dispatch(setChats(formattedChats))
        dispatch(setLoading(false))
    }
    //bring all the messages of a chat
    async function handleGetMessages(chatId){
        dispatch(setLoading(true))
        const data = await getMessages(chatId)
        const {messages} = data
        dispatch(setCurrentChatId(chatId))
        dispatch(updateChatMessages({chatId, messages}))
        dispatch(setLoading(false))
    }

    



    return{
        initializedSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleGetMessages
    }
}