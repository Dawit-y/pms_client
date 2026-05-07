import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { post } from '../../helpers/axios';
import AsyncSelectField from './AsyncSelectField';

const fetchAddressByParent = async (parentId) => {
  const response = await post(`addressbyparent?parent_id=${parentId}`);
  return response?.data || [];
};

const CascadingDropdowns = ({
  formik,
  dropdown1name,
  dropdown2name,
  dropdown3name,
  requiredFields = {
    region: false,
    zone: false,
    woreda: false,
  },
  disabled = false,
  layout = 'horizontal',
  colSizes = { md: 4 },
}) => {
  const { t } = useTranslation();
  const OROMIA_ID = '1';

  const isFieldRequired = (field) => {
    if (requiredFields[field] !== undefined) {
      return requiredFields[field];
    }
    return false;
  };

  // Set default region value to Oromia on initial load
  useEffect(() => {
    if (!formik?.values?.[dropdown1name]) {
      formik?.setFieldValue?.(dropdown1name, OROMIA_ID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdown1name]);

  // Fetch zones for the selected region
  const {
    data: zones = [],
    isLoading: loadingZones,
    refetch: refetchZones,
  } = useQuery({
    queryKey: ['zones', formik?.values?.[dropdown1name]],
    queryFn: () => fetchAddressByParent(formik?.values?.[dropdown1name]),
    enabled: !!formik?.values?.[dropdown1name],
  });

  // Fetch woredas for the selected zone
  const {
    data: woredas = [],
    isLoading: loadingWoredas,
    refetch: refetchWoredas,
  } = useQuery({
    queryKey: ['woredas', formik?.values?.[dropdown2name]],
    queryFn: () => fetchAddressByParent(formik?.values?.[dropdown2name]),
    enabled: !!formik?.values?.[dropdown2name],
  });

  // Handle region change
  const handleRegionChange = (value) => {
    formik?.setFieldValue(dropdown1name, value);
    formik?.setFieldValue(dropdown2name, '');
    formik?.setFieldValue(dropdown3name, '');
    refetchZones();
  };

  // Handle zone change
  const handleZoneChange = (value) => {
    formik?.setFieldValue(dropdown2name, value);
    formik?.setFieldValue(dropdown3name, '');
    refetchWoredas();
  };

  // Helper function to get formik error state
  const getFormikError = (fieldName) => {
    return formik?.touched?.[fieldName] && formik?.errors?.[fieldName]
      ? formik.errors[fieldName]
      : null;
  };

  // Render dropdown group component
  const renderDropdown = (
    fieldName,
    label,
    optionMap,
    loading = false,
    hasError = false,
    disabledCondition = false,
    customHandleChange = null,
    isRegion = false,
    isRequired = false
  ) => {
    const handleChange = (value) => {
      if (customHandleChange) {
        customHandleChange(value);
        return;
      }
      formik?.setFieldValue?.(fieldName, value);
    };

    return (
      <AsyncSelectField
        fieldId={fieldName}
        formik={formik}
        label={t(label)}
        optionMap={optionMap}
        onChange={handleChange}
        touched={!!formik?.touched?.[fieldName]}
        error={getFormikError(fieldName)}
        isRequired={isRequired}
        withCol={false}
        isLoading={!isRegion && loading}
        isError={!isRegion && hasError}
        isDisabled={disabled || disabledCondition}
      />
    );
  };

  // Render vertical layout
  const renderVerticalLayout = () => (
    <>
      <Col className="col-md-12 mb-3">
        {renderDropdown(
          dropdown1name,
          'region',
          { 1: 'Oromia' },
          false,
          false,
          false,
          (value) => handleRegionChange(value),
          true,
          isFieldRequired('region')
        )}
      </Col>
      <Col className="col-md-12 mb-3">
        {renderDropdown(
          dropdown2name,
          'zone',
          zones.reduce((acc, item) => ({ ...acc, [item.id]: item.name }), {}),
          loadingZones,
          false,
          !formik?.values?.[dropdown1name],
          (value) => handleZoneChange(value),
          false,
          isFieldRequired('zone')
        )}
      </Col>
      <Col className="col-md-12 mb-3">
        {renderDropdown(
          dropdown3name,
          'woreda',
          woredas.reduce((acc, item) => ({ ...acc, [item.id]: item.name }), {}),
          loadingWoredas,
          false,
          !formik?.values?.[dropdown2name],
          null,
          false,
          isFieldRequired('woreda')
        )}
      </Col>
    </>
  );

  // Render horizontal layout
  const renderHorizontalLayout = () => (
    <Row className="mb-3">
      <Col {...colSizes}>
        {renderDropdown(
          dropdown1name,
          'region',
          { 1: 'Oromia' },
          false,
          false,
          false,
          (value) => handleRegionChange(value),
          true,
          isFieldRequired('region')
        )}
      </Col>
      <Col {...colSizes}>
        {renderDropdown(
          dropdown2name,
          'zone',
          zones.reduce((acc, item) => ({ ...acc, [item.id]: item.name }), {}),
          loadingZones,
          false,
          !formik?.values?.[dropdown1name],
          (value) => handleZoneChange(value),
          false,
          isFieldRequired('zone')
        )}
      </Col>
      <Col {...colSizes}>
        {renderDropdown(
          dropdown3name,
          'woreda',
          woredas.reduce((acc, item) => ({ ...acc, [item.id]: item.name }), {}),
          loadingWoredas,
          false,
          !formik?.values?.[dropdown2name],
          null,
          false,
          isFieldRequired('woreda')
        )}
      </Col>
    </Row>
  );

  return (
    <>
      {layout === 'horizontal'
        ? renderHorizontalLayout()
        : renderVerticalLayout()}
    </>
  );
};

CascadingDropdowns.propTypes = {
  /** Formik instance for form state management */
  formik: PropTypes.shape({
    values: PropTypes.object,
    errors: PropTypes.object,
    touched: PropTypes.object,
    handleChange: PropTypes.func,
    handleBlur: PropTypes.func,
    setFieldValue: PropTypes.func,
  }).isRequired,

  /** Name for the first dropdown (region) */
  dropdown1name: PropTypes.string.isRequired,

  /** Name for the second dropdown (zone) */
  dropdown2name: PropTypes.string.isRequired,

  /** Name for the third dropdown (woreda) */
  dropdown3name: PropTypes.string.isRequired,

  /** Global required flag for backward compatibility */
  required: PropTypes.bool,

  /** Individual required status for each field */
  requiredFields: PropTypes.shape({
    region: PropTypes.bool,
    zone: PropTypes.bool,
    woreda: PropTypes.bool,
  }),

  /** Whether the dropdowns are disabled */
  disabled: PropTypes.bool,

  /** Layout type: 'horizontal' or 'vertical' */
  layout: PropTypes.oneOf(['horizontal', 'vertical']),

  /** Column sizes for horizontal layout (React-Bootstrap Col props) */
  colSizes: PropTypes.shape({
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number,
    xxl: PropTypes.number,
  }),

  /** Unique identifier for multiple instances on the same page */
  identifier: PropTypes.string,
};

CascadingDropdowns.defaultProps = {
  required: false,
  requiredFields: {
    region: false,
    zone: false,
    woreda: false,
  },
  disabled: false,
  layout: 'horizontal',
  colSizes: { md: 4 },
  identifier: '',
};

export default CascadingDropdowns;
