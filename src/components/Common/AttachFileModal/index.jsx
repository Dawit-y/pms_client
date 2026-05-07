import { useCallback, memo, useState } from 'react';
import { Modal, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  FaPaperclip,
  FaRedoAlt,
  FaFilePdf,
  FaFileImage,
  FaTimes,
  FaArrowLeft,
} from 'react-icons/fa';

import { usePermissions } from '../../../hooks/usePermissions';
import {
  useFetchProjectDocuments,
  useDeleteProjectDocument,
} from '../../../queries/project_documents_query';
import DeleteModal from '../DeleteModal';
import FetchErrorHandler from '../FetchErrorHandler';
import PdfViewer from '../PdfViewer';
import FileList from './FileList';
import FileUploadForm from './FileUploadForm';

const API_URL = import.meta.env.VITE_FILE_URL;
const BASE_FILE_PATH = `${API_URL}public/uploads/projectfiles`;

function AttachFileModal({
  isOpen,
  toggle,
  projectId,
  ownerId,
  ownerTypeId,
  title,
  acceptedTypes,
}) {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const [deleteModal, setDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [fileToEdit, setFileToEdit] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isViewingMode, setIsViewingMode] = useState(false);

  const param = {
    prd_owner_type_id: ownerTypeId,
    prd_owner_id: ownerId,
  };

  const {
    data: result,
    isLoading: filesIsLoading,
    isRefetching,
    isError,
    error,
    refetch,
  } = useFetchProjectDocuments(param, isOpen);
  const isLoading = filesIsLoading || isRefetching;

  const deleteProjectDocumentMutation = useDeleteProjectDocument();

  const handleEditClick = useCallback((file) => {
    setFileToEdit(file);
    setSelectedFile(null);
    setIsViewingMode(false);
  }, []);

  const handleDeleteClick = useCallback((file) => {
    setFileToDelete(file);
    setDeleteModal(true);
    setSelectedFile(null);
    setIsViewingMode(false);
  }, []);

  const handleViewClick = useCallback((file) => {
    setSelectedFile(file);
    setIsViewingMode(true);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedFile(null);
    setIsViewingMode(false);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedFile(null);
    setIsViewingMode(false);
    setFileToEdit(null);
    toggle();
  }, [toggle]);

  const confirmDelete = async () => {
    if (fileToDelete) {
      try {
        await deleteProjectDocumentMutation.mutateAsync(fileToDelete.prd_id);
        setDeleteModal(false);
        setFileToDelete(null);
        if (selectedFile?.prd_id === fileToDelete.prd_id) {
          setSelectedFile(null);
          setIsViewingMode(false);
        }
        refetch();
      } catch (error) {
        console.error('Failed to delete file:', error);
      }
    }
  };

  const handleUploadSuccess = () => {
    setFileToEdit(null);
    refetch();
  };

  const handleCancelEdit = () => {
    setFileToEdit(null);
  };

  const canAdd = hasPermission('document.add_document');
  const canEdit = hasPermission('document.edit_document');
  const canDelete = hasPermission('document.delete_document');

  const filePath = selectedFile?.prd_file_path ?? '';
  const isImage = selectedFile
    ? ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(
        selectedFile.prd_file_extension?.toLowerCase()
      )
    : false;

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <>
      <Modal size="xl" show={isOpen} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {isViewingMode ? (
              <div className="d-flex align-items-center">
                <Button
                  variant="link"
                  className="p-0 me-2 text-decoration-none"
                  onClick={handleBackToList}
                  data-tooltip={t('back_to_list')}
                >
                  <FaArrowLeft />
                </Button>
                {isImage ? (
                  <FaFileImage className="text-info me-2" />
                ) : (
                  <FaFilePdf className="text-danger me-2" />
                )}
                {selectedFile?.prd_name}.{selectedFile?.prd_file_extension}
              </div>
            ) : (
              title || t('attach_files')
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Row className="g-0">
            {!isViewingMode && (
              <Col
                md={7}
                lg={8}
                className="border-end"
                style={{ maxHeight: '70vh', overflowY: 'auto' }}
              >
                <div className="p-3">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                      <FaPaperclip className="text-primary me-2" />
                      <h6 className="mb-0 fw-bold">{t('attached_files')}</h6>
                      <span className="badge bg-secondary ms-2">
                        {result?.data?.length || 0}
                      </span>
                    </div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={refetch}
                      disabled={isLoading}
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '32px', height: '32px' }}
                      data-tooltip={t('refresh')}
                    >
                      {isLoading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <FaRedoAlt size={12} />
                      )}
                    </Button>
                  </div>

                  <FileList
                    files={result?.data || []}
                    onEdit={canEdit ? handleEditClick : undefined}
                    onDelete={canDelete ? handleDeleteClick : undefined}
                    onView={handleViewClick}
                    isLoading={isLoading}
                    projectId={projectId}
                    selectedFileId={selectedFile?.prd_id}
                  />
                </div>
              </Col>
            )}

            <Col
              md={isViewingMode ? 12 : 5}
              lg={isViewingMode ? 12 : 4}
              style={{
                maxHeight: '70vh',
                overflowY: 'auto',
                backgroundColor: '#f8f9fa',
              }}
            >
              <div className="p-3">
                {isViewingMode ? (
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        {isImage ? (
                          <FaFileImage className="text-info me-2" />
                        ) : (
                          <FaFilePdf className="text-danger me-2" />
                        )}
                        <h6 className="mb-0 fw-bold">
                          {isImage
                            ? t('image_preview', {
                                defaultValue: 'Image Preview',
                              })
                            : t('pdf_preview')}
                        </h6>
                      </div>
                      <div className="d-flex gap-2">
                        {canDelete && selectedFile?.is_deletable === 1 && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteClick(selectedFile)}
                          >
                            <FaTimes className="me-1" />
                            {t('delete')}
                          </Button>
                        )}
                        {canEdit && selectedFile?.is_editable === 1 && (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleEditClick(selectedFile)}
                          >
                            {t('edit')}
                          </Button>
                        )}
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={handleBackToList}
                        >
                          {t('back_to_list')}
                        </Button>
                      </div>
                    </div>

                    {isImage ? (
                      <div className="text-center p-3 bg-white border rounded">
                        <img
                          src={`${BASE_FILE_PATH}/${filePath}`}
                          alt={selectedFile?.prd_name}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '60vh',
                            objectFit: 'contain',
                          }}
                        />
                      </div>
                    ) : (
                      <PdfViewer filePath={`${BASE_FILE_PATH}/${filePath}`} />
                    )}

                    {selectedFile?.prd_description && (
                      <div className="mt-3 p-3 bg-light rounded">
                        <small className="text-muted">
                          <strong>{t('description')}:</strong>{' '}
                          {selectedFile.prd_description}
                        </small>
                      </div>
                    )}
                  </div>
                ) : (
                  // Upload form section
                  <>
                    {canAdd ? (
                      <FileUploadForm
                        projectId={projectId}
                        ownerId={ownerId}
                        ownerTypeId={ownerTypeId}
                        onSuccess={handleUploadSuccess}
                        onCancel={handleCancelEdit}
                        fileToEdit={fileToEdit}
                        acceptedTypes={acceptedTypes}
                      />
                    ) : (
                      <Alert variant="warning" className="mb-0">
                        {t('no_permission_to_upload')}
                      </Alert>
                    )}
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('close')}
          </Button>
        </Modal.Footer>
      </Modal>

      <DeleteModal
        isOpen={deleteModal}
        toggle={() => {
          setDeleteModal(false);
          setFileToDelete(null);
        }}
        onDeleteClick={confirmDelete}
        isPending={deleteProjectDocumentMutation.isPending}
        itemName={fileToDelete?.prd_name || t('file')}
      />
    </>
  );
}

export default memo(AttachFileModal);
