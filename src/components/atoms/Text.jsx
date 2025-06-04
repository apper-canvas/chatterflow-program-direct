import React from 'react';
import PropTypes from 'prop-types';

const Text = ({ children, className = '', as: Component = 'p' }) => {
  const Tag = Component || 'p';
  return <Tag className={className}>{children}</Tag>;
};

Text.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  as: PropTypes.elementType,
};

export default Text;