import { useState, useEffect } from 'react';
import { useMemo } from 'react';
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
import {
  FaInfoCircle,
  FaLanguage,
  FaPalette,
  FaEllipsisH,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import ColorBadge from '../../components/Common/ColorBadge';
import DeleteModal from '../../components/Common/DeleteModal';
import FetchErrorHandler from '../../components/Common/FetchErrorHandler';
import { usePermissions } from '../../hooks/usePermissions';
import { useFetchLookupTypes } from '../../queries/lookup_types_query';
import { useFetchLookup, useDeleteLookup } from '../../queries/lookups_query';
import '../../assets/css/formModal.css';
import { createKeyValueMap } from '../../utils/commonMethods';

const LookupDetails = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('details');
  }, [t]);

  const { typeId, id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const [deleteModal, setDeleteModal] = useState(false);

  const { data, isLoading, isError, error, refetch } = useFetchLookup(id);
  const lookup = data?.data;

  const deleteLookupMutation = useDeleteLookup();

  const handleDelete = async () => {
    if (lookup?.lku_id) {
      await deleteLookupMutation.mutateAsync(lookup.lku_id);
      navigate(`/lookups/type/${typeId}`);
    }
  };

  const { data: lookUpTypes } = useFetchLookupTypes({}, true);

  const lookUpTypeMap = useMemo(() => {
    return createKeyValueMap(
      lookUpTypes?.results || [],
      'uuid',
      'lkt_type_name'
    );
  }, [lookUpTypes]);

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
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '50vh' }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: t('lookups'),
            path: `/lookups/type/${lookup?.lookup_type_uuid}`,
          },
          { label: t('details'), active: true },
        ]}
      />

      <Row>
        <Col lg={12}>
          <Card>
            <Card.Body>
              {/* Header with title and buttons */}
              <div className="detail-header">
                <div>
                  <h4>{lookup?.lku_name_en || lookup?.lku_name_or}</h4>
                </div>
                <div className="d-flex gap-2">
                  {hasPermission('lookup.edit_lookup') && (
                    <Button
                      variant="success"
                      onClick={() =>
                        navigate(
                          `/lookups/type/${lookup?.lookup_type_uuid}/${lookup?.uuid}/edit`
                        )
                      }
                    >
                      <FaEdit className="me-1" /> {t('edit')}
                    </Button>
                  )}
                  {hasPermission('lookup.delete_lookup') && (
                    <Button
                      variant="danger"
                      onClick={() => setDeleteModal(true)}
                    >
                      <FaTrash className="me-1" /> {t('delete')}
                    </Button>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div className="form-section">
                <div className="form-section-header">
                  <FaInfoCircle className="section-icon text-primary" />
                  <h6 className="text-primary">{t('basic_information')}</h6>
                </div>
                <Row>
                  <Col md={6} className="mb-3">
                    <div className="detail-field">
                      <h6 className="text-muted">{t('lku_type_id')}</h6>
                      <p>
                        {renderFieldValue(
                          { type: 'String' },
                          lookUpTypeMap[lookup.lookup_type_uuid] ?? ''
                        )}
                      </p>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="detail-field">
                      <h6 className="text-muted">{t('lku_code')}</h6>
                      <p>
                        {renderFieldValue({ type: 'String' }, lookup?.code)}
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Name Translations */}
              <div className="form-section">
                <div className="form-section-header">
                  <FaLanguage className="section-icon text-primary" />
                  <h6 className="text-primary">{t('name_translations')}</h6>
                </div>
                <Row>
                  <Col md={4} className="mb-3">
                    <div className="detail-field">
                      <h6 className="text-muted">{t('lku_name_or')}</h6>
                      <p>
                        {renderFieldValue({ type: 'String' }, lookup?.name_or)}
                      </p>
                    </div>
                  </Col>
                  <Col md={4} className="mb-3">
                    <div className="detail-field">
                      <h6 className="text-muted">{t('lku_name_am')}</h6>
                      <p>
                        {renderFieldValue({ type: 'String' }, lookup?.name_am)}
                      </p>
                    </div>
                  </Col>
                  <Col md={4} className="mb-3">
                    <div className="detail-field">
                      <h6 className="text-muted">{t('lku_name_en')}</h6>
                      <p>
                        {renderFieldValue({ type: 'String' }, lookup?.name_en)}
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Display Settings */}
              <div className="form-section">
                <div className="form-section-header">
                  <FaPalette className="section-icon text-primary" />
                  <h6 className="text-primary">{t('display_settings')}</h6>
                </div>
                <Row>
                  <Col md={6} className="mb-3">
                    <div className="detail-field">
                      <h6 className="text-muted">{t('lku_color_code')}</h6>
                      <ColorBadge color={lookup?.lku_color_code}>
                        {lookup?.lku_color_code ?? 'Unknown'}
                      </ColorBadge>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="detail-field">
                      <h6 className="text-muted">{t('lku_order_id')}</h6>
                      <p>
                        {renderFieldValue(
                          { type: 'Number' },
                          lookup?.sort_order
                        )}
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Additional Information */}
              <div className="form-section">
                <div className="form-section-header">
                  <FaEllipsisH className="section-icon text-primary" />
                  <h6 className="text-primary">
                    {t('additional_information')}
                  </h6>
                </div>
                <Row>
                  <Col md={6} className="mb-3">
                    <div className="detail-field">
                      <h6 className="text-muted">{t('lku_extra_attr1')}</h6>
                      <p>
                        {renderFieldValue(
                          { type: 'String' },
                          lookup?.lku_extra_attr1
                        )}
                      </p>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="detail-field">
                      <h6 className="text-muted">{t('lku_extra_attr2')}</h6>
                      <p>
                        {renderFieldValue(
                          { type: 'String' },
                          lookup?.lku_extra_attr2
                        )}
                      </p>
                    </div>
                  </Col>
                  <Col md={12} className="mb-3">
                    <div className="detail-field">
                      <h6 className="text-muted">{t('lku_remark')}</h6>
                      <p>
                        {renderFieldValue(
                          { type: 'String' },
                          lookup?.lku_remark
                        )}
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <DeleteModal
        isOpen={deleteModal}
        toggle={() => setDeleteModal(false)}
        onDeleteClick={handleDelete}
        isPending={deleteLookupMutation.isPending}
        itemName={lookup?.lku_name_en || lookup?.lku_name_or || t('lookup')}
      />
    </>
  );
};

export default LookupDetails;
