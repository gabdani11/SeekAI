import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import './dashboard.scss'

const titles = [
  'this is title',
  'this is titl2',
  'this is title3',
]

const Dashboard = () => {
  const chat = useChat()

  const [messages, setMessages] = useState('')
  const [chatInput, setChatInput] = useState('')
  
  const chats = useSelector(state=>state.chat.chats)
  console.log(chats)
  const currentChatId = useSelector(state=>state.chat.currentChatId)


  useEffect(() => {
    chat.initializedSocketConnection?.()
  }, [])

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
  return (
    <div className="dashboard">
      <div className="titleContainer">
        <h1>SeekAI</h1>
        <div className="titleList">
          {titles.map((t) => (
            <h4 key={t}>{t}</h4>
          ))}
        </div>
      </div>

      <div className="chatContainer">
        <div className="messages" aria-live="polite">
          {chats[currentChatId]?.messages?.length === 0 ? (
            <div className="empty">No messages yet. Start the conversation below.</div>
          ) : (
            chats[currentChatId]?.messages?.map((m) => (
              <div key={m.id} className={`message ${m.role}`}>
                <div className="bubble">{m.content}</div>
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

export default Dashboard