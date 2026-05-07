import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import RolesForm from './Form';

const AddRole = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('add_role');
  }, [t]);

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          items={[
            { label: t('roles'), path: '/roles' },
            { label: t('add_role'), active: true },
          ]}
        />
        <RolesForm />
      </Container>
    </div>
  );
};

export default AddRole;
