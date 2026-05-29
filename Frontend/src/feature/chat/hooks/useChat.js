import { initializedSocketConnection } from "../services/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../services/chat.api";
import { setChats, setCurrentChatId, setError, setLoading } from "../chat.slice";
import { useDispatch } from "react-redux";
export const useChat = ()=>{
    const dispatch = useDispatch()


    async function handleSendMessage({message, chatId})
    {
    try{
        dispatch(setLoading(true))
        const response= await sendMessage({message, chatId})
        const {aiMessage, chat} = response
        dispatch(serChats((prev)=>{
            return {
                ...prev,
                [chat._id]:{
                    ...chat,
                    messages:[{content:message, role:"user"}, aiMessage ]
                }
            }


        }))
        dispatch(setCurrentChatId(chat._id))

        }catch(error)
        {
            console.log(error)
        }finally
        {
            dispatch(setLoading(false))
        }
    }



    return{
        initializedSocketConnection,
        handleSendMessage
    }
}