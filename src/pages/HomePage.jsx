import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import conversationService from '../services/api/conversationService';
import messageService from '../services/api/messageService';
import userService from '../services/api/userService';
import ChatInterfaceTemplate from '../components/templates/ChatInterfaceTemplate';

const HomePage = () => {
  // Core states
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // UI states
  const [activeConversation, setActiveConversation] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  // Current user simulation
  const currentUser = { userId: "user_1", displayName: "You" };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [conversationsData, usersData, messagesData] = await Promise.all([
          conversationService.getAll(),
          userService.getAll(),
          messageService.getAll()
        ]);

        setConversations(conversationsData || []);
        setUsers(usersData || []);
        setMessages(messagesData || []);

        // Simulate online users
        const onlineUserIds = new Set(usersData?.slice(0, 3).map(u => u.userId) || []);
        setOnlineUsers(onlineUserIds);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Send message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeConversation) return;

    const newMessage = {
      conversationId: activeConversation.conversationId,
      senderId: currentUser.userId,
      content: messageText.trim(),
      type: "text",
      timestamp: new Date().toISOString(),
      status: "sent"
    };

    try {
      const createdMessage = await messageService.create(newMessage);
      setMessages(prev => [...prev, createdMessage]);
      setMessageText("");

      // Update conversation's last message
      const updatedConversation = {
        ...activeConversation,
        lastMessage: createdMessage
      };
      await conversationService.update(activeConversation.conversationId, updatedConversation);
      setConversations(prev =>
        prev.map(c => c.conversationId === activeConversation.conversationId ? updatedConversation : c)
      );

      toast.success("Message sent");

      // Simulate typing indicator and auto-reply
      setTimeout(() => setIsTyping(true), 1000);
      setTimeout(async () => {
        setIsTyping(false);
        const replyMessage = {
          conversationId: activeConversation.conversationId,
          senderId: activeConversation.participants.find(p => p !== currentUser.userId),
          content: getAutoReply(messageText),
          type: "text",
          timestamp: new Date().toISOString(),
          status: "delivered"
        };
        const reply = await messageService.create(replyMessage);
        setMessages(prev => [...prev, reply]);
      }, 3000);

    } catch (err) {
      toast.error("Failed to send message");
    }
  };

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
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  return (
    <ChatInterfaceTemplate
      conversations={conversations}
      users={users}
      messages={messages}
      currentUser={currentUser}
      activeConversation={activeConversation}
      setActiveConversation={setActiveConversation}
      messageText={messageText}
      setMessageText={setMessageText}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      isTyping={isTyping}
      onlineUsers={onlineUsers}
      handleSendMessage={handleSendMessage}
      loading={loading}
      error={error}
    />
  );
};

export default HomePage;