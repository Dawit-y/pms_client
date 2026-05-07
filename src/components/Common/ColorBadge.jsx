import PropTypes from 'prop-types';

// Simple custom Badge component
const Badge = ({ children, className = '', style = {} }) => {
  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        padding: '0.35em 0.65em',
        fontSize: '0.75em',
        fontWeight: 600,
        lineHeight: 1,
        borderRadius: '0.375rem',
        whiteSpace: 'nowrap',
        verticalAlign: 'baseline',
        ...style,
      }}
    >
      {children}
    </span>
  );
};

// Helper to determine text color based on hex background
const getContrastColor = (hexColor) => {
  if (!hexColor) return '#000000';

  let hex = hexColor.replace('#', '');

  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  if (hex.length !== 6) return '#000000';

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? '#000000' : '#ffffff';
};

const ColorBadge = ({ color, children, className = '' }) => {
  if (!color) {
    return <Badge className={className}>{children}</Badge>;
  }

  const textColor = getContrastColor(color);

  return (
    <Badge
      className={className}
      style={{
        backgroundColor: color,
        color: textColor,
        border: `1px solid ${textColor === '#ffffff' ? 'transparent' : '#cccccc'}`,
      }}
    >
      {children}
    </Badge>
  );
};

Badge.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

ColorBadge.propTypes = {
  color: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default ColorBadge;
