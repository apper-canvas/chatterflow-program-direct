import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import AppIcon from '../atoms/AppIcon';
import Text from '../atoms/Text';

const MessageBubble = ({ message, isOwn, showTime, formatMessageTime }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-xs md:max-w-md lg:max-w-lg ${isOwn ? 'order-2' : 'order-1'}`}>
        {showTime && (
          <div className="text-center mb-2">
            <Text as="span" className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
              {formatMessageTime(message.timestamp)}
            </Text>
          </div>
        )}
        <div
          className={`px-4 py-2 rounded-bubble shadow-message ${
            isOwn
              ? 'bg-chat-sent text-gray-800 ml-4'
              : 'bg-chat-received text-gray-800 mr-4'
          }`}
        >
          <Text className="text-sm leading-relaxed">{message.content}</Text>
          <div className={`flex items-center mt-1 space-x-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <Text as="span" className="text-xs text-gray-500">
              {format(new Date(message.timestamp), 'HH:mm')}
            </Text>
            {isOwn && (
              <div className="flex space-x-1">
                {message.status === 'sent' && (
                  <AppIcon name="Check" className="h-3 w-3 text-gray-500" />
                )}
                {message.status === 'delivered' && (
                  <>
                    <AppIcon name="Check" className="h-3 w-3 text-gray-500" />
                    <AppIcon name="Check" className="h-3 w-3 text-gray-500 -ml-1" />
                  </>
                )}
                {message.status === 'read' && (
                  <>
                    <AppIcon name="Check" className="h-3 w-3 text-primary" />
                    <AppIcon name="Check" className="h-3 w-3 text-primary -ml-1" />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

MessageBubble.propTypes = {
  message: PropTypes.object.isRequired,
  isOwn: PropTypes.bool.isRequired,
  showTime: PropTypes.bool.isRequired,
  formatMessageTime: PropTypes.func.isRequired,
};

export default MessageBubble;