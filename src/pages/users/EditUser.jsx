import { useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import { useFetchUser } from '../../queries/users_query';
import UsersForm from './Form';

const EditUser = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('edit_user');
  }, [t]);
  const { id } = useParams();
  const { data: user, isLoading } = useFetchUser(id);

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
            { label: t('users'), path: '/users' },
            { label: t('edit_user'), active: true },
          ]}
        />
        <UsersForm isEdit={true} rowData={user?.data} />
      </Container>
    </div>
  );
};

export default EditUser;
