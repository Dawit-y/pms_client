import PropTypes from 'prop-types';
import { Col, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Input = ({
  type = 'text',
  fieldId,
  formik,
  label,
  onChange,
  placeholder,
  maxLength = 200,
  className = 'col-md-4 mb-3',
  isRequired = true,
  rows = 3,
  cols,
}) => {
  const { t } = useTranslation();

  const touched = formik.touched[fieldId];
  const error = formik.errors[fieldId];
  const value = formik.values[fieldId];

  const isTextarea = type === 'textarea';
  const isCheckbox = type === 'checkbox';

  return (
    <Col className={className}>
      <Form.Group controlId={fieldId}>
        {isCheckbox ? (
          <Col className={`${className} d-flex align-items-center my-auto`}>
            <Form.Group controlId={fieldId} className="mb-0 w-100">
              <Form.Check
                type="checkbox"
                name={fieldId}
                label={
                  <>
                    {label || t(fieldId)}{' '}
                    {isRequired && <span className="text-danger">*</span>}
                  </>
                }
                checked={!!formik.values[fieldId]}
                onChange={(e) =>
                  formik.setFieldValue(fieldId, e.target.checked)
                }
                onBlur={formik.handleBlur}
                isInvalid={formik.touched[fieldId] && !!formik.errors[fieldId]}
                feedback={formik.errors[fieldId]}
                feedbackType="invalid"
              />
            </Form.Group>
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          </Col>
        ) : (
          <>
            <Form.Label>
              {label || t(fieldId)}{' '}
              {isRequired && <span className="text-danger">*</span>}
            </Form.Label>
            <Form.Control
              as={isTextarea ? 'textarea' : 'input'}
              type={isTextarea ? undefined : type}
              name={fieldId}
              placeholder={placeholder ?? label ?? t(fieldId)}
              onChange={onChange ?? formik.handleChange}
              onBlur={formik.handleBlur}
              value={value || ''}
              isInvalid={touched && !!error}
              maxLength={maxLength}
              rows={isTextarea ? rows : undefined}
              cols={isTextarea ? cols : undefined}
            />
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          </>
        )}
      </Form.Group>
    </Col>
  );
};

Input.propTypes = {
  type: PropTypes.oneOf(['text', 'textarea', 'checkbox']),
  fieldId: PropTypes.string.isRequired,
  formik: PropTypes.object.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  className: PropTypes.string,
  isRequired: PropTypes.bool,
  rows: PropTypes.number,
  cols: PropTypes.number,
};

export default Input;
