import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Avatar from '../atoms/Avatar';
import Text from '../atoms/Text';

const ConversationListItem = ({
  conversation,
  otherUser,
  isActive,
  isOnline,
  onClick,
  formatConversationTime,
}) => {
  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(37, 211, 102, 0.05)" }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(conversation)}
      className={`p-4 cursor-pointer transition-colors ${
        isActive ? 'bg-primary bg-opacity-10 border-r-4 border-primary' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Avatar src={otherUser.profilePhoto} alt={otherUser.displayName} size="lg" isOnline={isOnline} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <Text as="h3" className="font-medium text-gray-900 truncate">
              {otherUser.displayName}
            </Text>
            <Text className="text-xs text-gray-500">
              {conversation.lastMessage && formatConversationTime(conversation.lastMessage.timestamp)}
            </Text>
          </div>
          <Text className="text-sm text-gray-600 truncate">
            {conversation.lastMessage?.content || "No messages yet"}
          </Text>
        </div>
        {conversation.unreadCount > 0 && (
          <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center">
            <Text className="text-xs text-white font-medium">
              {conversation.unreadCount}
            </Text>
          </div>
        )}
      </div>
    </motion.div>
  );
};

ConversationListItem.propTypes = {
  conversation: PropTypes.object.isRequired,
  otherUser: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  isOnline: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  formatConversationTime: PropTypes.func.isRequired,
};

export default ConversationListItem;