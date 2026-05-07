import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../hooks/useAuth';
import { useFetchSectorStructures } from '../../queries/sectors_query';
import AsyncSelectField from './AsyncSelectField';

/**
 * Cascading dropdowns for Sector → Sub‑Sector → Project Type.
 * Fetches all sector data internally using useFetchSectorStructures.
 */
const SectorCascadingDropdowns = ({
  formik,
  sectorField,
  subSectorField,
  projectTypeField,
  required = false,
  disabled = false,
  layout = 'horizontal',
  colSizes = { md: 4 },
  hideLabels = false,
}) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { userId } = useAuth();
  const { sectors, subSectors, projectTypes, isLoading } =
    useFetchSectorStructures(userId);

  // Memoized filtered lists based on selected parent
  const sectorValue = formik?.values?.[sectorField];
  const filteredSubSectors = useMemo(() => {
    const parentId = sectorValue;
    if (!parentId) return [];
    return subSectors.filter(
      (item) => String(item.parentId) === String(parentId)
    );
  }, [sectorValue, subSectors]);

  const subSectorValue = formik?.values?.[subSectorField];
  const filteredProjectTypes = useMemo(() => {
    const parentId = subSectorValue;
    if (!parentId) return [];
    return projectTypes.filter(
      (item) => String(item.parentId) === String(parentId)
    );
  }, [subSectorValue, projectTypes]);

  // Clear dependent fields when parent changes
  const handleSectorChange = (value) => {
    formik?.setFieldValue(sectorField, value);
    formik?.setFieldValue(subSectorField, '');
    formik?.setFieldValue(projectTypeField, '');
  };

  const handleSubSectorChange = (value) => {
    formik?.setFieldValue(subSectorField, value);
    formik?.setFieldValue(projectTypeField, '');
  };

  // Helper for error display
  const getFormikError = (fieldName) => {
    return formik?.touched?.[fieldName] && formik?.errors?.[fieldName]
      ? formik.errors[fieldName]
      : null;
  };

  const toOptionMap = (list) =>
    list.reduce((acc, option) => {
      acc[option.id] =
        lang === 'en'
          ? option.prc_name_en
          : lang === 'am'
            ? option.prc_name_am
            : option.name;
      return acc;
    }, {});

  const sectorOptions = toOptionMap(sectors);
  const subSectorOptions = toOptionMap(filteredSubSectors);
  const projectTypeOptions = toOptionMap(filteredProjectTypes);

  const renderDropdown = (
    fieldName,
    optionMap,
    customOnChange = null,
    isDisabledByDependency = false
  ) => (
    <AsyncSelectField
      fieldId={fieldName}
      formik={formik}
      optionMap={optionMap}
      onChange={customOnChange}
      touched={!!formik?.touched?.[fieldName]}
      error={getFormikError(fieldName)}
      isRequired={required}
      withCol={false}
      showLabel={!hideLabels}
      isLoading={isLoading}
      isDisabled={disabled || isDisabledByDependency}
    />
  );

  // Layouts
  const renderVertical = () => (
    <>
      {renderDropdown(sectorField, sectorOptions, handleSectorChange)}
      {renderDropdown(
        subSectorField,
        subSectorOptions,
        handleSubSectorChange,
        !formik?.values?.[sectorField]
      )}
      {renderDropdown(
        projectTypeField,
        projectTypeOptions,
        null,
        !formik?.values?.[subSectorField]
      )}
    </>
  );

  const renderHorizontal = () => (
    <Row>
      <Col {...colSizes}>
        {renderDropdown(sectorField, sectorOptions, handleSectorChange)}
      </Col>
      <Col {...colSizes}>
        {renderDropdown(
          subSectorField,
          subSectorOptions,
          handleSubSectorChange,
          !formik?.values?.[sectorField]
        )}
      </Col>
      <Col {...colSizes}>
        {renderDropdown(
          projectTypeField,
          projectTypeOptions,
          null,
          !formik?.values?.[subSectorField]
        )}
      </Col>
    </Row>
  );

  return layout === 'horizontal' ? renderHorizontal() : renderVertical();
};

SectorCascadingDropdowns.propTypes = {
  /** Formik instance */
  formik: PropTypes.shape({
    values: PropTypes.object,
    errors: PropTypes.object,
    touched: PropTypes.object,
    handleChange: PropTypes.func,
    handleBlur: PropTypes.func,
    setFieldValue: PropTypes.func,
  }).isRequired,

  /** Field name for sector dropdown */
  sectorField: PropTypes.string.isRequired,

  /** Field name for sub‑sector dropdown */
  subSectorField: PropTypes.string.isRequired,

  /** Field name for project type dropdown */
  projectTypeField: PropTypes.string.isRequired,

  /** Whether the fields are required */
  required: PropTypes.bool,

  /** Whether all dropdowns are disabled */
  disabled: PropTypes.bool,

  /** Layout orientation */
  layout: PropTypes.oneOf(['horizontal', 'vertical']),

  /** Column sizes for horizontal layout (React‑Bootstrap Col props) */
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

SectorCascadingDropdowns.defaultProps = {
  required: false,
  disabled: false,
  layout: 'horizontal',
  colSizes: { md: 4 },
  identifier: '',
};

export default SectorCascadingDropdowns;
