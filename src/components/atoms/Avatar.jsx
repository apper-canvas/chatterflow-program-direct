import React from 'react';
import PropTypes from 'prop-types';

const Avatar = ({ src, alt, size, isOnline }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-24 w-24', // For welcome screen
  };

  return (
    <div className="relative">
      <img
        src={src || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
      {isOnline && (
        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-primary border-2 border-white rounded-full"></div>
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  isOnline: PropTypes.bool,
};

Avatar.defaultProps = {
  src: '',
  size: 'md',
  isOnline: false,
};

export default Avatar;