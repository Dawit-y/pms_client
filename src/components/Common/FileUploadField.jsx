import React, { useState, useCallback, useEffect } from 'react';
import { Form, Col, Card, Image } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { FaCloudUploadAlt, FaFileImage } from 'react-icons/fa';

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const getAcceptFromTypes = (types = []) => {
  const accept = {};
  types.forEach((type) => {
    const t = type.toLowerCase();
    switch (t) {
      case 'pdf':
        accept['application/pdf'] = [];
        break;
      case 'image':
      case 'image/*':
        accept['image/*'] = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        break;
      case 'jpg':
      case 'jpeg':
        accept['image/jpeg'] = [];
        break;
      case 'png':
        accept['image/png'] = [];
        break;
      case 'gif':
        accept['image/gif'] = [];
        break;
      case 'doc':
        accept['application/msword'] = [];
        break;
      case 'docx':
        accept[
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ] = [];
        break;
      default:
        if (type.includes('/')) {
          accept[type] = [];
        }
        break;
    }
  });
  return accept;
};

const FileUploadField = ({
  formik,
  fieldId,
  acceptedTypes = [],
  className = '',
  label,
  isRequired = false,
  isDisabled = false,
  maxSize = 5,
  isProfilePicture = false,
}) => {
  const { t } = useTranslation();
  const maxSizeBytes = maxSize * 1024 * 1024;

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);

  useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [selectedFiles]);

  const handleAcceptedFiles = useCallback((files) => {
    const updatedFiles = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setSelectedFiles(updatedFiles);
  }, []);

  const handleRejectedFiles = useCallback(
    (rejectedFiles) => {
      const errors = rejectedFiles.map(({ file, errors }) => ({
        fileName: file.path || file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(2),
        errorMessages: errors.map((e) =>
          e.code === 'file-too-large'
            ? `File is too large (${(file.size / (1024 * 1024)).toFixed(
                2
              )} MB). Max size allowed is ${maxSize} MB.`
            : e.message
        ),
      }));
      setFileErrors(errors);
    },
    [maxSize]
  );

  const handleFileChange = useCallback(
    (file) => {
      if (file) {
        formik.setFieldValue(fieldId, file);
        formik.setFieldTouched(fieldId, true, false);
      }
    },
    [formik, fieldId]
  );

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      const validFiles = acceptedFiles.filter(
        (file) => file.size <= maxSizeBytes
      );
      handleRejectedFiles(rejectedFiles);

      if (validFiles.length > 0) {
        handleAcceptedFiles(validFiles);
        handleFileChange(validFiles[0]);
        setFileErrors([]);
      }
    },
    [handleAcceptedFiles, handleRejectedFiles, handleFileChange, maxSizeBytes]
  );

  const isInvalid = formik.touched[fieldId] && formik.errors[fieldId];
  const feedback = isInvalid ? formik.errors[fieldId] : null;

  // Render preview for document mode only
  const renderDocumentPreview = () => {
    if (selectedFiles.length === 0) return null;
    const file = selectedFiles[0];
    return (
      <div className="dropzone-previews mt-3">
        <Card className="mt-1 mb-0 shadow-none border">
          <Card.Body className="p-2">
            <div className="d-flex align-items-center">
              <div className="me-3">
                {file.type.startsWith('image/') ? (
                  <Image
                    src={file.preview}
                    alt="preview"
                    rounded
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <i
                    className={
                      file.name.endsWith('.pdf')
                        ? 'bx bxs-file-pdf text-danger'
                        : file.name.endsWith('.doc') ||
                            file.name.endsWith('.docx')
                          ? 'bx bxs-file-doc text-primary'
                          : 'bx bxs-file text-secondary'
                    }
                    style={{ fontSize: '40px' }}
                  />
                )}
              </div>
              <div className="flex-grow-1">
                <div className="text-muted fw-bold text-truncate">
                  {file.name}
                </div>
                <p className="mb-0">
                  <strong>{file.formattedSize}</strong>
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  };

  // Render dropzone content conditionally
  const renderDropzoneContent = () => {
    if (isProfilePicture && selectedFiles.length > 0) {
      const file = selectedFiles[0];
      const isImage = file.type.startsWith('image/');
      return isImage ? (
        <Image
          src={file.preview}
          alt="Preview"
          roundedCircle
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <div className="d-flex flex-column align-items-center justify-content-center h-100">
          <FaFileImage className="display-3 text-secondary" />
          <span className="small text-center px-2">{file.name}</span>
        </div>
      );
    }
    return (
      <>
        <div className="mb-3">
          <FaCloudUploadAlt className="display-4 text-muted" />
        </div>
        <h6 className="mt-2">
          {t('dropHereOrClick') || 'Drop files here or click to upload'} (Max:{' '}
          {maxSize} MB)
        </h6>
      </>
    );
  };

  return (
    <Col className={className}>
      <Form.Group>
        {label && (
          <Form.Label>
            {label} {isRequired && <span className="text-danger">*</span>}
          </Form.Label>
        )}

        <div className={isProfilePicture ? 'text-center' : ''}>
          <Dropzone
            maxSize={maxSizeBytes}
            accept={getAcceptFromTypes(acceptedTypes)}
            onDrop={onDrop}
            disabled={isDisabled}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className={`${
                  isProfilePicture
                    ? 'd-flex align-items-center justify-content-center mx-auto'
                    : 'dropzone border rounded p-3 text-center'
                } ${isInvalid ? 'border-danger' : ''} ${
                  isDisabled ? 'bg-light' : ''
                }`}
                style={
                  isProfilePicture
                    ? {
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        border: `2px dashed ${isInvalid ? '#dc3545' : '#dee2e6'}`,
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        overflow: 'hidden', // important for image to fill circle
                        backgroundColor:
                          selectedFiles.length === 0
                            ? '#f8f9fa'
                            : 'transparent',
                      }
                    : { cursor: isDisabled ? 'not-allowed' : 'pointer' }
                }
              >
                <input
                  {...getInputProps({
                    name: fieldId,
                    disabled: isDisabled,
                  })}
                />
                {renderDropzoneContent()}
              </div>
            )}
          </Dropzone>
        </div>

        {/* Only show document preview when not in profile picture mode */}
        {!isProfilePicture && renderDocumentPreview()}

        {fileErrors.length > 0 && (
          <div className="mt-2">
            {fileErrors.map((error, idx) => (
              <div key={idx} className="text-danger small">
                {error.fileName} – {error.fileSize} MB:{' '}
                {error.errorMessages.join(', ')}
              </div>
            ))}
          </div>
        )}

        {feedback && (
          <Form.Control.Feedback type="invalid" className="d-block">
            {feedback}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    </Col>
  );
};

export default FileUploadField;
