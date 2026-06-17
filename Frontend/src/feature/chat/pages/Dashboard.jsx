import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useChat } from '../hooks/useChat.js'
import ReactMarkdown from "react-markdown";
import './dashboard.scss'
import { setCurrentChatId } from '../chat.slice.js';
import { RiCheckDoubleLine,RiFileTextFill,RiUpload2Line,RiCloseCircleLine,RiAddFill,RiCustomerServiceLine, RiSettings3Line, RiSendPlaneFill, RiChatNewLine, RiArrowRightSLine, RiChatAi3Fill } from "@remixicon/react";
import { getSocket } from '../services/chat.socket.js';



const Dashboard = () => {
  const dispatch = useDispatch();
  const chat = useChat()
  const [chatInput, setChatInput] = useState('')
  const [activeChatId, setActiveChatId] = useState(null);
  const [uploadActive, setUploadActive] = useState(false);
  const [file, setFile] = useState(null)
  const [fileUploadResult, setFileUploadResult] = useState(null);
 


  const chats = useSelector(state => state.chat.chats)
  const user = useSelector(state => state.auth.user)
  const currentChatId = useSelector(state => state.chat.currentChatId)
  const streamingMessage = useSelector(state => state.chat.streaming?.[currentChatId] || '')

  // setup socket + load chats once
  useEffect(() => {
    chat.initializeSocketConnection?.()
    chat.handleGetChats()
  }, [])

  // join room + listen for streaming whenever currentChatId changes
  useEffect(() => {
    const socket = getSocket()
    if (!socket || !currentChatId) return

    socket.emit("joinChat", currentChatId)

    const handleChunk = (payload) => chat.handleStreamChunk(payload)
    const handleComplete = (payload) => chat.handleStreamComplete(payload)

    socket.on("aiResponseChunk", handleChunk)
    socket.on("aiResponseComplete", handleComplete)

    return () => {
      socket.off("aiResponseChunk", handleChunk)
      socket.off("aiResponseComplete", handleComplete)
    }
  }, [currentChatId])

  const handleSubmitMessage = async (e) => {
    e.preventDefault()
    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) return

    setChatInput('')
    await chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
  }

  const handleChatClick = (chatId) => {
    chat.handleGetMessages(chatId)
    setActiveChatId(chatId)
  }

  const showEmptyState = (!currentChatId || chats[currentChatId]?.messages?.length === 0) && !streamingMessage
  
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
  };
  const clearFile = () => {
    setFile(null);
    
  };
  const handleFileSumit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const result = await chat.handleFileUpload({file})
    if(result)
    {
      setFileUploadResult(result);
    }


  }

  return (
    <div className="dashboard">
      <div className="titleContainer">
        <h1>SeekAI</h1>
        <div className="createNewChat">
          <button onClick={() => dispatch(setCurrentChatId(null))} className='createNewChatBtn'>
            New Chat
            <RiChatNewLine size={20} opacity={0.5} />
          </button>
        </div>

        <div className="conversationTitle">
          <RiChatAi3Fill size={20} />
          <h6>Conversation</h6>
        </div>

        <div className="titleList">
          {Object.values(chats).map((c) => (
            <h4 key={c.id}
              style={{ opacity: activeChatId == c.id ? 1 : 0.6 }}
              onClick={() => handleChatClick(c.id)}>
              <ReactMarkdown>{c.title}</ReactMarkdown>
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
          {uploadActive && (
  <div className='uploadFileContainer'>
    <RiCloseCircleLine
      id='closeBtn'
      onClick={() => {
        setUploadActive(!uploadActive);
        clearFile();
        setFileUploadResult(null);
      }}
    />

    {fileUploadResult ? (
      <div className='uploadResult'>
        <h6>File Uploaded Successfully!</h6>
        <RiCheckDoubleLine />
      </div>
    ) : (
      <>
        <h6>Upload PDF File</h6>
        <form onSubmit={handleFileSumit}>
          <label htmlFor="inputFile">
            {!file ? (
              <>
                <RiUpload2Line id='uploadBtnLabel' />
                <span>Drop your file here</span>
              </>
            ) : (
              <RiFileTextFill id="uploadedIcon" />
            )}
          </label>
          <input
            type="file"
            id='inputFile'
            accept="application/pdf"
            onChange={handleFileChange}
          />
          <button id='uploadBtn'>Upload</button>
        </form>
      </>
    )}
  </div>
)}
          {showEmptyState ? (
            <div className="empty">
              <h4>What are you seeking today?</h4>
              <p>One prompt away from clarity.</p>
            </div>
          ) : (
            <>
              {chats[currentChatId]?.messages?.map((m, i) => (
                <div key={m.id ?? i} className={`message ${m.role}`}>
                  <div className="bubble">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {streamingMessage && (
                <div className="message ai">
                  <div className="bubble">
                    <ReactMarkdown>{streamingMessage}</ReactMarkdown>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <form className="promptContainer" onSubmit={handleSubmitMessage}>
          <RiAddFill id='uploadFileBtn' onClick={()=>setUploadActive(!uploadActive)}/>
          <input
            placeholder="Type a message and press Enter"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            aria-label="Chat input"
            autoComplete="off"
            spellCheck={false}
          />
          <button className='btn'>
            <RiSendPlaneFill size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default Dashboard;