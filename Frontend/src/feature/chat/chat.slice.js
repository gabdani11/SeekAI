import { createSlice} from "@reduxjs/toolkit";


const chatSlice = createSlice({
    name:'chat',
    initialState:{
        chats:{},
        currentChatId:null,
        isLoading:false,
        error:null
    },
    reducers:{
         createNewChat: (state, action) => {
            const { chat, title, messages } = action.payload
            state.chats[ chat ] = {
                id: chat,
                title: title,
                messages: messages,
                lastUpdated: Date.now() ,
            }
        },
        updateTempId:(state, action)=>{
                 const {tempId, content, chat} = action.payload
                 state.chats[chat._id] = {
                 ...state.chats[tempId],
                 id: chat._id,
                 title: chat.title,
                 messages:[
                     ...state.chats[tempId].messages,
                     ...content
                 ],
                 lastUpdated: chat.updatedAt
             }

             delete state.chats[tempId]
        },
        createNewMessage:(state, action)=>{
            const {chatId,content, role} = action.payload
            state.chats[chatId].messages.push({content, role})
        },
        updateChatMessages:(state, action)=>{
            const {chat, content} = action.payload
            state.chats[chat].messages = [...state.chats[chat].messages, ...content]
        },
        setChatMessages:(state, action)=>{
            const {chatId, messages} = action.payload
            state.chats[chatId].messages = messages
        },
        setChats:(state,action)=>{
            state.chats = action.payload
        },
        setCurrentChatId:(state, action)=>{
            state.currentChatId = action.payload

        },
        setLoading:(state, action)=>{
            state.isLoading = action.payload

        },
        setError:(state, action) =>{
            state.error = action.payload
        }
    }
})
export const {setChats, setCurrentChatId, setLoading, setError, createNewChat, createNewMessage, updateChatMessages, setChatMessages, updateTempId} = chatSlice.actions
export default chatSlice.reducer