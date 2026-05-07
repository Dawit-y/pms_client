import { memo } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  FaFilePdf,
  FaFileImage,
  FaEdit,
  FaTrash,
  FaDownload,
  FaEye,
} from 'react-icons/fa';

import { formatDistanceToNow } from '../../../utils/commonMethods';

const API_URL = import.meta.env.VITE_FILE_URL;
const BASE_FILE_PATH = `${API_URL}public/uploads/projectfiles`;

const formatFileSize = (bytes) => {
  if (!bytes || isNaN(bytes)) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const FileList = ({
  files,
  onEdit,
  onDelete,
  onView,
  isLoading,
  selectedFileId,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="text-muted mt-2">{t('loading_files')}</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-3">
          <FaFilePdf size={48} className="text-muted opacity-50" />
        </div>
        <h6 className="text-muted">{t('no_files_attached')}</h6>
        <p className="text-muted small">{t('upload_files_to_get_started')}</p>
      </div>
    );
  }

  return (
    <div>
      {files.map((file) => {
        const isSelected = selectedFileId === file.prd_id;
        const filePath = file?.prd_file_path ?? '';
        const ext = file.prd_file_extension?.toLowerCase();
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);

        return (
          <div
            key={file.prd_id}
            className={`d-flex align-items-center p-2 mb-2 rounded ${
              isSelected ? 'bg-primary bg-opacity-10 border border-primary' : ''
            }`}
            style={{
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              backgroundColor: isSelected ? '#e6f0ff' : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <div className="me-3">
              {isImage ? (
                <FaFileImage className="text-info" size={24} />
              ) : (
                <FaFilePdf className="text-danger" size={24} />
              )}
            </div>

            <div className="flex-grow-1" style={{ minWidth: 0 }}>
              <div className="d-flex align-items-center gap-2">
                <h6
                  className="mb-0 text-truncate"
                  style={{ maxWidth: '200px' }}
                >
                  {file.prd_name}
                </h6>
                <span
                  className={`badge ${isImage ? 'bg-info' : 'bg-danger'} text-white`}
                >
                  {(file.prd_file_extension || 'PDF').toUpperCase()}
                </span>
              </div>

              <div className="d-flex align-items-center gap-3 mt-1">
                <small className="text-muted">
                  {formatFileSize(file.prd_size)}
                </small>
                <small className="text-muted">
                  {formatDistanceToNow(file.prd_create_time)}
                </small>
              </div>

              {file.prd_description && (
                <small className="text-muted d-block text-truncate">
                  {file.prd_description}
                </small>
              )}
            </div>

            <div className="d-flex gap-1 ms-2" style={{ opacity: 0.7 }}>
              <Button
                variant="link"
                size="sm"
                className="p-1 text-primary"
                href={`${BASE_FILE_PATH}/${filePath}`}
                target="_blank"
                data-tooltip={t('download')}
              >
                <FaDownload size={14} />
              </Button>

              <Button
                variant="link"
                size="sm"
                className="p-1 text-danger"
                onClick={() => onView(file)}
                data-tooltip={t('view_pdf')}
              >
                <FaEye size={14} />
              </Button>

              {onEdit && file.is_editable === 1 && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-1 text-success"
                  onClick={() => onEdit(file)}
                  data-tooltip={t('edit')}
                >
                  <FaEdit size={14} />
                </Button>
              )}

              {onDelete && file.is_deletable === 1 && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-1 text-danger"
                  onClick={() => onDelete(file)}
                  data-tooltip={t('delete')}
                >
                  <FaTrash size={14} />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(FileList);
