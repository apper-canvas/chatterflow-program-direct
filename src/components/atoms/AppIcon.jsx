import React from 'react';
import PropTypes from 'prop-types';
import * as FeatherIcons from 'react-feather';

const AppIcon = ({ name, className }) => {
  const IconComponent = FeatherIcons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found.`);
    return null; // Or return a default icon
  }

  return <IconComponent className={className} />;
};

AppIcon.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
};

AppIcon.defaultProps = {
  name: 'AlertCircle',
  className: '',
};

export default AppIcon;