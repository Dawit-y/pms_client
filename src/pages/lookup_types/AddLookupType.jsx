import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import LookupTypesForm from './Form';

const AddLookupType = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('add_lookup_type');
  }, [t]);

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          items={[
            { label: t('lookup_types'), path: '/lookup_types' },
            { label: t('add_lookup_type'), active: true },
          ]}
        />
        <LookupTypesForm />
      </Container>
    </div>
  );
};

export default AddLookupType;
