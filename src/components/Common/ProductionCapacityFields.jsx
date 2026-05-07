import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { ACTIVITY_TYPES } from '../../constants/constantTexts';
import { useLookups } from '../../queries/lookups_query';
import {
  LOOKUP_GROUPS,
  LOOKUP_TYPE_IDS,
} from '../../utils/constants/lookUpTypes';
import AsyncSelectField from './AsyncSelectField';
import Input from './Input';
import NumberField from './NumberField';

const OPERATIONAL_PROJECT_STATUS_ID = 194;

const ProductionCapacityFields = ({
  formik,
  fieldIds = {
    productDetail: 'ppc_product_detail',
    measurement: 'ppc_measurement',
    designCapacity: 'ppc_design_capacity',
    plannedCapacity: 'ppc_planned_capacity',
    actualCapacity: 'ppc_actual_capacity',
    plannedCapacityPercent: 'ppc_planned_capacity_percent',
    perfReasonId: 'ppc_perf_reason_id',
  },
  disabled = false,
  layout = 'horizontal',
  colSizes = { md: 6 },
  isRequired = true,
  activityType,
  projectStatus,
}) => {
  const { t } = useTranslation();

  const {
    lookupsByType,
    isLoading: lookupsLoading,
    getLookupLabel,
  } = useLookups(LOOKUP_GROUPS.PRODUCTION_CAPACITY_FIELDS);

  const formatNumberWithCommas = (value) => {
    if (!value && value !== 0) return '';
    return Number(value).toLocaleString('en-US');
  };

  // Helper function to get measurement unit display label
  const getMeasurementUnitLabel = (unitId) => {
    if (!unitId) return '';
    const lookupLabel = getLookupLabel(
      LOOKUP_TYPE_IDS.UNIT_OF_MEASUREMENT,
      unitId
    );
    if (lookupLabel) return lookupLabel;
    if (typeof unitId === 'string' && !lookupLabel) return unitId;
    return '';
  };

  const getInfoText = (fieldId, measurementUnitValue) => {
    const value = formik.values[fieldId];
    if (!value && value !== 0) return '';
    const formattedNumber = formatNumberWithCommas(value);
    const unitLabel = getMeasurementUnitLabel(measurementUnitValue);
    return unitLabel ? `${formattedNumber} ${unitLabel}` : formattedNumber;
  };

  const renderNumberField = (fieldId, options = {}) => {
    const { infoText, disabled: fieldDisabled } = options;
    return (
      <NumberField
        formik={formik}
        fieldId={fieldId}
        isRequired={isRequired}
        allowDecimal={true}
        className="mb-3"
        disabled={fieldDisabled !== undefined ? fieldDisabled : disabled}
        infoText={infoText}
      />
    );
  };

  const renderTextArea = (fieldId, options = {}) => {
    const { disabled: fieldDisabled } = options;
    return (
      <Input
        type="textarea"
        formik={formik}
        fieldId={fieldId}
        className="mb-3"
        disabled={fieldDisabled !== undefined ? fieldDisabled : disabled}
        isRequired={isRequired}
        rows={3}
        maxLength={500}
      />
    );
  };

  const renderMeasurementUnitField = () => {
    return (
      <AsyncSelectField
        formik={formik}
        fieldId={fieldIds.measurement}
        optionMap={lookupsByType[LOOKUP_TYPE_IDS.UNIT_OF_MEASUREMENT] ?? {}}
        isLoading={lookupsLoading}
        isRequired={isRequired}
        className="mb-3"
        disabled={disabled}
      />
    );
  };

  const shouldShowActualCapacity = () => {
    return (
      activityType === ACTIVITY_TYPES.MONITORING &&
      parseInt(projectStatus) === OPERATIONAL_PROJECT_STATUS_ID
    );
  };

  const shouldShowInitialRegistrationFields = () => {
    return activityType === ACTIVITY_TYPES.INITIAL_REGISTRATION;
  };

  const shouldShowMonitoringView = () => {
    return activityType === ACTIVITY_TYPES.MONITORING;
  };

  const getCurrentMeasurementUnit = () => {
    const formValue = formik.values[fieldIds.measurement];
    if (formValue) return formValue;
    return '';
  };

  const getPlannedCapacityDisplay = () => {
    const plannedCapacity = formik.values[fieldIds.plannedCapacity];
    const currentUnit = getCurrentMeasurementUnit();
    const measurementUnitDisplay = getMeasurementUnitLabel(currentUnit);

    if (!plannedCapacity && plannedCapacity !== 0) return t('not_specified');

    const formattedNumber = formatNumberWithCommas(plannedCapacity);
    return measurementUnitDisplay
      ? `${formattedNumber} ${measurementUnitDisplay}`
      : formattedNumber;
  };

  const getDesignCapacityDisplay = () => {
    const designCapacity = formik.values[fieldIds.designCapacity];
    const currentUnit = getCurrentMeasurementUnit();
    const measurementUnitDisplay = getMeasurementUnitLabel(currentUnit);

    if (!designCapacity && designCapacity !== 0) return t('not_specified');

    const formattedNumber = formatNumberWithCommas(designCapacity);
    return measurementUnitDisplay
      ? `${formattedNumber} ${measurementUnitDisplay}`
      : formattedNumber;
  };

  const calculatePerformancePercent = () => {
    const actualCapacity = formik.values[fieldIds.actualCapacity];
    const designCapacity = formik.values[fieldIds.designCapacity];

    if (!designCapacity || designCapacity === 0 || !actualCapacity) return null;

    const percent = (actualCapacity / designCapacity) * 100;
    return Math.min(100, Math.max(0, Math.round(percent * 100) / 100));
  };

  const getPerformanceStatusClass = (percent) => {
    if (percent < 50) return 'text-danger';
    if (percent < 75) return 'text-warning';
    return 'text-success';
  };

  const getProgressBarClass = (percent) => {
    if (percent < 50) return 'bg-danger';
    if (percent < 75) return 'bg-warning';
    return 'bg-success';
  };

  useEffect(() => {
    const actualCapacity = formik.values[fieldIds.actualCapacity];
    const plannedCapacity = formik.values[fieldIds.plannedCapacity];

    // Calculate and set the percent value
    if (plannedCapacity && actualCapacity) {
      const percent =
        (parseFloat(actualCapacity) / parseFloat(plannedCapacity)) * 100;
      const roundedPercent = Math.min(
        100,
        Math.max(0, Math.round(percent * 100) / 100)
      );
      formik.setFieldValue(fieldIds.plannedCapacityPercent, roundedPercent);
    } else {
      formik.setFieldValue(fieldIds.plannedCapacityPercent, null);
    }
    //eslint-disable-next-line
  }, [
    fieldIds.actualCapacity,
    fieldIds.plannedCapacity,
    fieldIds.plannedCapacityPercent,
    formik.values,
  ]);

  const renderMonitoringView = () => {
    const performancePercent = calculatePerformancePercent();
    const showPerformanceReason =
      performancePercent !== null && performancePercent < 50;
    const showActualCapacityField = shouldShowActualCapacity();
    const currentUnit = getCurrentMeasurementUnit();
    const measurementUnitDisplay = getMeasurementUnitLabel(currentUnit);

    return (
      <Row>
        {/* Left Column - Fields (70%) */}
        <Col xs={12} md={8} lg={7}>
          {/* Product Detail Text Area */}
          <Row>
            <Col xs={12}>{renderTextArea(fieldIds.productDetail)}</Col>
          </Row>

          <Row>
            <Col xs={12} md={6}>
              {renderMeasurementUnitField()}
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              {renderNumberField(fieldIds.designCapacity, {})}
            </Col>
            <Col xs={12} md={6}>
              {renderNumberField(fieldIds.plannedCapacity, {})}
            </Col>
          </Row>

          {/* Actual Capacity Field - Only shown when project status is operational */}
          {showActualCapacityField && (
            <Row>
              <Col xs={12} md={6}>
                <NumberField
                  formik={formik}
                  fieldId={fieldIds.actualCapacity}
                  isRequired={isRequired}
                  allowDecimal={true}
                  className="mb-3"
                  disabled={disabled}
                  infoText={`${t('ppc_measurement')}: ${measurementUnitDisplay}`}
                />
              </Col>
            </Row>
          )}

          {/* Performance Reason Dropdown - Only shown when performance is below 50% */}
          {showActualCapacityField && showPerformanceReason && (
            <Row>
              <AsyncSelectField
                formik={formik}
                fieldId={'ppc_perf_reason_id'}
                optionMap={
                  lookupsByType[LOOKUP_TYPE_IDS.PERFORMANCE_DECLINE_REASONS] ??
                  {}
                }
                isLoading={lookupsLoading}
                className="col-md-12 mb-3"
              />
            </Row>
          )}
        </Col>

        {/* Right Column - Informational Panels (30%) */}
        <Col xs={12} md={4} lg={5}>
          {/* Planned Capacity Display Area */}
          <div className="mb-4 mt-4 p-3 bg-light rounded border d-flex align-items-center justify-content-between">
            <div>
              <h6 className="text-muted mb-2">{t('ppc_planned_capacity')}</h6>
              <div className="d-flex align-items-baseline">
                <span className="h4 mb-0">{getPlannedCapacityDisplay()}</span>
              </div>
            </div>
            <div>
              <h6 className="text-muted mb-2">{t('ppc_design_capacity')}</h6>
              <div className="d-flex align-items-baseline">
                <span className="h4 mb-0">{getDesignCapacityDisplay()}</span>
              </div>
            </div>
          </div>

          {/* Performance Display Area - Only shown when actual capacity exists */}
          {showActualCapacityField && performancePercent !== null && (
            <div
              className={`mb-4 p-3 rounded border ${getPerformanceStatusClass(performancePercent)}`}
              style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
            >
              <h6 className="mb-2">{t('performance_status')}</h6>
              <div className="d-flex align-items-baseline">
                <span className="h3 mb-0 me-2">{performancePercent}%</span>
                <span className="small">
                  {t('of_design_capacity_achieved')}
                </span>
              </div>
              <div className="progress mt-2" style={{ height: '8px' }}>
                <div
                  className={`progress-bar ${getProgressBarClass(performancePercent)}`}
                  role="progressbar"
                  style={{ width: `${Math.min(100, performancePercent)}%` }}
                  aria-valuenow={performancePercent}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
              <div className="mt-2 small">
                <strong>{t('ppc_actual_capacity')}:</strong>{' '}
                {formatNumberWithCommas(
                  formik.values[fieldIds.actualCapacity]
                ) || 0}{' '}
                |<strong> {t('ppc_design_capacity')}:</strong>{' '}
                {formatNumberWithCommas(
                  formik.values[fieldIds.designCapacity]
                ) || 0}{' '}
                {measurementUnitDisplay}
              </div>
            </div>
          )}
        </Col>
      </Row>
    );
  };

  const renderVerticalLayout = () => (
    <>
      {shouldShowMonitoringView() ? (
        renderMonitoringView()
      ) : (
        <>
          {renderTextArea(fieldIds.productDetail)}
          {shouldShowInitialRegistrationFields() && (
            <>
              {renderMeasurementUnitField()}
              {renderNumberField(fieldIds.designCapacity, {
                infoText: getInfoText(
                  fieldIds.designCapacity,
                  getCurrentMeasurementUnit()
                ),
              })}
              {renderNumberField(fieldIds.plannedCapacity, {
                infoText: getInfoText(
                  fieldIds.plannedCapacity,
                  getCurrentMeasurementUnit()
                ),
              })}
            </>
          )}
          {shouldShowActualCapacity() &&
            renderNumberField(fieldIds.actualCapacity, {
              infoText: getInfoText(
                fieldIds.actualCapacity,
                getCurrentMeasurementUnit()
              ),
            })}
        </>
      )}
    </>
  );

  const renderHorizontalLayout = () => (
    <>
      {shouldShowMonitoringView() ? (
        renderMonitoringView()
      ) : (
        <>
          <Row>
            <Col xs={12}>{renderTextArea(fieldIds.productDetail)}</Col>
          </Row>
          {shouldShowInitialRegistrationFields() && (
            <>
              <Row>
                <Col xs={6}>{renderMeasurementUnitField()}</Col>
              </Row>
              <Row>
                <Col {...colSizes}>
                  {renderNumberField(fieldIds.designCapacity, {
                    infoText: getInfoText(
                      fieldIds.designCapacity,
                      getCurrentMeasurementUnit()
                    ),
                  })}
                </Col>
                <Col {...colSizes}>
                  {renderNumberField(fieldIds.plannedCapacity, {
                    infoText: getInfoText(
                      fieldIds.plannedCapacity,
                      getCurrentMeasurementUnit()
                    ),
                  })}
                </Col>
              </Row>
            </>
          )}
          {shouldShowActualCapacity() && (
            <Row>
              <Col {...colSizes}>
                {renderNumberField(fieldIds.actualCapacity, {
                  infoText: getInfoText(
                    fieldIds.actualCapacity,
                    getCurrentMeasurementUnit()
                  ),
                })}
              </Col>
            </Row>
          )}
        </>
      )}
    </>
  );

  return (
    <div className="production-capacity-fields">
      {layout === 'horizontal'
        ? renderHorizontalLayout()
        : renderVerticalLayout()}
    </div>
  );
};

