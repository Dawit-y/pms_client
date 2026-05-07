import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  Form,
  Modal,
  Button,
  Row,
  Col,
  Spinner,
  Alert,
  Card,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaRedoAlt, FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

// import { usePermissions } from '../../hooks/usePermissions';
import {
  useAddConversationInformation,
  useFetchConversationInformations,
  useUpdateConversationInformation,
  useDeleteConversationInformation,
} from '../../queries/conv_info_query';
import DeleteModal from './DeleteModal';
import FetchErrorHandler from './FetchErrorHandler';

const AttachNoteModal = ({ isOpen, toggle, ownerId, ownerTypeId, title }) => {
  const { t } = useTranslation();
  // const { hasPermission } = usePermissions();
  const [editingNote, setEditingNote] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const param = { cvi_object_type_id: ownerTypeId, cvi_object_id: ownerId };
  const { data, isFetching, isLoading, isError, error, refetch } =
    useFetchConversationInformations(param, isOpen);

  const addConversationInformation = useAddConversationInformation();
  const updateConversationInformation = useUpdateConversationInformation();
  const deleteConversationInformation = useDeleteConversationInformation();

  // const canAdd = hasPermission('note.add_note');
  // const canEdit = hasPermission('note.edit_note');
  // const canDelete = hasPermission('note.delete_note');
  const canAdd = true;
  const canEdit = true;
  const canDelete = true;

  const handleSubmit = async (values) => {
    try {
      if (editingNote) {
        // Update existing note
        await updateConversationInformation.mutateAsync({
          cvi_id: editingNote.cvi_id,
          cvi_title: values.cvi_title,
          cvi_description: values.cvi_description,
        });
        toast.success(t('update_success'), { autoClose: 3000 });
      } else {
        // Add new note
        const newConversationInformation = {
          cvi_title: values.cvi_title,
          cvi_object_id: ownerId,
          cvi_object_type_id: ownerTypeId,
          cvi_request_date_et: new Date().toISOString().split('T')[0],
          cvi_request_date_gc: new Date().toISOString().split('T')[0],
          cvi_description: values.cvi_description,
        };
        await addConversationInformation.mutateAsync(
          newConversationInformation
        );
        toast.success(t('add_success'), { autoClose: 3000 });
      }
      formik.resetForm();
      setEditingNote(null);
      refetch();
    } catch {
      toast.error(editingNote ? t('update_failure') : t('add_failure'), {
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async () => {
    if (noteToDelete) {
      try {
        await deleteConversationInformation.mutateAsync(noteToDelete.cvi_id);
        toast.success(t('delete_success'), { autoClose: 3000 });
        refetch();
      } catch {
        toast.error(t('delete_failure'), { autoClose: 3000 });
      }
      setDeleteModal(false);
      setNoteToDelete(null);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    formik.setValues({
      cvi_title: note.cvi_title,
      cvi_description: note.cvi_description,
    });
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    formik.resetForm();
  };

  const handleClose = () => {
    setEditingNote(null);
    formik.resetForm();
    toggle();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      cvi_title: '',
      cvi_description: '',
      cvi_object_id: ownerId,
      cvi_object_type_id: ownerTypeId,
    },
    validationSchema: Yup.object({
      cvi_title: Yup.string().required(t('subject_required')),
      cvi_description: Yup.string().required(t('note_required')),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: handleSubmit,
  });

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const comments = data?.data || [];

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  if (isLoading) {
    return <Spinner className="" />;
  }

  return (
    <>
      <Modal
        show={isOpen}
        onHide={handleClose}
        size="xl"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">{title || t('view_notes')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="justify-content-center">
            <Col lg={10}>
              <Alert variant="warning">{t('note_visibility_message')}</Alert>

              {/* Add/Edit Note Form */}
              {canAdd && (
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title as="h6" className="mb-3">
                      {editingNote ? t('edit_note') : t('attach_note')}
                    </Card.Title>
                    <Form onSubmit={formik.handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>{t('subject')}</Form.Label>
                        <Form.Control
                          type="text"
                          name="cvi_title"
                          placeholder={t('subject')}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.cvi_title}
                          isInvalid={
                            formik.touched.cvi_title && formik.errors.cvi_title
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.cvi_title}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>{t('note')}</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="cvi_description"
                          placeholder={t('note')}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.cvi_description}
                          isInvalid={
                            formik.touched.cvi_description &&
                            formik.errors.cvi_description
                          }
                          maxLength={425}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.cvi_description}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Row>
                        <Col>
                          <div className="d-flex gap-2 justify-content-end">
                            {editingNote && (
                              <Button
                                variant="secondary"
                                onClick={handleCancelEdit}
                              >
                                {t('cancel')}
                              </Button>
                            )}
                            <Button
                              variant="success"
                              type="submit"
                              disabled={
                                addConversationInformation.isPending ||
                                updateConversationInformation.isPending ||
                                !formik.dirty
                              }
                            >
                              {(addConversationInformation.isPending ||
                                updateConversationInformation.isPending) && (
                                <Spinner
                                  as="span"
                                  size="sm"
                                  animation="border"
                                  role="status"
                                  aria-hidden="true"
                                  className="me-2"
                                />
                              )}
                              {editingNote ? t('update') : t('submit')}
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              )}

              {/* Notes List */}
              <Card>
                <Card.Body>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                      <FaRedoAlt className="text-muted me-2" size={14} />
                      <h6 className="mb-0 fw-bold">{t('notes_log')}</h6>
                    </div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={refetch}
                      disabled={isFetching}
                      className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                      style={{ width: '32px', height: '32px' }}
                      data-tooltip={t('refresh')}
                    >
                      {isFetching ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <FaRedoAlt size={12} />
                      )}
                    </Button>
                  </div>

                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div
                        key={comment.cvi_id}
                        className="d-flex py-3 border-top"
                      >
                        <div className="flex-shrink-0 me-3">
                          <div className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center">
                            <FaUser className="text-primary" size={16} />
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="mb-0">
                              {comment?.created_by}
                              <small className="text-muted ms-2">
                                {formatDate(comment.cvi_create_time)}
                              </small>
                            </h6>
                            <div className="d-flex gap-2">
                              {canEdit && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="p-0 text-primary"
                                  onClick={() => handleEdit(comment)}
                                  data-tooltip={t('edit')}
                                >
                                  <FaEdit size={14} />
                                </Button>
                              )}
                              {canDelete && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="p-0 text-danger"
                                  onClick={() => {
                                    setNoteToDelete(comment);
                                    setDeleteModal(true);
                                  }}
                                  data-tooltip={t('delete')}
                                >
                                  <FaTrash size={14} />
                                </Button>
                              )}
                            </div>
                          </div>
                          <h6 className="mb-2">
                            <strong>{t('subject')}:</strong>{' '}
                            {comment?.cvi_title}
                          </h6>
                          <p className="text-muted mb-0">
                            {comment.cvi_description}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted py-3 text-center mb-0">
                      {t('no_notes_available')}
                    </p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('close')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModal}
        toggle={() => {
          setDeleteModal(false);
          setNoteToDelete(null);
        }}
        onDeleteClick={handleDelete}
        isPending={deleteConversationInformation.isPending}
        itemName={noteToDelete?.cvi_title || t('note')}
      />
    </>
  );
};

AttachNoteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  ownerId: PropTypes.number.isRequired,
  ownerTypeId: PropTypes.number.isRequired,
  title: PropTypes.string,
};

export default AttachNoteModal;
