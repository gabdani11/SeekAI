import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import {useChat} from '../hooks/useChat.js'
import ReactMarkdown from "react-markdown";
import './dashboard.scss'
import Markdown from 'react-markdown';
import { setCurrentChatId } from '../chat.slice.js';
import { useDispatch } from 'react-redux';
import {RiCustomerServiceLine, RiSettings3Line, RiSendPlaneFill, RiChatNewLine, RiArrowRightSLine, RiChatAi3Fill } from "@remixicon/react";




const Dashboard = () => {
  const dispatch = useDispatch();
  const chat = useChat()
  const [messages, setMessages] = useState('')
  const [chatInput, setChatInput] = useState('')
  const [activeChatId, setActiveChatId] = useState(null);
  
  const chats = useSelector(state=>state.chat.chats)
  const user = useSelector(state=>state.auth.user)
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
  setActiveChatId(chatId)
}
  return (
    <div className="dashboard">
      <div className="titleContainer">
        <h1>SeekAI</h1>
        <div className="createNewChat">
          <button onClick={()=>dispatch(setCurrentChatId(null))} className='createNewChatBtn'>
            New Chat
            <RiChatNewLine
            size={20}
            opacity={0.5} />
          </button>
        </div>
        
        <div className="conversationTitle">
            <RiChatAi3Fill 
            size={20}/>
            <h6>Conversation</h6>
          </div>
        <div className="titleList">
           {Object.values(chats).map((chat) => (
             <h4 key={chat.id}
              style={{opacity:activeChatId == chat.id ?1:0.6}}
              onClick={() => handleChatClick(chat.id)}>
               <ReactMarkdown>
               {chat.title}
               </ReactMarkdown>
             </h4>
           )).reverse()}
        </div>

        <div className="preferencesPanel">
          <div className="support box">
            <RiCustomerServiceLine />
            <span>Support</span>

          </div>
          <div className="setting box">
            <RiSettings3Line />
            <span>Setting</span>
          </div>

        </div>

        <div className="userDetail">
          <div className="profileImg">
            <img src="https://png.pngtree.com/png-vector/20250512/ourmid/pngtree-default-avatar-profile-icon-gray-placeholder-vector-png-image_16213764.png" 
            loading='lazy'
            alt="profilePicture" />
            <h5>{user.username}</h5>
          </div>
          <RiArrowRightSLine />
        </div>
      </div>

      <div className="chatContainer">
        <div className="messages" aria-live="polite">
          {chats[currentChatId]?.messages?.length === 0 || currentChatId == null ? (
            <div className="empty">
              <h4>What are you seeking today?</h4>
              <p>One prompt away from clarity.</p>
              </div>
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
          <button className='btn'>
           <RiSendPlaneFill
           size={20} />
          </button>
        </form>
      </div>
    </div>  
  )
}


export default Dashboard;