import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const IconButton = ({
  color = 'light',
  icon,
  onClick,
  size = 24,
  className = '',
  ...rest
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'btn',
        `btn-${color}`,
        'p-0',
        'd-flex',
        'align-items-center',
        'justify-content-center',
        className
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size * 0.6}px`,
      }}
      {...rest}
    >
      {icon}
    </button>
  );
};

IconButton.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  size: PropTypes.number,
  className: PropTypes.string,
};

export default IconButton;
