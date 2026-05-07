import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';

import Breadcrumb from '../../components/Common/Breadcrumb';
import LookupsForm from './Form';

const AddLookup = () => {
  const { t } = useTranslation();
  const { activeTypeName, typeId } = useOutletContext();

  useEffect(() => {
    document.title = t('add_lookup');
  }, [t]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: t('lookups'), path: `/lookups/type/${typeId}` },
          { label: t('add_lookup') },
        ]}
      />
      <h5 className="mb-4">
        {t('add_lookup')} {activeTypeName ? `(${activeTypeName})` : ''}
      </h5>
      <LookupsForm />
    </>
  );
};

export default AddLookup;
