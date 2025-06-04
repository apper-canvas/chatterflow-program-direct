import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence } from 'framer-motion';
import { isToday, isYesterday, format } from 'date-fns';
import MessageBubble from '../molecules/MessageBubble';
import TypingIndicator from '../molecules/TypingIndicator';

const ChatMessages = ({ messages, currentUser, isTyping }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Format message time
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'dd/MM/yyyy');
    }
  };

  return (
    <div
      className="flex-1 overflow-y-auto chat-scroll p-4 space-y-4"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f1f5f9' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundColor: '#f8fafc'
      }}
    >
      <AnimatePresence>
        {messages.map((message, index) => {
          const isOwn = message.senderId === currentUser.userId;
          const showTime = index === 0 ||
            new Date(message.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() > 300000; // 5 minutes

          return (
            <MessageBubble
              key={message.messageId}
              message={message}
              isOwn={isOwn}
              showTime={showTime}
              formatMessageTime={formatMessageTime}
            />
          );
        })}
      </AnimatePresence>

      {isTyping && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
};

ChatMessages.propTypes = {
  messages: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
  isTyping: PropTypes.bool.isRequired,
};

export default ChatMessages;