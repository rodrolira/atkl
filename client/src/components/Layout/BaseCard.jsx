import React from 'react';
import PropTypes from 'prop-types';

const BaseCard = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-black max-w-sm border border-gray-200 rounded-lg shadow dark:border-green-500 relative ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

BaseCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string, // Permite personalizar clases adicionales si es necesario
};

export default BaseCard;
