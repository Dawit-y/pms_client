import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

import { ACTIVITY_TYPES } from '../../constants/constantTexts';
import { MONITORING_TYPES } from '../../constants/constantTexts';
import { useLookups } from '../../queries/lookups_query';
import { useFetchStatusChangeReasons } from '../../queries/status_change_reasons_query';
import {
  LOOKUP_GROUPS,
  LOOKUP_TYPE_IDS,
} from '../../utils/constants/lookUpTypes';
import {
  PROJECT_STATUS_IDS,
  PROJECT_STATUS_TRANSITIONS,
} from '../../utils/constants/projectStatus';
import AsyncSelectField from './AsyncSelectField';
import Input from './Input';

const ProjectStatusFields = ({
  formik,
  fieldIds = {
    previousStatusId: 'prs_previous_status_id',
    newStatusId: 'prs_new_status_id',
    statusJustification: 'prs_status_justification',
    statusChangeReasonIds: 'prs_reason',
  },
  disabled = false,
  layout = 'horizontal',
  colSizes = { md: 6 },
  isRequired = true,
  activityType,
  disableNewStatus = false,
  monitoringType = null,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const { lookupsByType, isLoading: lookupsLoading } = useLookups(
    LOOKUP_GROUPS.PROJECT_STATUS_FIELDS
  );

  const allStatusOptions = lookupsByType[LOOKUP_TYPE_IDS.PROJECT_STATUS] || {};

  const previousStatusId = formik.values?.[fieldIds.previousStatusId];
  const currentNewStatusId = formik.values?.[fieldIds.newStatusId];

  const shouldSkipValidations = activityType === ACTIVITY_TYPES.MANUAL_CHANGE;

  // Check if terminated status should be appended
  const shouldAppendTerminatedStatus = () => {
    return (
      monitoringType === MONITORING_TYPES.TERMINATION &&
      activityType === ACTIVITY_TYPES.MONITORING
    );
  };

  // Filter new status options based on allowed transitions
  const getFilteredStatusOptions = () => {
    if (shouldSkipValidations) {
      // If terminated status should be appended, add it to all options
      if (shouldAppendTerminatedStatus()) {
        return {
          ...allStatusOptions,
          [PROJECT_STATUS_IDS.TERMINATED]:
            allStatusOptions[PROJECT_STATUS_IDS.TERMINATED] || 'Terminated',
        };
      }
      return allStatusOptions;
    }

    if (
      !previousStatusId ||
      activityType === ACTIVITY_TYPES.INITIAL_REGISTRATION
    ) {
      // If terminated status should be appended, add it to all options
      if (shouldAppendTerminatedStatus()) {
        return {
          ...allStatusOptions,
          [PROJECT_STATUS_IDS.TERMINATED]:
            allStatusOptions[PROJECT_STATUS_IDS.TERMINATED] || 'Terminated',
        };
      }
      return allStatusOptions;
    }

    const allowedTransitions = PROJECT_STATUS_TRANSITIONS[previousStatusId];

    if (!allowedTransitions) {
      // If terminated status should be appended, add it to all options
      if (shouldAppendTerminatedStatus()) {
        return {
          ...allStatusOptions,
          [PROJECT_STATUS_IDS.TERMINATED]:
            allStatusOptions[PROJECT_STATUS_IDS.TERMINATED] || 'Terminated',
        };
      }
      return allStatusOptions;
    }

    // Filter the options to only include allowed statuses
    const filteredOptions = {};
    Object.entries(allStatusOptions).forEach(([statusId, statusName]) => {
      const numericStatusId = parseInt(statusId, 10);
      if (allowedTransitions.includes(numericStatusId)) {
        filteredOptions[statusId] = statusName;
      }
    });

    // Append terminated status if conditions are met
    if (shouldAppendTerminatedStatus()) {
      const terminatedStatusId = PROJECT_STATUS_IDS.TERMINATED.toString();
      filteredOptions[terminatedStatusId] =
        allStatusOptions[terminatedStatusId] || 'Terminated';
    }

    return filteredOptions;
  };

  const filteredStatusOptions = getFilteredStatusOptions();

  const initialPreviousStatusId = useRef(previousStatusId);

  useEffect(() => {
    if (shouldSkipValidations) {
      return;
    }

    if (activityType === ACTIVITY_TYPES.INITIAL_REGISTRATION) {
      return;
    }

    if (!previousStatusId) {
      return;
    }

    // Don't run validation on initial mount if values already exist
    if (
      initialPreviousStatusId.current === previousStatusId &&
      currentNewStatusId
    ) {
      // This is likely a remount, skip validation
      return;
    }

    // If there's a new status selected, check if it's allowed with the current previous status
    if (currentNewStatusId) {
      const allowedTransitions = PROJECT_STATUS_TRANSITIONS[previousStatusId];
      const isValid = allowedTransitions?.includes(currentNewStatusId);

      if (!isValid) {
        formik.setFieldValue(fieldIds.newStatusId, '');
        formik.setFieldValue(fieldIds.statusChangeReasonIds, '');
      }
    }

    // Update the ref after validation
    initialPreviousStatusId.current = previousStatusId;
    // eslint-disable-next-line
  }, [
    previousStatusId,
    currentNewStatusId,
    activityType,
    shouldSkipValidations,
  ]);

  const statusId = formik.values?.[fieldIds.newStatusId];
  const { data: statusChangeReasons, isLoading: reasonsLoading } =
    useFetchStatusChangeReasons({ status_id: statusId }, !!statusId);

  const reasonOptions =
    statusChangeReasons?.results?.map((reason) => ({
      value: reason.scr_id,
      label:
        lang === 'en'
          ? reason.scr_name_en
          : lang === 'am'
            ? reason.scr_name_am
            : reason.scr_name_or,
    })) || [];

  const currentReasons = formik.values?.[fieldIds.statusChangeReasonIds];

  const cleanReasons =
    typeof currentReasons === 'string'
      ? currentReasons.replace(/[{}]/g, '')
      : currentReasons;

  const currentReasonsArray = Array.isArray(cleanReasons)
    ? cleanReasons.map(String)
    : typeof cleanReasons === 'string' && cleanReasons
      ? cleanReasons.split(',').map((val) => String(val).trim())
      : [];

  const selectedReasons = reasonOptions.filter((option) =>
    currentReasonsArray.includes(String(option.value))
  );

  const handleReasonChange = (selectedOptions) => {
    const selectedIds = selectedOptions
      ? selectedOptions.map((option) => option.value).join(',')
      : '';
    formik.setFieldValue(fieldIds.statusChangeReasonIds, selectedIds);
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'green'
        : state.isFocused
          ? '#f0f0f0'
          : 'white',
      color: state.isSelected ? 'white' : 'black',
      '&:active': {
        backgroundColor: state.isSelected ? 'green' : '#f0f0f0',
      },
    }),
  };

  const renderReasonField = () => {
    if (activityType === 1) {
      return null;
    }

    return (
      <>
        <label htmlFor={fieldIds.statusChangeReasonIds} className="form-label">
          {t('status_change_reasons')}{' '}
          {isRequired && <span className="text-danger">*</span>}
        </label>
        <Select
          inputId={fieldIds.statusChangeReasonIds}
          isMulti
          name={fieldIds.statusChangeReasonIds}
          options={reasonOptions}
          value={selectedReasons}
          onChange={handleReasonChange}
          onBlur={() =>
            formik.setFieldTouched(fieldIds.statusChangeReasonIds, true)
          }
          isLoading={reasonsLoading}
          isDisabled={disabled || !statusId}
          placeholder="Select status change reasons..."
          styles={customStyles}
        />
        {formik.touched?.[fieldIds.statusChangeReasonIds] &&
          formik.errors?.[fieldIds.statusChangeReasonIds] && (
            <div className="text-danger mt-1 small">
              {formik.errors[fieldIds.statusChangeReasonIds]}
            </div>
          )}
      </>
    );
  };

  const renderVerticalLayout = () => (
    <>
      {activityType !== ACTIVITY_TYPES.INITIAL_REGISTRATION && (
        <AsyncSelectField
          formik={formik}
          fieldId={fieldIds.previousStatusId}
          optionMap={allStatusOptions}
          isLoading={lookupsLoading}
          className="mb-3"
          isRequired={isRequired}
          isDisabled={true}
        />
      )}

      <AsyncSelectField
        formik={formik}
        fieldId={fieldIds.newStatusId}
        optionMap={filteredStatusOptions}
        isLoading={lookupsLoading}
        className="mb-3"
        isRequired={isRequired}
        isDisabled={
          disabled ||
          (!shouldSkipValidations &&
            !!previousStatusId &&
            Object.keys(filteredStatusOptions).length === 0) ||
          disableNewStatus
        }
      />
      {activityType !== ACTIVITY_TYPES.INITIAL_REGISTRATION && (
        <div className="mb-3">{renderReasonField()}</div>
      )}
      <Input
        type="textarea"
        formik={formik}
        fieldId={fieldIds.statusJustification}
        className="mb-3"
        isRequired={false}
        disabled={disabled}
        rows={4}
        maxLength={500}
      />
    </>
  );

  const renderHorizontalLayout = () => (
    <Row>
      {activityType !== ACTIVITY_TYPES.INITIAL_REGISTRATION && (
        <Col {...colSizes}>
          <AsyncSelectField
            formik={formik}
            fieldId={fieldIds.previousStatusId}
            optionMap={allStatusOptions}
            isLoading={lookupsLoading}
            className="mb-3"
            isRequired={isRequired}
            isDisabled={true}
          />
        </Col>
      )}
      <Col {...colSizes}>
        <AsyncSelectField
          formik={formik}
          fieldId={fieldIds.newStatusId}
          optionMap={filteredStatusOptions}
          isLoading={lookupsLoading}
          className="mb-3"
          isRequired={isRequired}
          isDisabled={
            disabled ||
            (!shouldSkipValidations &&
              !!previousStatusId &&
              Object.keys(filteredStatusOptions).length === 0) ||
            disableNewStatus
          }
        />
      </Col>
      {activityType !== ACTIVITY_TYPES.INITIAL_REGISTRATION && (
        <Col md={12}>
          <div className="mb-3">{renderReasonField()}</div>
        </Col>
      )}
      <Col md={12}>
        <Input
          type="textarea"
          formik={formik}
          fieldId={fieldIds.statusJustification}
          className="mb-3"
          isRequired={false}
          disabled={disabled}
          rows={4}
          maxLength={500}
        />
      </Col>
    </Row>
  );

  return (
    <div className="project-status-fields">
      {layout === 'horizontal'
        ? renderHorizontalLayout()
        : renderVerticalLayout()}
    </div>
  );
};

ProjectStatusFields.propTypes = {
  formik: PropTypes.shape({
    values: PropTypes.object,
    errors: PropTypes.object,
    touched: PropTypes.object,
    handleChange: PropTypes.func,
    handleBlur: PropTypes.func,
    setFieldValue: PropTypes.func,
    setFieldTouched: PropTypes.func,
  }).isRequired,
  fieldIds: PropTypes.shape({
    previousStatusId: PropTypes.string,
    newStatusId: PropTypes.string,
    statusJustification: PropTypes.string,
    statusChangeReasonIds: PropTypes.string,
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
  identifier: PropTypes.string,
  lookupGroup: PropTypes.string,
  isRequired: PropTypes.bool,
  activityType: PropTypes.number.isRequired,
};

ProjectStatusFields.defaultProps = {
  fieldIds: {
    previousStatusId: 'prs_previous_status_id',
    newStatusId: 'prs_new_status_id',
    statusJustification: 'prs_status_justification',
    statusChangeReasonIds: 'prs_reason',
  },
  disabled: false,
  layout: 'horizontal',
  colSizes: { md: 6 },
  isRequired: true,
};

export default ProjectStatusFields;
