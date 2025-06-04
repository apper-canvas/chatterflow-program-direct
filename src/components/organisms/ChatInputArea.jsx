import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import AppIcon from '../atoms/AppIcon';

const ChatInputArea = ({ messageText, onMessageTextChange, onSendMessage }) => {
  const isMessageEmpty = !messageText.trim();

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center space-x-3">
        <Button variant="icon-alt">
          <AppIcon name="Paperclip" className="h-5 w-5 text-gray-600" />
        </Button>
        <div className="flex-1 relative">
          <Input
            value={messageText}
            onChange={onMessageTextChange}
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            placeholder="Type a message..."
            className="pr-12"
          />
          <Button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1" variant="icon-alt">
            <AppIcon name="Smile" className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
        <Button
          onClick={onSendMessage}
          disabled={isMessageEmpty}
          variant={isMessageEmpty ? 'secondary' : 'primary'}
          icon={AppIcon}
          name={isMessageEmpty ? "Mic" : "Send"}
        />
      </div>
    </div>
  );
};

ChatInputArea.propTypes = {
  messageText: PropTypes.string.isRequired,
  onMessageTextChange: PropTypes.func.isRequired,
  onSendMessage: PropTypes.func.isRequired,
};

export default ChatInputArea;