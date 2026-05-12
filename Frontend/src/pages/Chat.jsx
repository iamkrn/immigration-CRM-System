

import { useEffect, useRef, useState } from "react"
import chatService from "../services/chatService"
import useSocket from "../hooks/UseSocket"

const Chat = () => {
  const user = JSON.parse(localStorage.getItem("user"))
          console.log(user)

const { socket, isConnected } = useSocket()

  const [chats, setChats]           = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages]     = useState([])
  const [text, setText]             = useState("")
  const bottomRef = useRef(null)    // auto scroll 

  // ─── 1. load chat ──────────────────────
  useEffect(() => {
    loadChats()
  }, [])

  const loadChats = async () => {
  try {
    if (user.role === "student") {
      const res = await chatService.getChatByStudent(user.studentId)
      setActiveChat(res.data)
    }      
      else {
      const res = await chatService.getAllChats()
      setChats(res.data)
    }
  } catch (err) {
    console.log(err)
  }
}
  // ─── 2.  when chat select then message load ───
          useEffect(() => {
  if (!activeChat?._id) return
  loadMessages()
  if (isConnected) {
    socket?.current?.emit("joinRoom", activeChat._id)
    console.log("Joined room:", activeChat._id)
  }
}, [activeChat?._id, isConnected])

const loadMessages = async () => {
    try {
      const res = await chatService.getMessages(activeChat._id)
          console.log("Messages:", res.data) 

      setMessages(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  // ─── 3. Socket — real time message receive ───
 useEffect(() => {
  if (!isConnected) return
  const handleMessage = (newMsg) => {
    setMessages((prev) => [...prev, newMsg])
  }
  socket?.current?.on("receiveMessage", handleMessage)
  return () => socket?.current?.off("receiveMessage", handleMessage)
}, [isConnected,activeChat?._id])

// ─── 4. Auto scroll ──────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" })
  }, [activeChat?._id, messages])

  // ─── 5. send message ────────────────────────
  const handleSend = async () => {
  if (!text.trim() || !activeChat?._id) return

  const receiverId = user.role === "student"
    ? activeChat.counsellorId._id
    : activeChat.studentId._id

  const senderModel = user.role === "student" ? "Student" : "User"

  try {
    const res = await chatService.sendMessage(
      activeChat._id,
      receiverId,
      text,
      senderModel
    )
    setText("")
  } catch (err) {
    console.log(err)
  }
}

  // ─── UI ──────────────────────────────────────
  return (
  <div className="flex bg-gray-100" style={{ height: "100%", minHeight: 0 }}>

    {/* ── LEFT PANEL ── */}
    {(user.role === "counsellor" || user.role === "admin" || user.role === "superAdmin") && (
      <div className="flex flex-col w-80 bg-white border-r border-gray-200 shrink-0">

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between"
          style={{ background: "#075E54" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-white font-semibold text-sm">{user?.name}</span>
          </div>
          <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Chats</span>
        </div>

        {/* Search bar */}
        <div className="px-3 py-2 bg-white border-b border-gray-100">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
            </svg>
            <span className="text-gray-400 text-sm">Search or start new chat</span>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
              <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-sm">No chats yet</p>
            </div>
          ) : (
            chats.map((chat) => {
              const isActive = activeChat?._id === chat._id
              return (
                <div key={chat._id} onClick={() => setActiveChat(chat)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all border-b border-gray-50"
                  style={{ background: isActive ? "#F0FDF4" : "white" }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#F9FAFB" }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "white" }}
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
                    style={{ background: "linear-gradient(135deg, #075E54, #128C7E)" }}>
                    {chat.studentId?.firstName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {chat.studentId?.firstName} {chat.studentId?.lastName}
                      </p>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#25D366" }} />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{chat.studentId?.email}</p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    )}

    {/* ── RIGHT PANEL ── */}
    <div className="flex flex-col flex-1 min-w-0">

      {!activeChat ? (
        /* Empty State */
        <div className="flex flex-col flex-1 items-center justify-center gap-4"
          style={{ background: "#F0F2F5" }}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: "rgba(7,94,84,0.08)" }}>
            <svg className="w-12 h-12" style={{ color: "#075E54" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-xl font-light text-gray-600">360 CRM Chat</p>
            <p className="text-sm text-gray-400 mt-1">Select a conversation to start messaging</p>
          </div>
        </div>
      ) : (
        <>
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-5 py-3 shrink-0"
            style={{ background: "#075E54" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ background: "#128C7E" }}>
              {activeChat.studentId?.firstName?.charAt(0).toUpperCase() ||
               activeChat.counsellorId?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                {activeChat.studentId?.firstName} {activeChat.studentId?.lastName}
              </p>
              <p className="text-white/60 text-xs">online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col justify-end gap-1"
            style={{
              background: "#E5DDD5",
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
            }}>
            {messages.map((msg) => {
              const isMine = msg.senderId === user._id || msg.senderId?._id === user._id
              return (
                <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[65%] px-3 py-2 rounded-lg text-sm shadow-sm relative"
                    style={{
                      background: isMine ? "#DCF8C6" : "white",
                      borderRadius: isMine ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                      color: "#111"
                    }}>
                    {msg.text}
                    <span className="text-xs ml-2 float-right mt-1"
                      style={{ color: "#8696A0" }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input Bar */}
          <div className="flex items-center gap-3 px-4 py-3 shrink-0"
            style={{ background: "#F0F2F5" }}>
            <div className="flex-1 flex items-center gap-3 bg-white rounded-full px-4 py-2.5 shadow-sm">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message"
                className="flex-1 outline-none text-sm text-gray-800 bg-transparent"
              />
            </div>
            <button onClick={handleSend}
              className="w-11 h-11 rounded-full flex items-center justify-center text-white shrink-0 transition-all active:scale-95"
              style={{ background: "#075E54" }}>
              <svg className="w-5 h-5 rotate-45" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}

export default Chat