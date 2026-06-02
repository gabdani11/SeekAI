import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import {useChat} from '../hooks/useChat.js'
import ReactMarkdown from "react-markdown";
import './dashboard.scss'
import Markdown from 'react-markdown';
import { setCurrentChatId } from '../chat.slice.js';
import { useDispatch } from 'react-redux';



const Dashboard = () => {
  const dispatch = useDispatch();
  const chat = useChat()
  const [messages, setMessages] = useState('')
  const [chatInput, setChatInput] = useState('')
  
  const chats = useSelector(state=>state.chat.chats)
  const currentChatId = useSelector(state=>state.chat.currentChatId)
  


  useEffect(() => {
    chat.initializedSocketConnection?.(),
    chat.handleGetChats()
  }, [])
 

//function to handle prompt submit 
const handleSubmitMessage = (e)=>{
  e.preventDefault()

  const trimmedMessage = chatInput.trim()
  if(!trimmedMessage)
  {
    return
  }
  chat.handleSendMessage({message: trimmedMessage, chatId: currentChatId})
  setChatInput('')

}
const handleChatClick = (chatId) =>{
  chat.handleGetMessages(chatId)
}
  return (
    <div className="dashboard">
      <div className="titleContainer">
        <h1>SeekAI</h1>
        <div className="createNewChat">
          <button onClick={()=>dispatch(setCurrentChatId(null))} className='createNewChatBtn'>
            Create New Chat
          </button>
        </div>
        <div className="titleList">
  {Object.values(chats).map((chat) => (
    <h4  key={chat.id} onClick={() => handleChatClick(chat.id)}>
      <ReactMarkdown>
      {chat.title}
      </ReactMarkdown>
    </h4>
  )).reverse()}
</div>
      </div>

      <div className="chatContainer">
        <div className="messages" aria-live="polite">
          {chats[currentChatId]?.messages?.length === 0 ? (
            <div className="empty">No messages yet. Start the conversation below.</div>
          ) : (
            chats[currentChatId]?.messages?.map((m) => (
              <div key={m.id} className={`message ${m.role}`}>
                <div className="bubble">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            ))
          )}
        </div>

        <form className="promptContainer" onSubmit={handleSubmitMessage}>
          <input
            placeholder="Type a message and press Enter"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            aria-label="Chat input"
            autoComplete="off"
            spellCheck={false}
          />
          <button className='btn'>Send</button>
        </form>
      </div>
    </div>  
  )
}


export default Dashboard;