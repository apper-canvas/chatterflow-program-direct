import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const Button = ({ 
  children = null, 
  onClick = () => {},
  className = '', 
  disabled = false, 
  variant = 'primary', 
  icon: Icon = null, 
  ...props 
}) => {
  const baseClasses = 'p-2 rounded-full transition-colors flex items-center justify-center';
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-dark text-white',
    secondary: 'bg-gray-100 text-gray-400',
    icon: 'hover:bg-white hover:bg-opacity-10 text-white', // For header icons
    'icon-alt': 'hover:bg-gray-100 text-gray-600', // For chat header icons
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      {...props}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {children}
    </motion.button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'secondary', 'icon', 'icon-alt']),
  icon: PropTypes.elementType, // For React Feather icon component
};

export default Button;