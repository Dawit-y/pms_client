import PropTypes from 'prop-types';
import { Col, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

const AsyncSelectField = ({
  fieldId,
  formik,
  value,
  onChange,
  onBlur,
  onKeyDown,
  touched,
  error,
  isRequired = true,
  className = 'col-md-4 mb-3',
  withCol = true,
  showLabel = true,
  label,
  options,
  optionMap = {},
  isLoading = false,
  isError = false,
  isDisabled = false,
}) => {
  const { t } = useTranslation();
  const controlId = `${fieldId}-control`;

  const fieldTouched = touched ?? formik?.touched?.[fieldId];
  const fieldError = error ?? formik?.errors?.[fieldId];
  const rawValue = formik ? formik?.values?.[fieldId] || '' : (value ?? '');
  const isInvalid = fieldTouched && !!fieldError;

  const PRIMARY = '#0c5c35';
  const DANGER = '#f46a6a';

  const normalizedOptions = Array.isArray(options)
    ? options
    : Object.entries(optionMap).map(([optValue, optLabel]) => ({
        value: optValue,
        label: t(optLabel),
      }));

  const selectedOption =
    normalizedOptions.find((o) => String(o.value) === String(rawValue)) ?? null;

  const handleChange = (selected) => {
    const nextValue = selected ? selected.value : '';
    formik?.setFieldValue?.(fieldId, nextValue);
    onChange?.(nextValue, selected);
  };

  const handleBlur = () => {
    formik?.setFieldTouched?.(fieldId, true);
    onBlur?.(fieldId);
  };

  const placeholder = isError
    ? t('Failed to load options')
    : `${t('Select')} ${label ?? t(fieldId)}`;

  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '38px',
      height: '38px',
      fontSize: '0.8125rem',
      borderColor: isInvalid ? DANGER : state.isFocused ? PRIMARY : '#ced4da',
      boxShadow: 'none',
      borderRadius: '0.375rem',
      '&:hover': {
        borderColor: isInvalid ? DANGER : '#ced4da',
      },
    }),
    valueContainer: (base) => ({
      ...base,
      height: '36px',
      padding: '0 8px',
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
      fontSize: '0.8125rem',
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: '36px',
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: '#ced4da',
      marginTop: '8px',
      marginBottom: '8px',
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      padding: '0 6px',
      color: state.isFocused ? PRIMARY : '#6c757d',
      '&:hover': {
        color: PRIMARY,
      },
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: '0 6px',
      color: '#6c757d',
      cursor: 'pointer',
      '&:hover': {
        color: DANGER,
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      fontSize: '0.8125rem',
      borderRadius: '0.375rem',
      border: '1px solid #ced4da',
      boxShadow: '0 4px 12px rgba(0,0,0,.1)',
    }),
    menuList: (base) => ({
      ...base,
      padding: '4px',
    }),
    option: (base, state) => ({
      ...base,
      fontSize: '0.8125rem',
      borderRadius: '0.25rem',
      padding: '6px 10px',
      backgroundColor: state.isSelected
        ? PRIMARY
        : state.isFocused
          ? 'rgba(12,92,53,.08)'
          : 'transparent',
      color: state.isSelected ? '#fff' : '#212529',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: 'rgba(12,92,53,.15)',
        color: '#212529',
      },
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: '0.8125rem',
      color: '#212529',
    }),
    placeholder: (base) => ({
      ...base,
      fontSize: '0.8125rem',
      color: '#6c757d',
    }),
    noOptionsMessage: (base) => ({
      ...base,
      fontSize: '0.8125rem',
      color: '#6c757d',
    }),
    loadingMessage: (base) => ({
      ...base,
      fontSize: '0.8125rem',
      color: '#6c757d',
    }),
  };

  const fieldBody = (
    <Form.Group controlId={controlId}>
      {showLabel && (
        <Form.Label>
          {label ?? t(fieldId)}{' '}
          {isRequired && (
            /*
             * aria-hidden hides the decorative "*" from screen readers;
             * isRequired is communicated via aria-required on the Select
             * input instead (see below).
             */
            <span style={{ color: DANGER }} aria-hidden="true">
              *
            </span>
          )}
        </Form.Label>
      )}

      <Select
        inputId={controlId}
        name={fieldId}
        options={normalizedOptions}
        value={selectedOption}
        onChange={handleChange}
        onBlur={handleBlur}
        /*
         * react-select exposes onKeyDown on the inner <input>.
         * We forward the prop so the parent form can listen for Enter.
         */
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        isDisabled={isLoading || isError || isDisabled}
        isLoading={isLoading}
        isClearable={true}
        styles={customStyles}
        noOptionsMessage={() => t('No options')}
        loadingMessage={() => `${t('Loading')}...`}
        /*
         * Accessibility props for the hidden <input> inside react-select.
         * aria-required lets assistive tech announce the field as mandatory.
         * aria-invalid surfaces validation state without relying solely on colour.
         */
        aria-required={isRequired}
        aria-invalid={isInvalid}
        aria-errormessage={isInvalid ? `${controlId}-error` : undefined}
        /*
         * When the dropdown is disabled due to a load error, give screen
         * readers a meaningful explanation instead of silence.
         */
        aria-label={
          isError
            ? `${label ?? t(fieldId)} — ${t('Failed to load options')}`
            : undefined
        }
      />

      {isInvalid && (
        <div
          id={`${controlId}-error`}
          role="alert"
          style={{
            display: 'block',
            width: '100%',
            marginTop: '0.25rem',
            fontSize: '0.65rem',
            color: DANGER,
          }}
        >
          {fieldError}
        </div>
      )}
    </Form.Group>
  );

  if (!withCol) {
    return fieldBody;
  }

  return <Col className={className}>{fieldBody}</Col>;
};

AsyncSelectField.propTypes = {
  fieldId: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  /** Forwarded to react-select's onKeyDown for Enter-to-search support */
  onKeyDown: PropTypes.func,
  touched: PropTypes.bool,
  error: PropTypes.string,
  formik: PropTypes.shape({
    values: PropTypes.object,
    setFieldValue: PropTypes.func,
    setFieldTouched: PropTypes.func,
    touched: PropTypes.object,
    errors: PropTypes.object,
  }),
  isRequired: PropTypes.bool,
  className: PropTypes.string,
  withCol: PropTypes.bool,
  showLabel: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
    })
  ),
  optionMap: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

export default AsyncSelectField;
