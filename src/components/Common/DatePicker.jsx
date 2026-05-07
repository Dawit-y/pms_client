import { Form, Col } from 'react-bootstrap';
import 'react-ethiopian-calendar/dist/index.css';
import { EtCalendar } from 'react-ethiopian-calendar';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';

import { parseDateString, toYMDDateString } from '../../utils/commonMethods';

// Handle Excel serial date conversion (to be removed after DB cleanup)
const parseExcelSerialDate = (serialDate) => {
  if (typeof serialDate !== 'number') return null;

  try {
    // Excel dates are number of days since January 1, 1900
    const excelEpoch = new Date(1900, 0, 1);
    // Subtract 2 because Excel incorrectly considers 1900 as a leap year
    const jsDate = new Date(
      excelEpoch.getTime() + (serialDate - 2) * 24 * 60 * 60 * 1000
    );
    return jsDate;
  } catch (error) {
    console.warn('Failed to parse Excel serial date:', serialDate, error);
    return null;
  }
};

// Enhanced date parser that handles both string dates and Excel serial numbers
const enhancedParseDate = (rawValue) => {
  if (rawValue === null || rawValue === undefined || rawValue === '') {
    return null;
  }

  if (typeof rawValue === 'number') {
    return parseExcelSerialDate(rawValue);
  }

  return parseDateString(rawValue);
};

function DatePicker({
  isRequired = true,
  formik,
  fieldId,
  minDate,
  maxDate,
  label,
  disabled,
  className = 'col-md-4 mb-3',
}) {
  const { t } = useTranslation();

  const rawValue = formik?.values?.[fieldId] ?? '';
  const selectedDate = enhancedParseDate(rawValue);
  const hasValue =
    rawValue !== '' && rawValue !== null && rawValue !== undefined;

  const hasError = formik?.touched?.[fieldId] && formik?.errors?.[fieldId];

  const handleDateChange = (date) => {
    if (!date) return;

    const formatted = toYMDDateString(date);
    formik?.setFieldValue(fieldId, formatted, true);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    formik?.setFieldValue(fieldId, '', true);
    formik?.setFieldTouched(fieldId, true, false);
  };

  const parsedMinDate = enhancedParseDate(minDate);
  const parsedMaxDate = enhancedParseDate(maxDate);

  return (
    <Col className={className}>
      <Form.Label>
        {label ? t(label) : t(fieldId)}{' '}
        {isRequired && <span className="text-danger">*</span>}
      </Form.Label>

      <div
        className={hasError ? 'is-invalid' : ''}
        style={{ position: 'relative' }}
      >
        <EtCalendar
          value={selectedDate}
          onChange={handleDateChange}
          onBlur={formik?.handleBlur}
          calendarType
          fullWidth
          minDate={parsedMinDate}
          maxDate={parsedMaxDate}
          disabled={disabled}
          inputStyle={
            hasError
              ? {
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: '#f46a6a',
                }
              : {}
          }
          primaryColor={'#0c5c35'}
        />

        {/* Clear button — fades in when a value is present */}
        {hasValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear date"
            style={{
              position: 'absolute',
              top: '50%',
              right: '2.25rem', // sits just inside the calendar's own dropdown arrow
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '1.25rem',
              height: '1.25rem',
              padding: 0,
              border: 'none',
              borderRadius: '50%',
              background: 'var(--bs-secondary-bg, #e9ecef)',
              color: 'var(--bs-secondary-color, #6c757d)',
              cursor: 'pointer',
              lineHeight: 1,
              transition: 'background 0.15s, color 0.15s',
              zIndex: 3,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bs-danger, #dc3545)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                'var(--bs-secondary-bg, #e9ecef)';
              e.currentTarget.style.color =
                'var(--bs-secondary-color, #6c757d)';
            }}
          >
            <FaTimes size={9} />
          </button>
        )}
      </div>

      {hasError && (
        <div className="text-danger small mt-1">{formik.errors[fieldId]}</div>
      )}
    </Col>
  );
}

export default DatePicker;
