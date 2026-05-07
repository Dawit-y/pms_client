import PropTypes from 'prop-types';
import { Form, InputGroup, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

/**
 * Reusable phone number input component for Formik forms
 * Automatically formats Ethiopian phone numbers with +251 prefix
 */
const PhoneInput = ({
  formik,
  fieldId,
  required = false,
  className = 'col-md-4 mb-3',
  showLabel = true,
  placeholder = 'Enter phone number',
  disabled = false,
  ...rest
}) => {
  const { t } = useTranslation();
  const handlePhoneChange = (e) => {
    const inputValue = e.target.value;
    // Remove leading zero and any non-digit characters
    let formattedValue = inputValue.replace(/^0/, '');
    formattedValue = formattedValue.replace(/[^\d]/g, '');
    // Limit to 9 digits (after +251)
    formattedValue = formattedValue.substring(0, 9);
    formik.setFieldValue(fieldId, formattedValue);
  };

  const isInvalid = formik.touched[fieldId] && formik.errors[fieldId];

  return (
    <Col className={className} {...rest}>
      {showLabel && (
        <Form.Label>
          {t(fieldId)} {required && <span className="text-danger">*</span>}
        </Form.Label>
      )}
      <InputGroup>
        <InputGroup.Text>{'+251'}</InputGroup.Text>
        <Form.Control
          type="text"
          name={fieldId}
          placeholder={placeholder}
          onChange={handlePhoneChange}
          onBlur={formik.handleBlur}
          value={formik.values[fieldId] || ''}
          isInvalid={isInvalid}
          disabled={disabled}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors[fieldId]}
        </Form.Control.Feedback>
      </InputGroup>
    </Col>
  );
};

PhoneInput.propTypes = {
  formik: PropTypes.object.isRequired, // Formik instance
  fieldId: PropTypes.string, // Field name in formik values
  label: PropTypes.string, // Label text
  required: PropTypes.bool, // Show required asterisk
  showLabel: PropTypes.bool, // Whether to show the label
  placeholder: PropTypes.string, // Input placeholder
  disabled: PropTypes.bool, // Disable input
};

export default PhoneInput;
