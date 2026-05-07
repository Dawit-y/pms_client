import { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useOutletContext, useParams } from 'react-router';

import Breadcrumb from '../../components/Common/Breadcrumb';
import { useFetchLookup } from '../../queries/lookups_query';
import LookupsForm from './Form';

const EditLookup = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { activeTypeName, typeId } = useOutletContext();
  const { data: lookup, isLoading } = useFetchLookup(id);

  useEffect(() => {
    document.title = t('edit_lookup');
  }, [t]);

  if (isLoading) {
    return (
      <div className="w-100 h-100 d-flex align-items-center justify-content-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: t('lookups'), path: `/lookups/type/${typeId}` },
          { label: t('edit_lookup') },
        ]}
      />
      <h5 className="mb-4">
        {t('edit_lookup')} {activeTypeName ? `(${activeTypeName})` : ''}
      </h5>
      <LookupsForm isEdit={true} rowData={lookup} />
    </>
  );
};

export default EditLookup;
