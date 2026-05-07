import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Form, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const formatNumber = (value, allowDecimal, decimalPlaces = 6) => {
  if (value === undefined || value === null || value === '') return '';

  // Handle string values that might be empty or just a decimal point
  if (typeof value === 'string' && (value === '' || value === '.'))
    return value;

  // If it's a string with decimal places, preserve them exactly as entered
  if (typeof value === 'string' && value.includes('.')) {
    const parts = value.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts[1] !== undefined
      ? `${integerPart}.${parts[1]}`
      : `${integerPart}.`;
  }

  const number = parseFloat(value);
  if (isNaN(number)) return '';

  return allowDecimal
    ? number.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimalPlaces,
      })
    : number.toLocaleString();
};

const NumberField = ({
  formik,
  fieldId,
  label,
  isRequired = true,
  allowDecimal = false,
  decimalPlaces = 6,
  className = 'col-md-4 mb-3',
  infoText,
  disabled,
}) => {
  const { t } = useTranslation();
  const rawValue = formik.values[fieldId];

  const [displayValue, setDisplayValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Update display value when rawValue changes externally
  useEffect(() => {
    if (!isEditing) {
      //eslint-disable-next-line
      setDisplayValue(formatNumber(rawValue, allowDecimal, decimalPlaces));
    }
  }, [rawValue, allowDecimal, decimalPlaces, isEditing]);

  const valueToShow = isEditing
    ? displayValue
    : formatNumber(rawValue, allowDecimal, decimalPlaces);

  const handleChange = (e) => {
    const inputValue = e.target.value;

    // Remove all commas for validation and storage
    const raw = inputValue.replace(/,/g, '');

    let regex;
    if (allowDecimal) {
      regex = new RegExp(`^\\d*\\.?\\d{0,${decimalPlaces}}$`);
    } else {
      regex = /^\d*$/;
    }

    // Special handling for decimal point
    if (allowDecimal && raw === '.') {
      formik.setFieldValue(fieldId, '.');
      setDisplayValue('.');
      setIsEditing(true);
      return;
    }

    if (!regex.test(raw)) return;

    // Store the raw value without formatting
    formik.setFieldValue(fieldId, raw);

    // Format for display
    let formatted = raw;
    if (raw !== '') {
      if (allowDecimal && raw.includes('.')) {
        // For numbers with decimal, format the integer part with commas
        const parts = raw.split('.');
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        formatted =
          parts[1] !== undefined
            ? `${integerPart}.${parts[1]}`
            : `${integerPart}.`;
      } else if (raw !== '') {
        // For whole numbers, add commas
        formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    }

    setDisplayValue(formatted);
    setIsEditing(true);
  };

  const handleBlur = (e) => {
    setIsEditing(false);

    // On blur, preserve the value exactly as entered
    const currentValue = formik.values[fieldId];

    if (
      currentValue !== '' &&
      currentValue !== undefined &&
      currentValue !== null
    ) {
      // If it's a valid number string, keep it as is
      if (typeof currentValue === 'string') {
        const num = parseFloat(currentValue);
        if (!isNaN(num)) {
          // Keep the exact string value to preserve decimal places
          formik.setFieldValue(fieldId, currentValue);
        }
      }
    }

    formik.handleBlur(e);
  };

  const handleFocus = () => {
    // When focusing, show the raw unformatted value for editing
    const rawValue = formik.values[fieldId];
    setDisplayValue(rawValue || '');
    setIsEditing(true);
  };

  return (
    <Col className={className}>
      <Form.Group controlId={fieldId}>
        <Form.Label>
          {label || t(fieldId)}{' '}
          {isRequired && <span className="text-danger">*</span>}
        </Form.Label>

        <Form.Control
          type="text"
          inputMode={allowDecimal ? 'decimal' : 'numeric'}
          placeholder={t(fieldId)}
          name={fieldId}
          value={valueToShow}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          isInvalid={formik.touched[fieldId] && !!formik.errors[fieldId]}
          disabled={disabled}
        />

        <Form.Control.Feedback type="invalid">
          {formik.errors[fieldId]}
        </Form.Control.Feedback>

        {infoText && <Form.Text className="text-muted">{infoText}</Form.Text>}
      </Form.Group>
    </Col>
  );
};

NumberField.propTypes = {
  formik: PropTypes.object.isRequired,
  isRequired: PropTypes.bool,
  fieldId: PropTypes.string.isRequired,
  allowDecimal: PropTypes.bool,
  decimalPlaces: PropTypes.number,
  className: PropTypes.string,
  infoText: PropTypes.string,
  label: PropTypes.string,
};

export default NumberField;
