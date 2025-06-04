import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ value, onChange, placeholder, type, className, onKeyPress, ...props }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      className={`w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      {...props}
    />
  );
};

Input.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  onKeyPress: PropTypes.func,
};

Input.defaultProps = {
  placeholder: '',
  type: 'text',
  className: '',
  onKeyPress: () => {},
};

export default Input;