import { useFormik } from 'formik';
import { memo, useRef } from 'react';
import { useMemo } from 'react';
import { Form, Row, Card, Badge, FormText } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  FaInfoCircle,
  FaLanguage,
  FaPalette,
  FaEllipsisH,
} from 'react-icons/fa';
import { useNavigate, useParams, useOutletContext } from 'react-router';
import * as Yup from 'yup';

import AsyncSelectField from '../../components/Common/AsyncSelectField';
import ColorCodeInput from '../../components/Common/ColorCodeInput';
import FormActionButtons from '../../components/Common/FormActionButtons';
import Input from '../../components/Common/Input';
import NumberField from '../../components/Common/NumberField';
import { useFetchLookupTypes } from '../../queries/lookup_types_query';
import { useAddLookup, useUpdateLookup } from '../../queries/lookups_query';
import { createKeyValueMap } from '../../utils/commonMethods';
import {
  alphanumericValidation,
  numberValidation,
  onlyAmharicValidation,
  hexColorValidation,
} from '../../utils/validations';
import '../../assets/css/formModal.css';

const LookupsForm = ({ isEdit = false, rowData = {} }) => {
  const submitActionRef = useRef(null);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { typeId } = useOutletContext();

  const addLookupMutation = useAddLookup();
  const updateLookupMutation = useUpdateLookup();
  const { data, isLoading, isError } = useFetchLookupTypes({}, true);

  const lookUpTypeMap = useMemo(() => {
    return createKeyValueMap(data?.results || [], 'uuid', 'lkt_type_name');
  }, [data]);

  const validationSchema = Yup.object().shape({
    lku_type_id: Yup.number().required(t('field_required')),
    lku_name_or: alphanumericValidation(2, 100, true),
    lku_name_am: onlyAmharicValidation(2, 100, true),
    lku_name_en: alphanumericValidation(2, 100, true),
    lku_code: alphanumericValidation(1, 50, true),
    lku_color_code: hexColorValidation(false),
    lku_order_id: numberValidation(1, 999, true),
    lku_extra_attr1: Yup.string().max(255, t('max_characters', { count: 255 })),
    lku_extra_attr2: Yup.string().max(255, t('max_characters', { count: 255 })),
    lku_remark: alphanumericValidation(0, 425, false),
  });

  const formik = useFormik({
    initialValues: {
      lku_type_id: isEdit ? rowData.lku_type_id || '' : typeId || '',
      lku_name_or: isEdit ? rowData.lku_name_or || '' : '',
      lku_name_am: isEdit ? rowData.lku_name_am || '' : '',
      lku_name_en: isEdit ? rowData.lku_name_en || '' : '',
      lku_code: isEdit ? rowData.lku_code || '' : '',
      lku_color_code: isEdit ? rowData.lku_color_code || '' : '',
      lku_order_id: isEdit ? rowData.lku_order_id || '' : '',
      lku_extra_attr1: isEdit ? rowData.lku_extra_attr1 || '' : '',
      lku_extra_attr2: isEdit ? rowData.lku_extra_attr2 || '' : '',
      lku_remark: isEdit ? rowData.lku_remark || '' : '',
    },
    validationSchema,
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: true,

    onSubmit: async (values, { setSubmitting }) => {
      try {
        let lookupId;

        const submitValues = { ...values };

        if (isEdit) {
          await updateLookupMutation.mutateAsync({
            lku_id: id || rowData.lku_id,
            ...submitValues,
          });
          lookupId = id || rowData.lku_id;
        } else {
          const result = await addLookupMutation.mutateAsync(submitValues);
          lookupId = result?.data?.lku_id;
        }

        if (submitActionRef.current === 'close') {
          navigate(-1);
        }

        if (submitActionRef.current === 'view') {
          const targetTypeId = values.lku_type_id || typeId;
          navigate(
            lookupId
              ? `/lookups/type/${targetTypeId}/${lookupId}`
              : `/lookups/type/${targetTypeId}`
          );
        }
      } catch {
        // Error handling is managed globally by QueryProvider
      } finally {
        setSubmitting(false);
        submitActionRef.current = null;
      }
    },
  });

  const handleSaveAndClose = () => {
    submitActionRef.current = 'close';
    formik.submitForm();
  };

  const handleSaveAndView = () => {
    submitActionRef.current = 'view';
    formik.submitForm();
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const isMutationPending =
    addLookupMutation.isPending || updateLookupMutation.isPending;

  return (
    <Card>
      <Card.Body>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <div className="form-section">
            <div className="form-section-header">
              <FaInfoCircle className="section-icon text-primary" />
              <h6 className="text-primary">{t('basic_information')}</h6>
            </div>
            <Row>
              <AsyncSelectField
                fieldId="lku_type_id"
                formik={formik}
                optionMap={lookUpTypeMap}
                isLoading={isLoading}
                isError={isError}
                className="col-md-6 mb-3"
                isDisabled={true}
              />
              <Input
                formik={formik}
                fieldId={'lku_code'}
                maxLength={50}
                className="col-md-6 mb-3"
              />
            </Row>
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <FaLanguage className="section-icon text-primary" />
              <h6 className="text-primary">{t('name_translations')}</h6>
            </div>
            <Row>
              <Input
                formik={formik}
                fieldId={'lku_name_or'}
                maxLength={100}
                className="col-md-4 mb-3"
              />
              <Input
                formik={formik}
                fieldId={'lku_name_am'}
                maxLength={100}
                className="col-md-4 mb-3"
              />
              <Input
                formik={formik}
                fieldId={'lku_name_en'}
                maxLength={100}
                className="col-md-4 mb-3"
              />
            </Row>
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <FaPalette className="section-icon text-primary" />
              <h6 className="text-primary">{t('display_settings')}</h6>
            </div>
            <Row>
              <ColorCodeInput
                formik={formik}
                fieldId={'lku_color_code'}
                className="col-md-6 mb-3"
                isRequired={false}
              />
              <NumberField
                formik={formik}
                fieldId={'lku_order_id'}
                min={1}
                max={999}
                className="col-md-6 mb-3"
              />
            </Row>
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <FaEllipsisH className="section-icon text-primary" />
              <h6 className="text-primary">{t('additional_information')}</h6>
            </div>
            <Row>
              <Input
                formik={formik}
                fieldId={'lku_extra_attr1'}
                maxLength={255}
                isRequired={false}
                className="col-md-6 mb-3"
              />
              <Input
                formik={formik}
                fieldId={'lku_extra_attr2'}
                maxLength={255}
                isRequired={false}
                className="col-md-6 mb-3"
              />
              <Input
                formik={formik}
                fieldId={'lku_remark'}
                type="textarea"
                className="col-md-12 mb-3"
                maxLength={425}
                isRequired={false}
                rows={4}
              />
            </Row>
          </div>

          <FormActionButtons
            isSubmitting={formik.isSubmitting}
            isPending={isMutationPending}
            isEdit={isEdit}
            isValid={formik.isValid}
            dirty={formik.dirty}
            onCancel={handleCancel}
            onSaveAndClose={handleSaveAndClose}
            onSaveAndView={handleSaveAndView}
          />
        </Form>
      </Card.Body>
    </Card>
  );
};

export default memo(LookupsForm);
