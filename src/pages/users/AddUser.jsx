import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import UsersForm from './Form';

const AddUser = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('add_user');
  }, [t]);

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          items={[
            { label: t('users'), path: '/users' },
            { label: t('add_user'), active: true },
          ]}
        />
        <UsersForm />
      </Container>
    </div>
  );
};

export default AddUser;