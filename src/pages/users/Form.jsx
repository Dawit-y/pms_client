import { useFormik } from 'formik';
import { memo, useRef } from 'react';
import { Form, Row, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import * as Yup from 'yup';

import AsyncSelectField from '../../components/Common/AsyncSelectField';
import DatePicker from '../../components/Common/DatePicker';
import FormActionButtons from '../../components/Common/FormActionButtons';
import Input from '../../components/Common/Input';
import NumberField from '../../components/Common/NumberField';
import { useAddUser, useUpdateUser } from '../../queries/users_query';

const UsersForm = ({ isEdit = false, rowData = {} }) => {
  const submitActionRef = useRef(null);

  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id } = useParams();

  const addUserMutation = useAddUser();
  const updateUserMutation = useUpdateUser();

  // Build validation schema dynamically
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required(t('field_required')),
    last_name: Yup.string().required(t('field_required')),
    email: Yup.string().required(t('field_required')),
    phone: Yup.string().required(t('field_required')),
  });

  const formik = useFormik({
    initialValues: {
      first_name: isEdit ? rowData.first_name || '' : '',
      last_name: isEdit ? rowData.last_name || '' : '',
      email: isEdit ? rowData.email || '' : '',
      phone: isEdit ? rowData.phone || '' : '',
    },
    validationSchema,
    enableReinitialize: true,

    onSubmit: async (values, { setSubmitting }) => {
      try {
        let userId;

        if (isEdit) {
          await updateUserMutation.mutateAsync({
            id: id || rowData.id,
            uuid: rowData.uuid,
            ...values,
          });
          userId = id || rowData.uuid;
        } else {
          const result = await addUserMutation.mutateAsync(values);
          userId = result?.data?.uuid;
        }

        if (submitActionRef.current === 'close') {
          navigate(-1);
        }

        if (submitActionRef.current === 'view') {
          const search = searchParams.toString();
          navigate(
            userId
              ? `/users/${userId}${search ? `?${search}` : ''}`
              : `/users${search ? `?${search}` : ''}`
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
    addUserMutation.isPending || updateUserMutation.isPending;

  return (
    <Card>
      <Card.Body>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Row>
            <Input formik={formik} fieldId={'first_name'} />
            <Input formik={formik} fieldId={'last_name'} />
            <Input formik={formik} fieldId={'email'} />
            <Input formik={formik} fieldId={'phone'} />
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

export default memo(UsersForm);
