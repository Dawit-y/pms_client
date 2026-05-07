import { useFormik } from 'formik';
import { memo, useRef } from 'react';
import { Form, Row, Card } from 'react-bootstrap';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import * as Yup from 'yup';

import FormActionButtons from '../../components/Common/FormActionButtons';
import Input from '../../components/Common/Input';
import {
  useAddLookupType,
  useUpdateLookupType,
} from '../../queries/lookup_types_query';
import { alphanumericValidation } from '../../utils/validations';

const LookupTypesForm = ({ isEdit = false, rowData = {} }) => {
  const submitActionRef = useRef(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id } = useParams();

  const addLookupTypeMutation = useAddLookupType();
  const updateLookupTypeMutation = useUpdateLookupType();

  const validationSchema = Yup.object().shape({
    lkt_type_code: alphanumericValidation(2, 100, true),
    lkt_type_name: alphanumericValidation(2, 200, true),
    lkt_remark: alphanumericValidation(0, 425, false),
  });

  const formik = useFormik({
    initialValues: {
      lkt_type_code: isEdit ? rowData.lkt_type_code || '' : '',
      lkt_type_name: isEdit ? rowData.lkt_type_name || '' : '',
      lkt_remark: isEdit ? rowData.lkt_remark || '' : '',
    },
    validationSchema,
    enableReinitialize: true,

    onSubmit: async (values, { setSubmitting }) => {
      try {
        let lookup_typeId;

        if (isEdit) {
          await updateLookupTypeMutation.mutateAsync({
            uuid: id || rowData.uuid,
            ...values,
          });
          lookup_typeId = id || rowData.uuid;
        } else {
          const result = await addLookupTypeMutation.mutateAsync(values);
          lookup_typeId = result?.uuid;
        }

        if (submitActionRef.current === 'close') {
          navigate(-1);
        }

        if (submitActionRef.current === 'view') {
          const search = searchParams.toString();
          navigate(
            lookup_typeId
              ? `/lookup_types/${lookup_typeId}${search ? `?${search}` : ''}`
              : `/lookup_types${search ? `?${search}` : ''}`
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
    addLookupTypeMutation.isPending || updateLookupTypeMutation.isPending;

  return (
    <Card>
      <Card.Body>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Row>
            <Input
              formik={formik}
              fieldId={'lkt_type_code'}
              className="col-md-6 mb-3"
            />
            <Input
              formik={formik}
              fieldId={'lkt_type_name'}
              className="col-md-6 mb-3"
            />
            <Input
              type="textarea"
              formik={formik}
              fieldId={'lkt_remark'}
              className="col-md-12 mb-3"
            />
          </Row>

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

export default memo(LookupTypesForm);
