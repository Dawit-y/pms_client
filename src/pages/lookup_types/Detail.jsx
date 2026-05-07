import { useState, useEffect } from 'react';
import {
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Button,
  Badge,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import DeleteModal from '../../components/Common/DeleteModal';
import FetchErrorHandler from '../../components/Common/FetchErrorHandler';
import { usePermissions } from '../../hooks/usePermissions';
import {
  useFetchLookupType,
  useDeleteLookupType,
} from '../../queries/lookup_types_query';

const LookupTypeDetails = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('details');
  }, [t]);

  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const [deleteModal, setDeleteModal] = useState(false);

  const {
    data: lookup_type,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchLookupType(id);

  const deleteLookupTypeMutation = useDeleteLookupType();

  const handleDelete = async () => {
    if (lookup_type?.uuid) {
      await deleteLookupTypeMutation.mutateAsync(lookup_type.uuid);
      navigate('/lookup_types');
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

  if (isLoading) {
    return (
      <div className="page-content">
        <Container
          fluid
          className="d-flex justify-content-center align-items-center"
        >
          <Spinner animation="border" variant="primary" />
        </Container>
      </div>
    );
  }

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <div className="page-content">
      <>
        <Breadcrumbs
          items={[
            { label: t('lookup_types'), path: '/lookup_types' },
            { label: t('details'), active: true },
          ]}
        />

        <Row>
          <Col lg={12}>
            <Card>
              <Card.Body>
                {/* Header with title and buttons */}
                <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                  <div>
                    <h4 className="card-title mb-1">
                      {lookup_type?.lkt_type_name}
                    </h4>
                  </div>
                  <div className="d-flex gap-2">
                    {hasPermission('lookuptype.edit_lookuptype') && (
                      <Button
                        variant="success"
                        onClick={() =>
                          navigate(`/lookup_types/${lookup_type?.uuid}/edit`)
                        }
                      >
                        <FaEdit className="me-1" /> {t('edit')}
                      </Button>
                    )}
                    {hasPermission('lookuptype.delete_lookuptype') && (
                      <Button
                        variant="danger"
                        onClick={() => setDeleteModal(true)}
                      >
                        <FaTrash className="me-1" /> {t('delete')}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Details */}
                <Row className="mt-4">
                  <Col md={6} className="mb-3">
                    <div className="mb-3">
                      <h6 className="text-muted">{t('lkt_type_code')}</h6>
                      <p className="mb-0 fs-5">
                        {renderFieldValue(
                          { type: 'String' },
                          lookup_type?.lkt_type_code
                        )}
                      </p>
                    </div>
                  </Col>

                  <Col md={6} className="mb-3">
                    <div className="mb-3">
                      <h6 className="text-muted">{t('lkt_type_name')}</h6>
                      <p className="mb-0 fs-5">
                        {renderFieldValue(
                          { type: 'String' },
                          lookup_type?.lkt_type_name
                        )}
                      </p>
                    </div>
                  </Col>

                  <Col md={12} className="mb-3">
                    <div className="mb-3">
                      <h6 className="text-muted">{t('lkt_remark')}</h6>
                      <p className="mb-0">
                        {renderFieldValue(
                          { type: 'String' },
                          lookup_type?.lkt_remark
                        )}
                      </p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <DeleteModal
          isOpen={deleteModal}
          toggle={() => setDeleteModal(false)}
          onDeleteClick={handleDelete}
          isPending={deleteLookupTypeMutation.isPending}
          itemName={lookup_type?.lkt_type_name || t('lookup_type')}
        />
      </>
    </div>
  );
};

export default LookupTypeDetails;
