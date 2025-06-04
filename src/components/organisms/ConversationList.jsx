import React from 'react';
import PropTypes from 'prop-types';
import { isToday, isYesterday, format } from 'date-fns';
import SearchInput from '../atoms/SearchInput';
import AppIcon from '../atoms/AppIcon';
import Text from '../atoms/Text';
import ConversationListItem from '../molecules/ConversationListItem';

const ConversationList = ({
  conversations,
  users,
  currentUser,
  activeConversation,
  setActiveConversation,
  searchQuery,
  setSearchQuery,
  onlineUsers,
}) => {
  // Get user by ID
  const getUserById = (userId) => {
    return users.find(u => u.userId === userId) || { displayName: "Unknown User", profilePhoto: "" };
  };

  // Get other user in conversation
  const getOtherUser = (conversation) => {
    const otherUserId = conversation.participants?.find(p => p !== currentUser.userId);
    return getUserById(otherUserId);
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => {
    const otherUser = getOtherUser(conv);
    return otherUser?.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
  });

  // Format conversation time
  const formatConversationTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'dd/MM');
    }
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <SearchInput
        placeholder="Search conversations..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto chat-scroll mt-4">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <AppIcon name="MessageCircle" className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <Text>No conversations found</Text>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((conversation) => {
              const otherUser = getOtherUser(conversation);
              const isActive = activeConversation?.conversationId === conversation.conversationId;
              const isOnline = onlineUsers.has(otherUser.userId);

              return (
                <ConversationListItem
                  key={conversation.conversationId}
                  conversation={conversation}
                  otherUser={otherUser}
                  isActive={isActive}
                  isOnline={isOnline}
                  onClick={setActiveConversation}
                  formatConversationTime={formatConversationTime}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

ConversationList.propTypes = {
  conversations: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
  activeConversation: PropTypes.object,
  setActiveConversation: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  onlineUsers: PropTypes.object.isRequired,
};

ConversationList.defaultProps = {
  activeConversation: null,
};

export default ConversationList;