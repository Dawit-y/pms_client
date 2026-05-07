import { useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import FetchErrorHandler from '../../components/Common/FetchErrorHandler';
import { useFetchRole } from '../../queries/roles_query';
import RolesForm from './Form';

const EditRole = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { state } = useLocation();

  useEffect(() => {
    document.title = t('edit_role');
  }, [t]);

  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchRole(id);

  const roleData = state?.duplicateData || result?.data;

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

  if (isError) {
    return (
      <div className="page-content">
        <Container fluid>
          <FetchErrorHandler error={error} refetch={refetch} />
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          items={[
            { label: t('roles'), path: '/roles' },
            { label: t('edit_role'), active: true },
          ]}
        />
        <RolesForm isEdit={!state?.duplicateData} rowData={roleData} />
      </Container>
    </div>
  );
};

export default EditRole;
