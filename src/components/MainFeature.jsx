import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns'
import ApperIcon from './ApperIcon'
import conversationService from '../services/api/conversationService'
import messageService from '../services/api/messageService'
import userService from '../services/api/userService'

const MainFeature = () => {
  // Core states
  const [conversations, setConversations] = useState([])
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // UI states
  const [activeConversation, setActiveConversation] = useState(null)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showContactInfo, setShowContactInfo] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState(new Set())

  // Refs
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  // Current user simulation
  const currentUser = { userId: "user_1", displayName: "You" }

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [conversationsData, usersData, messagesData] = await Promise.all([
          conversationService.getAll(),
          userService.getAll(),
          messageService.getAll()
        ])
        
        setConversations(conversationsData || [])
        setUsers(usersData || [])
        setMessages(messagesData || [])
        
        // Simulate online users
        const onlineUserIds = new Set(usersData?.slice(0, 3).map(u => u.userId) || [])
        setOnlineUsers(onlineUserIds)
      } catch (err) {
        setError(err.message)
        toast.error("Failed to load conversations")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom()
  }, [messages, activeConversation])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => {
    const otherUser = users.find(u => 
      conv.participants?.find(p => p !== currentUser.userId) === u.userId
    )
    return otherUser?.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) || false
  })

  // Get messages for active conversation
  const conversationMessages = messages.filter(msg => 
    msg.conversationId === activeConversation?.conversationId
  ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

  // Send message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeConversation) return

    const newMessage = {
      conversationId: activeConversation.conversationId,
      senderId: currentUser.userId,
      content: messageText.trim(),
      type: "text",
      timestamp: new Date().toISOString(),
      status: "sent"
    }

    try {
      const createdMessage = await messageService.create(newMessage)
      setMessages(prev => [...prev, createdMessage])
      setMessageText("")
      
      // Update conversation's last message
      const updatedConversation = {
        ...activeConversation,
        lastMessage: createdMessage
      }
      await conversationService.update(activeConversation.conversationId, updatedConversation)
      setConversations(prev => 
        prev.map(c => c.conversationId === activeConversation.conversationId ? updatedConversation : c)
      )
      
      toast.success("Message sent")
      
      // Simulate typing indicator and auto-reply
      setTimeout(() => setIsTyping(true), 1000)
      setTimeout(async () => {
        setIsTyping(false)
        const replyMessage = {
          conversationId: activeConversation.conversationId,
          senderId: activeConversation.participants.find(p => p !== currentUser.userId),
          content: getAutoReply(messageText),
          type: "text",
          timestamp: new Date().toISOString(),
          status: "delivered"
        }
        const reply = await messageService.create(replyMessage)
        setMessages(prev => [...prev, reply])
      }, 3000)
      
    } catch (err) {
      toast.error("Failed to send message")
    }
  }

  const getAutoReply = (originalMessage) => {
    const replies = [
      "That sounds great! 👍",
      "I totally agree with you",
      "Interesting point!",
      "Thanks for sharing that",
      "Let me think about it 🤔",
      "Absolutely! 💯",
      "That makes sense",
      "I appreciate you telling me",
      "Good to know!",
      "Thanks for the update"
    ]
    return replies[Math.floor(Math.random() * replies.length)]
  }

  // Format message time
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp)
    if (isToday(date)) {
      return format(date, 'HH:mm')
    } else if (isYesterday(date)) {
      return 'Yesterday'
    } else {
      return format(date, 'dd/MM/yyyy')
    }
  }

  // Format conversation time
  const formatConversationTime = (timestamp) => {
    const date = new Date(timestamp)
    if (isToday(date)) {
      return format(date, 'HH:mm')
    } else if (isYesterday(date)) {
      return 'Yesterday'
    } else {
      return format(date, 'dd/MM')
    }
  }

  // Get user by ID
  const getUserById = (userId) => {
    return users.find(u => u.userId === userId) || { displayName: "Unknown User", profilePhoto: "" }
  }

  // Get other user in conversation
  const getOtherUser = (conversation) => {
    const otherUserId = conversation.participants?.find(p => p !== currentUser.userId)
    return getUserById(otherUserId)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="MessageCircle" className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading ChatterFlow...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-secondary shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ApperIcon name="MessageCircle" className="h-8 w-8 text-white" />
          <h1 className="text-xl font-bold text-white">ChatterFlow</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors">
            <ApperIcon name="Settings" className="h-5 w-5 text-white" />
          </button>
        </div>
      </header>

      {/* Main Chat Interface */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Conversations List */}
        <div className={`w-full md:w-80 bg-white border-r border-gray-200 flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto chat-scroll">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <ApperIcon name="MessageCircle" className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No conversations found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredConversations.map((conversation) => {
                  const otherUser = getOtherUser(conversation)
                  const isActive = activeConversation?.conversationId === conversation.conversationId
                  const isOnline = onlineUsers.has(otherUser.userId)
                  
                  return (
                    <motion.div
                      key={conversation.conversationId}
                      whileHover={{ backgroundColor: "rgba(37, 211, 102, 0.05)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveConversation(conversation)}
                      className={`p-4 cursor-pointer transition-colors ${
                        isActive ? 'bg-primary bg-opacity-10 border-r-4 border-primary' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={otherUser.profilePhoto || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`}
                            alt={otherUser.displayName}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          {isOnline && (
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-primary border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 truncate">
                              {otherUser.displayName}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {conversation.lastMessage && formatConversationTime(conversation.lastMessage.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage?.content || "No messages yet"}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-medium">
                              {conversation.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setActiveConversation(null)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-full"
                  >
                    <ApperIcon name="ArrowLeft" className="h-5 w-5 text-gray-600" />
                  </button>
                  <img
                    src={getOtherUser(activeConversation).profilePhoto || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`}
                    alt={getOtherUser(activeConversation).displayName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="font-medium text-gray-900">
                      {getOtherUser(activeConversation).displayName}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {onlineUsers.has(getOtherUser(activeConversation).userId) ? 'Online' : 'Last seen recently'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <ApperIcon name="Phone" className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <ApperIcon name="Video" className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <ApperIcon name="MoreVertical" className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto chat-scroll p-4 space-y-4"
                style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f1f5f9' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundColor: '#f8fafc'
                }}
              >
                <AnimatePresence>
                  {conversationMessages.map((message, index) => {
                    const isOwn = message.senderId === currentUser.userId
                    const sender = getUserById(message.senderId)
                    const showTime = index === 0 || 
                      new Date(message.timestamp).getTime() - new Date(conversationMessages[index - 1].timestamp).getTime() > 300000 // 5 minutes

                    return (
                      <motion.div
                        key={message.messageId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg ${isOwn ? 'order-2' : 'order-1'}`}>
                          {showTime && (
                            <div className="text-center mb-2">
                              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
                                {formatMessageTime(message.timestamp)}
                              </span>
                            </div>
                          )}
                          <div
                            className={`px-4 py-2 rounded-bubble shadow-message ${
                              isOwn
                                ? 'bg-chat-sent text-gray-800 ml-4'
                                : 'bg-chat-received text-gray-800 mr-4'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <div className={`flex items-center mt-1 space-x-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                              <span className="text-xs text-gray-500">
                                {format(new Date(message.timestamp), 'HH:mm')}
                              </span>
                              {isOwn && (
                                <div className="flex space-x-1">
                                  {message.status === 'sent' && (
                                    <ApperIcon name="Check" className="h-3 w-3 text-gray-500" />
                                  )}
                                  {message.status === 'delivered' && (
                                    <>
                                      <ApperIcon name="Check" className="h-3 w-3 text-gray-500" />
                                      <ApperIcon name="Check" className="h-3 w-3 text-gray-500 -ml-1" />
                                    </>
                                  )}
                                  {message.status === 'read' && (
                                    <>
                                      <ApperIcon name="Check" className="h-3 w-3 text-primary" />
                                      <ApperIcon name="Check" className="h-3 w-3 text-primary -ml-1" />
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-chat-received px-4 py-2 rounded-bubble shadow-message mr-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full typing-indicator"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full typing-indicator"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full typing-indicator"></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <ApperIcon name="Paperclip" className="h-5 w-5 text-gray-600" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="w-full px-4 py-2 pr-12 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full">
                      <ApperIcon name="Smile" className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className={`p-2 rounded-full transition-colors ${
                      messageText.trim()
                        ? 'bg-primary hover:bg-primary-dark text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <ApperIcon name={messageText.trim() ? "Send" : "Mic"} className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            // Welcome Screen
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-surface-50 to-surface-100">
              <div className="text-center max-w-md">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  <ApperIcon name="MessageCircle" className="h-24 w-24 text-primary mx-auto mb-6" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Welcome to ChatterFlow
                </h2>
                <p className="text-gray-600 mb-6">
                  Select a conversation from the sidebar to start chatting with your contacts.
                </p>
                <div className="text-sm text-gray-500">
                  💬 Instant messaging • 🔒 End-to-end encryption • 📱 Cross-platform sync
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MainFeature