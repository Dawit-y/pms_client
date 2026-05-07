import { useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import { useFetchLookupType } from '../../queries/lookup_types_query';
import LookupTypesForm from './Form';

const EditLookupType = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('edit_lookup_type');
  }, [t]);
  const { id } = useParams();
  const { data: lookup_type, isLoading } = useFetchLookupType(id);

  if (isLoading) {
    return (
      <div className="page-content">
        <Container
          fluid
          className="w-100 h-100 d-flex align-items-center justify-content-center"
        >
          <Spinner animation="border" variant="primary" />
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          items={[
            { label: t('lookup_types'), path: '/lookup_types' },
            { label: t('edit_lookup_type'), active: true },
          ]}
        />
        <LookupTypesForm isEdit={true} rowData={lookup_type} />
      </Container>
    </div>
  );
};

export default EditLookupType;
