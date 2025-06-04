import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = () => {
  return (
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
  );
};

export default TypingIndicator;