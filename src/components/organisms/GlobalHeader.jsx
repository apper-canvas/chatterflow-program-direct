import React from 'react';
import AppIcon from '../atoms/AppIcon';
import Button from '../atoms/Button';
import Text from '../atoms/Text';

const GlobalHeader = () => {
  return (
    <header className="bg-secondary shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <AppIcon name="MessageCircle" className="h-8 w-8 text-white" />
        <Text as="h1" className="text-xl font-bold text-white">ChatterFlow</Text>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="icon">
          <AppIcon name="Settings" className="h-5 w-5 text-white" />
        </Button>
      </div>
    </header>
  );
};

export default GlobalHeader;