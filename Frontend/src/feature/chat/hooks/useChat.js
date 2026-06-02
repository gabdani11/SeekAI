import { initializedSocketConnection } from "../services/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../services/chat.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, createNewMessage, updateChatMessages, setChatMessages, updateTempId } from "../chat.slice";
import { useDispatch, useSelector } from "react-redux";
export const useChat = () =>{

    const dispatch = useDispatch()
    const currentChatId = useSelector(state=>state.chat.currentChatId)


    async function handleSendMessage({message, chatId=currentChatId})
    {
    try{
        const tempChatId = `temp-${Date.now()}`
        dispatch(setLoading(true))
        if(chatId)
        {
        dispatch(updateChatMessages({ chat: chatId, content: [{content: message, role:"user"}]}))
        }else
        {
            dispatch(createNewChat({chat: tempChatId, title: 'Loading...', messages: [{content: message, role:"user"}]}))
            dispatch(setCurrentChatId(tempChatId))
        }
        const response= await sendMessage({message, chatId})
        const {aiMessage, title, chat} = response
        dispatch(setCurrentChatId(aiMessage.chat))
        
        if(title == null)
        {   
            dispatch(updateChatMessages({ chat: aiMessage.chat, content: [{content: aiMessage.content, role:"ai"}]}))
            
        }
        else{
            
            dispatch(updateTempId({tempId: tempChatId, content:[{content: aiMessage.content, role:"ai"}], chat}))
            
        }

    }catch(error)
    {
        dispatch(setError(error.message))
    }finally{
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
        dispatch(setChatMessages({chatId, messages}))
        dispatch(setLoading(false))
    }

    



    return{
        initializedSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleGetMessages
    }
}