ProductionCapacityFields.propTypes = {
  formik: PropTypes.shape({
    values: PropTypes.object,
    errors: PropTypes.object,
    touched: PropTypes.object,
    handleChange: PropTypes.func,
    handleBlur: PropTypes.func,
    setFieldValue: PropTypes.func,
  }).isRequired,
  fieldIds: PropTypes.shape({
    productDetail: PropTypes.string,
    measurement: PropTypes.string,
    designCapacity: PropTypes.string,
    plannedCapacity: PropTypes.string,
    actualCapacity: PropTypes.string,
    plannedCapacityPercent: PropTypes.string,
    perfReasonId: PropTypes.string,
  }),
  disabled: PropTypes.bool,
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
  colSizes: PropTypes.shape({
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number,
    xxl: PropTypes.number,
  }),
  isRequired: PropTypes.bool,
  activityType: PropTypes.number.isRequired,
  projectStatus: PropTypes.number,
  measurementUnit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  performanceReasons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
    })
  ),
};

ProductionCapacityFields.defaultProps = {
  fieldIds: {
    productDetail: 'ppc_product_detail',
    measurement: 'ppc_measurement',
    designCapacity: 'ppc_design_capacity',
    plannedCapacity: 'ppc_planned_capacity',
    actualCapacity: 'ppc_actual_capacity',
    plannedCapacityPercent: 'ppc_planned_capacity_percent',
    perfReasonId: 'ppc_perf_reason_id',
  },
  disabled: false,
  layout: 'horizontal',
  colSizes: { md: 6 },
  isRequired: true,
  projectStatus: undefined,
  measurementUnit: '',
  performanceReasons: [],
};

export default ProductionCapacityFields;
