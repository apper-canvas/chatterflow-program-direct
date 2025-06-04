import React from 'react';
import PropTypes from 'prop-types';
import GlobalHeader from '../organisms/GlobalHeader';
import ConversationList from '../organisms/ConversationList';
import ChatAreaHeader from '../organisms/ChatAreaHeader';
import ChatMessages from '../organisms/ChatMessages';
import ChatInputArea from '../organisms/ChatInputArea';
import WelcomeScreen from '../organisms/WelcomeScreen';
import AppIcon from '../atoms/AppIcon';
import Text from '../atoms/Text';

const ChatInterfaceTemplate = ({
  conversations,
  users,
  messages,
  currentUser,
  activeConversation,
  setActiveConversation,
  messageText,
  setMessageText,
  searchQuery,
  setSearchQuery,
  isTyping,
  onlineUsers,
  handleSendMessage,
  loading,
  error,
}) => {
  const getUserById = (userId) => {
    return users.find(u => u.userId === userId) || { displayName: "Unknown User", profilePhoto: "" };
  };

  const getOtherUser = (conversation) => {
    const otherUserId = conversation.participants?.find(p => p !== currentUser.userId);
    return getUserById(otherUserId);
  };

  const conversationMessages = messages.filter(msg =>
    msg.conversationId === activeConversation?.conversationId
  ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AppIcon name="MessageCircle" className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <Text className="text-gray-600">Loading ChatterFlow...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <AppIcon name="AlertTriangle" className="h-12 w-12 mx-auto mb-4" />
          <Text>Error: {error}</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <GlobalHeader />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Conversations List */}
        <div className={`w-full md:w-80 bg-white border-r border-gray-200 flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
          <ConversationList
            conversations={conversations}
            users={users}
            currentUser={currentUser}
            activeConversation={activeConversation}
            setActiveConversation={setActiveConversation}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onlineUsers={onlineUsers}
          />
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
          {activeConversation ? (
            <>
              <ChatAreaHeader
                otherUser={getOtherUser(activeConversation)}
                isOnline={onlineUsers.has(getOtherUser(activeConversation).userId)}
                onBackClick={() => setActiveConversation(null)}
              />
              <ChatMessages
                messages={conversationMessages}
                currentUser={currentUser}
                isTyping={isTyping}
              />
              <ChatInputArea
                messageText={messageText}
                onMessageTextChange={(e) => setMessageText(e.target.value)}
                onSendMessage={handleSendMessage}
              />
            </>
          ) : (
            <WelcomeScreen />
          )}
        </div>
      </div>
    </div>
  );
};

ChatInterfaceTemplate.propTypes = {
  conversations: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  messages: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
  activeConversation: PropTypes.object,
  setActiveConversation: PropTypes.func.isRequired,
  messageText: PropTypes.string.isRequired,
  setMessageText: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  isTyping: PropTypes.bool.isRequired,
  onlineUsers: PropTypes.object.isRequired,
  handleSendMessage: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

ChatInterfaceTemplate.defaultProps = {
  activeConversation: null,
  error: null,
};

export default ChatInterfaceTemplate;