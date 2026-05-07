import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { ACTIVITY_TYPES } from '../../constants/constantTexts';
import NumberField from './NumberField';

const JobOpportunityFields = ({
  formik,
  activityType,
  fieldIds = {
    permanentNum: 'pjc_permanent_num',
    contractNum: 'pjc_contract_num',
    permanentMaleNum: 'pjc_permanent_male_num',
    permanentFemaleNum: 'pjc_permanent_female_num',
    contractMaleNum: 'pjc_contract_male_num',
    contractFemaleNum: 'pjc_contract_female_num',
    malePermanentProf: 'pjc_permanent_prof',
    maleContractProf: 'pjc_contract_prof',
    femalePermanentProf: 'pjc_permanent_prof_female',
    femaleContractProf: 'pjc_contract_prof_female',
  },
  isRequired = true,
  disabled = false,
  layout = 'horizontal',
  colSizes = { md: 6 },
  showTotalInfo = true,
}) => {
  const { t } = useTranslation();
  const isInitialRegistration =
    activityType === ACTIVITY_TYPES.INITIAL_REGISTRATION;
  const isMonitoring = activityType === ACTIVITY_TYPES.MONITORING;

  const previousValues = useRef({
    permanentMale: 0,
    permanentFemale: 0,
    contractMale: 0,
    contractFemale: 0,
    malePermanentProf: 0,
    maleContractProf: 0,
    femalePermanentProf: 0,
    femaleContractProf: 0,
  });

  // Calculate and set totals in Formik (only for non-initial registration)
  useEffect(() => {
    if (!formik?.values || isInitialRegistration) return;

    const permanentMale =
      parseInt(formik.values[fieldIds.permanentMaleNum]) || 0;
    const permanentFemale =
      parseInt(formik.values[fieldIds.permanentFemaleNum]) || 0;
    const contractMale = parseInt(formik.values[fieldIds.contractMaleNum]) || 0;
    const contractFemale =
      parseInt(formik.values[fieldIds.contractFemaleNum]) || 0;
    const malePermanentProf =
      parseInt(formik.values[fieldIds.malePermanentProf]) || 0;
    const maleContractProf =
      parseInt(formik.values[fieldIds.maleContractProf]) || 0;
    const femalePermanentProf =
      parseInt(formik.values[fieldIds.femalePermanentProf]) || 0;
    const femaleContractProf =
      parseInt(formik.values[fieldIds.femaleContractProf]) || 0;

    const currentValues = {
      permanentMale,
      permanentFemale,
      contractMale,
      contractFemale,
      malePermanentProf,
      maleContractProf,
      femalePermanentProf,
      femaleContractProf,
    };

    if (
      JSON.stringify(previousValues.current) === JSON.stringify(currentValues)
    ) {
      return;
    }

    previousValues.current = currentValues;

    const permanentTotal = permanentMale + permanentFemale;
    const contractTotal = contractMale + contractFemale;

    // Set the total fields in Formik
    if (formik.values[fieldIds.permanentNum] !== permanentTotal) {
      formik.setFieldValue(fieldIds.permanentNum, permanentTotal);
    }

    if (formik.values[fieldIds.contractNum] !== contractTotal) {
      formik.setFieldValue(fieldIds.contractNum, contractTotal);
    }

    const overallTotal = permanentTotal + contractTotal;

    const fieldsToValidate = [
      fieldIds.permanentMaleNum,
      fieldIds.permanentFemaleNum,
      fieldIds.contractMaleNum,
      fieldIds.contractFemaleNum,
    ];

    if (overallTotal === 0 && isRequired) {
      fieldsToValidate.forEach((field) => {
        if (!formik.errors[field]) {
          formik.setFieldError(field, t('at_least_one_field_required'));
        }
      });
    } else {
      fieldsToValidate.forEach((field) => {
        if (formik.errors[field] === t('at_least_one_field_required')) {
          formik.setFieldError(field, undefined);
        }
      });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fieldIds.permanentNum,
    fieldIds.contractNum,
    fieldIds.permanentMaleNum,
    fieldIds.permanentFemaleNum,
    fieldIds.contractMaleNum,
    fieldIds.contractFemaleNum,
    isRequired,
    t,
    isInitialRegistration,
  ]);

  // Validate that at least one total field has a value for initial registration
  useEffect(() => {
    if (!formik?.values || !isInitialRegistration || !isRequired) return;

    const permanentNum = parseInt(formik.values[fieldIds.permanentNum]) || 0;
    const contractNum = parseInt(formik.values[fieldIds.contractNum]) || 0;

    const hasValue = permanentNum > 0 || contractNum > 0;

    if (!hasValue) {
      // Set error on both fields if neither has a value
      [fieldIds.permanentNum, fieldIds.contractNum].forEach((field) => {
        if (!formik.errors[field]) {
          formik.setFieldError(field, t('at_least_one_field_required'));
        }
      });
    } else {
      // Clear errors if at least one field has a value
      [fieldIds.permanentNum, fieldIds.contractNum].forEach((field) => {
        if (formik.errors[field] === t('at_least_one_field_required')) {
          formik.setFieldError(field, undefined);
        }
      });
    }
  }, [
    formik,
    fieldIds.permanentNum,
    fieldIds.contractNum,
    isRequired,
    t,
    isInitialRegistration,
  ]);

  const renderField = (fieldId, infoText = '', isRequired = false) => (
    <NumberField
      formik={formik}
      fieldId={fieldId}
      isRequired={isRequired}
      allowDecimal={false}
      className="mb-3"
      disabled={disabled}
      infoText={infoText}
    />
  );

  const calculateTotals = () => {
    if (!formik?.values) return { permanent: 0, contract: 0, overall: 0 };

    if (isInitialRegistration) {
      const permanentNum = parseInt(formik.values[fieldIds.permanentNum]) || 0;
      const contractNum = parseInt(formik.values[fieldIds.contractNum]) || 0;

      return {
        permanent: permanentNum,
        contract: contractNum,
        overall: permanentNum + contractNum,
      };
    } else {
      const permanentMale =
        parseInt(formik.values[fieldIds.permanentMaleNum]) || 0;
      const permanentFemale =
        parseInt(formik.values[fieldIds.permanentFemaleNum]) || 0;
      const contractMale =
        parseInt(formik.values[fieldIds.contractMaleNum]) || 0;
      const contractFemale =
        parseInt(formik.values[fieldIds.contractFemaleNum]) || 0;
      const malePermanentProf =
        parseInt(formik.values[fieldIds.malePermanentProf]) || 0;
      const maleContractProf =
        parseInt(formik.values[fieldIds.maleContractProf]) || 0;
      const femalePermanentProf =
        parseInt(formik.values[fieldIds.femalePermanentProf]) || 0;
      const femaleContractProf =
        parseInt(formik.values[fieldIds.femaleContractProf]) || 0;

      const permanentTotal = permanentMale + permanentFemale;
      const contractTotal = contractMale + contractFemale;
      const overallTotal = permanentTotal + contractTotal;

      const permanentProfTotal = malePermanentProf + femalePermanentProf;
      const contractProfTotal = maleContractProf + femaleContractProf;
      const totalProfessional = permanentProfTotal + contractProfTotal;

      return {
        permanent: permanentTotal,
        contract: contractTotal,
        overall: overallTotal,
        permanentProf: permanentProfTotal,
        contractProf: contractProfTotal,
        totalProfessional,
      };
    }
  };

  const totals = calculateTotals();

  // Render for initial registration (only total fields)
  if (isInitialRegistration) {
    return (
      <div className="job-opportunity-fields">
        <Row>
          <Col {...colSizes}>
            {renderField(fieldIds.permanentNum, '', isRequired)}
          </Col>
          <Col {...colSizes}>
            {renderField(fieldIds.contractNum, '', isRequired)}
          </Col>
        </Row>
        {showTotalInfo && totals.overall > 0 && (
          <div className="text-muted small mt-2">
            {`${t('total_jobs_calculated ')} - ${totals.overall.toLocaleString()}`}
          </div>
        )}
      </div>
    );
  }

  const renderProfessionalFields = () => {
    if (!isMonitoring) return null;

    if (layout === 'horizontal') {
      return (
        <>
          <Row className="mt-3 mb-3">
            <Col {...colSizes}>
              <h6>{t('professional_positions')}</h6>
            </Col>
            {showTotalInfo && (
              <Col {...colSizes}>
                <span className="text-muted">
                  {t('total_professional')}:{' '}
                  {totals.totalProfessional.toLocaleString()}
                </span>
              </Col>
            )}
          </Row>
          <Row className="mb-2">
            <Col {...colSizes}>{renderField(fieldIds.malePermanentProf)}</Col>
            <Col {...colSizes}>{renderField(fieldIds.femalePermanentProf)}</Col>
          </Row>
          <Row>
            <Col {...colSizes}>{renderField(fieldIds.maleContractProf)}</Col>
            <Col {...colSizes}>{renderField(fieldIds.femaleContractProf)}</Col>
          </Row>
          {showTotalInfo && totals.totalProfessional > 0 && (
            <Row className="mt-2">
              <Col {...colSizes}>
                <div className="text-muted small">
                  {t('permanent_professional_total')}:{' '}
                  {totals.permanentProf.toLocaleString()}
                </div>
              </Col>
              <Col {...colSizes}>
                <div className="text-muted small">
                  {t('contract_professional_total')}:{' '}
                  {totals.contractProf.toLocaleString()}
                </div>
              </Col>
            </Row>
          )}
        </>
      );
    }

    return (
      <>
        <h6 className="mt-3 mb-2">{t('professional_positions')}</h6>

        <div className="mb-2">
          <div className="text-muted small mb-1">
            {t('permanent_positions')}
          </div>
          <Row>
            <Col sm={6}>
              <div className="text-muted small mb-1">{t('male')}</div>
              {renderField(fieldIds.malePermanentProf, '')}
            </Col>
            <Col sm={6}>
              <div className="text-muted small mb-1">{t('female')}</div>
              {renderField(fieldIds.femalePermanentProf, '')}
            </Col>
          </Row>
        </div>

        <div className="mb-2">
          <div className="text-muted small mb-1">{t('contract_positions')}</div>
          <Row>
            <Col sm={6}>
              <div className="text-muted small mb-1">{t('male')}</div>
              {renderField(fieldIds.maleContractProf, '')}
            </Col>
            <Col sm={6}>
              <div className="text-muted small mb-1">{t('female')}</div>
              {renderField(fieldIds.femaleContractProf, '')}
            </Col>
          </Row>
        </div>

        {showTotalInfo && totals.totalProfessional > 0 && (
          <>
            <div className="text-muted small mt-2">
              {t('permanent_professional_total')}:{' '}
              {totals.permanentProf.toLocaleString()}
            </div>
            <div className="text-muted small">
              {t('contract_professional_total')}:{' '}
              {totals.contractProf.toLocaleString()}
            </div>
            <div className="text-muted small mt-1">
              {t('total_professional')}:{' '}
              {totals.totalProfessional.toLocaleString()}
            </div>
          </>
        )}
      </>
    );
  };

  // Render for other activity types (gender-based breakdown)
  const renderVerticalLayout = () => (
    <>
      <h6 className="mt-3 mb-2">{t('permanent_positions')}</h6>
      {renderField(fieldIds.permanentMaleNum, '')}
      {renderField(fieldIds.permanentFemaleNum)}

      {showTotalInfo && totals.permanent > 0 && (
        <div className="text-muted small mb-3">
          {t('permanent_total_calculated', {
            total: totals.permanent.toLocaleString(),
          })}
        </div>
      )}

      <h6 className="mt-3 mb-2">{t('contract_positions')}</h6>
      {renderField(fieldIds.contractMaleNum, '')}
      {renderField(fieldIds.contractFemaleNum)}

      {showTotalInfo && totals.contract > 0 && (
        <div className="text-muted small mb-3">
          {t('contract_total_calculated', {
            total: totals.contract.toLocaleString(),
          })}
        </div>
      )}

      {renderProfessionalFields()}
    </>
  );

  const renderHorizontalLayout = () => (
    <>
      <Row className="mb-3">
        <Col {...colSizes}>
          <h6>{t('permanent_positions')}</h6>
        </Col>
        {showTotalInfo && (
          <Col {...colSizes}>
            <span className="text-muted">
              {t('total')}: {totals.permanent.toLocaleString()}
            </span>
          </Col>
        )}
      </Row>
      <Row>
        <Col {...colSizes}>{renderField(fieldIds.permanentMaleNum)}</Col>
        <Col {...colSizes}>{renderField(fieldIds.permanentFemaleNum)}</Col>
      </Row>

      <Row className="mt-3 mb-3">
        <Col {...colSizes}>
          <h6>{t('contract_positions')}</h6>
        </Col>
        {showTotalInfo && (
          <Col {...colSizes}>
            <span className="text-muted">
              {t('total')}: {totals.contract.toLocaleString()}
            </span>
          </Col>
        )}
      </Row>
      <Row>
        <Col {...colSizes}>{renderField(fieldIds.contractMaleNum)}</Col>
        <Col {...colSizes}>{renderField(fieldIds.contractFemaleNum)}</Col>
      </Row>

      {renderProfessionalFields()}
    </>
  );

  return (
    <div className="job-opportunity-fields">
      {layout === 'horizontal'
        ? renderHorizontalLayout()
        : renderVerticalLayout()}
    </div>
  );
};

JobOpportunityFields.propTypes = {
  formik: PropTypes.shape({
    values: PropTypes.object,
    errors: PropTypes.object,
    touched: PropTypes.object,
    handleChange: PropTypes.func,
    handleBlur: PropTypes.func,
    setFieldValue: PropTypes.func,
    setFieldError: PropTypes.func,
  }).isRequired,

  activityType: PropTypes.string.isRequired,

  fieldIds: PropTypes.shape({
    permanentNum: PropTypes.string,
    contractNum: PropTypes.string,
    permanentMaleNum: PropTypes.string,
    permanentFemaleNum: PropTypes.string,
    contractMaleNum: PropTypes.string,
    contractFemaleNum: PropTypes.string,
    malePermanentProf: PropTypes.string,
    maleContractProf: PropTypes.string,
    femalePermanentProf: PropTypes.string,
    femaleContractProf: PropTypes.string,
  }),

  isRequired: PropTypes.bool,
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
  showTotalInfo: PropTypes.bool,
};

JobOpportunityFields.defaultProps = {
  fieldIds: {
    permanentNum: 'pjc_permanent_num',
    contractNum: 'pjc_contract_num',
    permanentMaleNum: 'pjc_permanent_male_num',
    permanentFemaleNum: 'pjc_permanent_female_num',
    contractMaleNum: 'pjc_contract_male_num',
    contractFemaleNum: 'pjc_contract_female_num',
    malePermanentProf: 'pjc_permanent_prof',
    maleContractProf: 'pjc_contract_prof',
    femalePermanentProf: 'pjc_permanent_prof_female',
    femaleContractProf: 'pjc_contract_prof_female',
  },
  isRequired: false,
  disabled: false,
  layout: 'horizontal',
  colSizes: { md: 6 },
  showTotalInfo: true,
};

export default JobOpportunityFields;
