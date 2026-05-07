import { useFormik } from 'formik';
import { useEffect } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaUpload, FaTimes } from 'react-icons/fa';
import * as Yup from 'yup';

import { useLookups } from '../../../queries/lookups_query';
import {
  useAddProjectDocument,
  useUpdateProjectDocument,
} from '../../../queries/project_documents_query';
import {
  LOOKUP_GROUPS,
  LOOKUP_TYPE_IDS,
} from '../../../utils/constants/lookUpTypes';
import AsyncSelectField from '../AsyncSelectField';
import FileUploadField from '../FileUploadField';
import Input from '../Input';

const FileUploadForm = ({
  projectId,
  ownerId,
  ownerTypeId,
  onSuccess,
  onCancel,
  fileToEdit,
  acceptedTypes,
}) => {
  const { t } = useTranslation();

  const { lookupsByType, isLoading: lookupsLoading } = useLookups(
    LOOKUP_GROUPS.PROJECT_DOC_FORM
  );

  const addProjectDocumentMutation = useAddProjectDocument(projectId);
  const updateProjectDocumentMutation = useUpdateProjectDocument(projectId);

  const validationSchema = Yup.object().shape({
    prd_name: Yup.string().required(t('field_required')),
    prd_description: Yup.string(),
    prd_document_type_id: Yup.string().required(t('field_required')),
    prd_file: fileToEdit
      ? Yup.string().nullable()
      : Yup.mixed().required(t('field_required')),
  });

  const formik = useFormik({
    initialValues: {
      prd_id: fileToEdit?.prd_id || '',
      prd_project_id: projectId,
      prd_name: fileToEdit?.prd_name || '',
      prd_description: fileToEdit?.prd_description || '',
      prd_document_type_id: fileToEdit?.prd_document_type_id || '',
      prd_file: fileToEdit?.prd_file || '',
      prd_owner_id: ownerId,
      prd_owner_type_id: ownerTypeId,
    },
    validationSchema,
    enableReinitialize: true,

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const formData = new FormData();

        // Append all fields to FormData
        Object.keys(values).forEach((key) => {
          if (key === 'prd_file' && values[key] instanceof File) {
            formData.append(key, values[key]);
          } else if (values[key] !== null && values[key] !== undefined) {
            formData.append(key, values[key]);
          }
        });

        if (fileToEdit) {
          await updateProjectDocumentMutation.mutateAsync({
            prd_id: fileToEdit.prd_id,
            ...values,
            prd_file:
              values.prd_file instanceof File ? values.prd_file : undefined,
          });
        } else {
          // eslint-disable-next-line
          const { prd_id, ...rest } = values;
          await addProjectDocumentMutation.mutateAsync(rest);
        }

        resetForm();
        onSuccess();
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Reset form when edit mode changes
  useEffect(() => {
    if (!fileToEdit) {
      formik.resetForm();
    }
    //eslint-disable-next-line
  }, [fileToEdit]);

  const isPending =
    addProjectDocumentMutation.isPending ||
    updateProjectDocumentMutation.isPending;

  return (
    <div>
      <h6 className="mb-3">
        {fileToEdit ? t('edit_file') : t('upload_new_file')}
      </h6>

      <Form noValidate onSubmit={formik.handleSubmit}>
        {fileToEdit && !(formik.values.prd_file instanceof File) && (
          <div className="mb-3">
            <Form.Label className="text-muted small mb-1">
              {t('current_file', { defaultValue: 'Current File' })}
            </Form.Label>
            <div
              className="d-flex align-items-center gap-2 p-2 border rounded bg-light"
              style={{ opacity: 0.8 }}
            >
              <span className="text-truncate">{fileToEdit.prd_name}</span>
              <span className="badge bg-secondary ms-auto">
                .{fileToEdit.prd_file_extension}
              </span>
            </div>
          </div>
        )}

        <FileUploadField
          formik={formik}
          fieldId="prd_file"
          className="mb-3"
          acceptedTypes={acceptedTypes || ['pdf']}
          isRequired={!fileToEdit}
          label={
            fileToEdit
              ? t('upload_new_file_to_replace', {
                  defaultValue: 'Upload new file to replace (optional)',
                })
              : undefined
          }
        />

        <Input formik={formik} fieldId="prd_name" className="mb-3" />

        <AsyncSelectField
          formik={formik}
          fieldId="prd_document_type_id"
          optionMap={lookupsByType[LOOKUP_TYPE_IDS.DOCUMENT_TYPE] || {}}
          isLoading={lookupsLoading}
          className="mb-3"
        />

        <Input
          type="textarea"
          formik={formik}
          fieldId="prd_description"
          label={t('description')}
          isRequired={false}
          className="mb-3"
          rows={2}
        />

        <div className="d-flex gap-2 mb-3">
          <Button
            type="submit"
            variant="success"
            className="flex-grow-1"
            disabled={
              isPending ||
              !formik.isValid ||
              (fileToEdit ? false : !formik.dirty)
            }
          >
            {isPending && (
              <Spinner size="sm" className="me-1" animation="border" />
            )}
            <FaUpload className="me-1" />
            {fileToEdit ? t('update') : t('upload')}
          </Button>

          {fileToEdit && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isPending}
            >
              <FaTimes />
            </Button>
          )}
        </div>

        {(addProjectDocumentMutation.isError ||
          updateProjectDocumentMutation.isError) && (
          <Alert variant="danger" className="mt-3">
            {t('upload_failed')}
          </Alert>
        )}
      </Form>
    </div>
  );
};

export default FileUploadForm;
