import { useState } from 'react';
import { Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router';

import DeleteModal from '../../components/Common/DeleteModal';
import { usePermissions } from '../../hooks/usePermissions';
import { useDeleteUser } from '../../queries/users_query';

function OverviewTab({ user }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const [deleteModal, setDeleteModal] = useState(false);
  const deleteUserMutation = useDeleteUser();

  const handleDelete = async () => {
    if (user?.uuid) {
      await deleteUserMutation.mutateAsync(user.uuid);
      navigate('/users');
    }
  };

  // Helper function to render field value based on type
  const renderFieldValue = (field, value) => {
    if (value === undefined || value === null) return '—';

    switch (field.type) {
      case 'Boolean':
        return value ? t('yes') : t('no');
      case 'Number':
        return typeof value === 'number' ? value.toLocaleString() : value;
      case 'Date':
        return new Date(value).toLocaleDateString();
      default:
        return value;
    }
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="card-title mb-1">user.uuid</h4>
          <p className="text-muted mb-0">
            {t('user_id')}: {user.uuid}
          </p>
        </div>
        <div className="d-flex gap-2">
          {hasPermission('accounts.change_user') && (
            <Button
              variant="success"
              onClick={() => navigate(`/users/${user.uuid}/edit`)}
            >
              <FaEdit className="me-1" /> {t('edit')}
            </Button>
          )}
          {hasPermission('accounts.delete_user') && (
            <Button variant="danger" onClick={() => setDeleteModal(true)}>
              <FaTrash className="me-1" /> {t('delete')}
            </Button>
          )}
        </div>
      </div>

      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <div className="mb-3">
            <h6 className="text-muted">{t('first name')}</h6>

            <p className="mb-0">
              {renderFieldValue({ type: 'String' }, user.first_name)}
            </p>
          </div>
        </Col>
        <Col md={6} className="mb-3">
          <div className="mb-3">
            <h6 className="text-muted">{t('last name')}</h6>

            <p className="mb-0">
              {renderFieldValue({ type: 'String' }, user.last_name)}
            </p>
          </div>
        </Col>
        <Col md={6} className="mb-3">
          <div className="mb-3">
            <h6 className="text-muted">{t('email')}</h6>

            <p className="mb-0">
              {renderFieldValue({ type: 'String' }, user.email)}
            </p>
          </div>
        </Col>
        <Col md={6} className="mb-3">
          <div className="mb-3">
            <h6 className="text-muted">{t('phone')}</h6>

            <p className="mb-0">
              {renderFieldValue({ type: 'String' }, user.phone)}
            </p>
          </div>
        </Col>
      </Row>

      <DeleteModal
        isOpen={deleteModal}
        toggle={() => setDeleteModal(false)}
        onDeleteClick={handleDelete}
        isPending={deleteUserMutation.isPending}
        itemName={user.title || user.first_name || 'item'}
      />
    </>
  );
}

export default OverviewTab;
