import React from 'react';
import PropTypes from 'prop-types';

const Text = ({ children, className, as: Component }) => {
  const Tag = Component || 'p';
  return <Tag className={className}>{children}</Tag>;
};

Text.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  as: PropTypes.elementType,
};

Text.defaultProps = {
  className: '',
  as: 'p',
};

export default Text;