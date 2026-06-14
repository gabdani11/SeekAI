import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null,
        streaming: {}
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chat, title, messages } = action.payload
            state.chats[chat] = {
                id: chat,
                title: title,
                messages: messages,
                lastUpdated: Date.now(),
            }
        },
        updateTempId: (state, action) => {
            const { tempId, content, chat } = action.payload
            state.chats[chat._id] = {
                ...state.chats[tempId],
                id: chat._id,
                title: chat.title,
                messages: [
                    ...state.chats[tempId].messages,
                    ...content
                ],
                lastUpdated: chat.updatedAt
            }
            delete state.chats[tempId]

            // carry over streaming state if it was being tracked under tempId
            if (state.streaming[tempId]) {
                state.streaming[chat._id] = state.streaming[tempId]
                delete state.streaming[tempId]
            }
        },
        createNewMessage: (state, action) => {
            const { chatId, content, role } = action.payload
            state.chats[chatId].messages.push({ content, role })
        },
        updateChatMessages: (state, action) => {
            const { chat, content } = action.payload
            state.chats[chat].messages = [...state.chats[chat].messages, ...content]
        },
        setChatMessages: (state, action) => {
            const { chatId, messages } = action.payload
            state.chats[chatId].messages = messages
        },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        appendStreamingChunk: (state, action) => {
            const { chatId, text } = action.payload
            state.streaming[chatId] = (state.streaming[chatId] || '') + text
        },
        finalizeAiMessage: (state, action) => {
            const { chatId, content } = action.payload
            if (state.chats[chatId]) {
                state.chats[chatId].messages.push({ content, role: 'ai' })
            }
            delete state.streaming[chatId]
        }
    }
})

export const {
    setChats,
    setCurrentChatId,
    setLoading,
    setError,
    createNewChat,
    createNewMessage,
    updateChatMessages,
    setChatMessages,
    updateTempId,
    appendStreamingChunk,
    finalizeAiMessage
} = chatSlice.actions

export default chatSlice.reducer