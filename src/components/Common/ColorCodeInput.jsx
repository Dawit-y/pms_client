import { Sketch } from '@uiw/react-color';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useState, useRef, useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

const ColorCodeInput = ({
  fieldId,
  formik,
  label,
  placeholder,
  className = 'col-md-4 mb-3',
  isRequired = true,
}) => {
  const { t } = useTranslation();
  const [showPicker, setShowPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const targetRef = useRef(null);
  const pickerRef = useRef(null);

  const touched = formik.touched[fieldId];
  const error = formik.errors[fieldId];
  const value = formik.values[fieldId] || '';

  const updatePickerPosition = useCallback(() => {
    if (targetRef.current && showPicker) {
      const rect = targetRef.current.getBoundingClientRect();
      setPickerPosition({
        top: rect.bottom + window.scrollY + 40,
        left: rect.left + window.scrollX + 40,
      });
    }
  }, [targetRef, showPicker]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showPicker &&
        targetRef.current &&
        !targetRef.current.contains(event.target) &&
        pickerRef.current &&
        !pickerRef.current.contains(event.target)
      ) {
        setShowPicker(false);
        formik.setFieldTouched(fieldId, true);
      }
    };

    const handleScroll = () => {
      if (showPicker) {
        updatePickerPosition();
      }
    };

    const handleResize = () => {
      if (showPicker) {
        updatePickerPosition();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [showPicker, formik, fieldId, updatePickerPosition]);

  // Update position when picker opens or scroll occurs
  useEffect(() => {
    if (showPicker) {
      updatePickerPosition();
    }
  }, [showPicker, updatePickerPosition]);

  return (
    <Col className={className}>
      <Form.Group controlId={fieldId}>
        <Form.Label>
          {label || t(fieldId)}{' '}
          {isRequired && <span className="text-danger">*</span>}
        </Form.Label>

        <div className="d-flex align-items-center">
          <div
            ref={targetRef}
            className="rounded me-2"
            style={{
              width: '38px',
              height: '38px',
              backgroundColor: value || '#ffffff',
              border: '1px solid #ced4da',
              cursor: 'pointer',
            }}
            onClick={() => setShowPicker(!showPicker)}
            data-tooltip="Choose Color"
          ></div>

          <Form.Control
            type="text"
            name={fieldId}
            placeholder={placeholder ?? '#000000'}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={value}
            isInvalid={touched && !!error}
            maxLength={7}
            autoComplete="off"
            onClick={() => setShowPicker(true)}
          />
        </div>

        {touched && !!error && (
          <div className="text-danger mt-1" style={{ fontSize: '0.875em' }}>
            {error}
          </div>
        )}

        {showPicker &&
          createPortal(
            <div
              ref={pickerRef}
              style={{
                position: 'absolute',
                top: `${pickerPosition.top}px`,
                left: `${pickerPosition.left}px`,
                zIndex: 9999,
              }}
              className="shadow-sm border-0"
            >
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                <Sketch
                  color={value || '#000000'}
                  onChange={(colorResult) => {
                    formik.setFieldValue(fieldId, colorResult.hex);
                  }}
                  disableAlpha={true}
                />
              </div>
            </div>,
            document.body
          )}
      </Form.Group>
    </Col>
  );
};

ColorCodeInput.propTypes = {
  fieldId: PropTypes.string.isRequired,
  formik: PropTypes.object.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  isRequired: PropTypes.bool,
};

export default ColorCodeInput;
