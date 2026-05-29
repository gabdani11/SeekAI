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
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    chat.initializedSocketConnection?.()
  }, [])

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    const msg = {
      id: Date.now(),
      text: input.trim(),
      role: 'user',
    }
    setMessages((p) => [...p, msg])
    setInput('')
    inputRef.current?.focus()
    // If you add socket send later: chat.sendMessage?.(msg)
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
          {messages.length === 0 ? (
            <div className="empty">No messages yet. Start the conversation below.</div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`message ${m.role}`}>
                <div className="bubble">{m.text}</div>
              </div>
            ))
          )}
        </div>

        <form className="promptContainer" onSubmit={handleSend}>
          <input
            ref={inputRef}
            placeholder="Type a message and press Enter"
            value={input}
            onChange={(e) => setInput(e.target.value)}
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