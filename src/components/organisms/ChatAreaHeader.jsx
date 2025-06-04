import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '../atoms/Avatar';
import AppIcon from '../atoms/AppIcon';
import Button from '../atoms/Button';
import Text from '../atoms/Text';

const ChatAreaHeader = ({ otherUser, isOnline, onBackClick }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Button
          onClick={onBackClick}
          className="md:hidden"
          variant="icon-alt"
          icon={AppIcon}
          name="ArrowLeft"
        >
          <AppIcon name="ArrowLeft" className="h-5 w-5 text-gray-600" />
        </Button>
        <Avatar src={otherUser.profilePhoto} alt={otherUser.displayName} size="md" />
        <div>
          <Text as="h2" className="font-medium text-gray-900">
            {otherUser.displayName}
          </Text>
          <Text className="text-sm text-gray-500">
            {isOnline ? 'Online' : 'Last seen recently'}
          </Text>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="icon-alt">
          <AppIcon name="Phone" className="h-5 w-5 text-gray-600" />
        </Button>
        <Button variant="icon-alt">
          <AppIcon name="Video" className="h-5 w-5 text-gray-600" />
        </Button>
        <Button variant="icon-alt">
          <AppIcon name="MoreVertical" className="h-5 w-5 text-gray-600" />
        </Button>
      </div>
    </div>
  );
};

ChatAreaHeader.propTypes = {
  otherUser: PropTypes.object.isRequired,
  isOnline: PropTypes.bool.isRequired,
  onBackClick: PropTypes.func.isRequired,
};

export default ChatAreaHeader;