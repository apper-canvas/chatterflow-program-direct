import React from 'react';
import { motion } from 'framer-motion';
import AppIcon from '../atoms/AppIcon';
import Text from '../atoms/Text';

const WelcomeScreen = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-surface-50 to-surface-100">
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <AppIcon name="MessageCircle" className="h-24 w-24 text-primary mx-auto mb-6" />
        </motion.div>
        <Text as="h2" className="text-2xl font-bold text-gray-900 mb-3">
          Welcome to ChatterFlow
        </Text>
        <Text className="text-gray-600 mb-6">
          Select a conversation from the sidebar to start chatting with your contacts.
        </Text>
        <Text className="text-sm text-gray-500">
          💬 Instant messaging • 🔒 End-to-end encryption • 📱 Cross-platform sync
        </Text>
      </div>
    </div>
  );
};

export default WelcomeScreen;