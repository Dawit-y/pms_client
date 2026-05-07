import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router';

import ActionsCell from '../../components/Common/ActionsCell';
import { snColumn } from '../../components/Common/TableContainer/snColumnDef';

export const useLookupTypeColumns = (onDelete, hasPermission) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const searchString = searchParams.toString();
  const queryString = searchString ? `?${searchString}` : '';

  return useMemo(
    () => [
      snColumn,
      {
        accessorKey: 'code',
        header: t('lkt type code'),
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'name_en',
        header: t('lkt type name'),
        cell: (info) => info.getValue(),
      },
      {
        header: t('actions'),
        id: 'actions',
        cell: (info) => {
          const id = info.row.original.uuid;
          return (
            <ActionsCell
              id={id}
              onView={() => navigate(`/lookup_types/${id}${queryString}`)}
              onEdit={
                hasPermission('lookuptype.edit_lookuptype')
                  ? () => navigate(`/lookup_types/${id}/edit${queryString}`)
                  : undefined
              }
              onDelete={
                hasPermission('lookuptype.delete_lookuptype')
                  ? () => onDelete(info.row.original)
                  : undefined
              }
            />
          );
        },
      },
    ],
    [t, navigate, hasPermission, onDelete, queryString]
  );
};
