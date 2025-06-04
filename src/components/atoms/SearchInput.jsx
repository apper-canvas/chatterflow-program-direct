import React from 'react';
import PropTypes from 'prop-types';
import Input from './Input';
import AppIcon from './AppIcon';

const SearchInput = ({ value, onChange, placeholder, className }) => {
  return (
    <div className={`relative ${className}`}>
      <AppIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 pr-4"
      />
    </div>
  );
};

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

SearchInput.defaultProps = {
  placeholder: 'Search...',
  className: '',
};

export default SearchInput;