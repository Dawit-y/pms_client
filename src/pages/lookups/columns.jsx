import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import ActionsCell from '../../components/Common/ActionsCell';
import ColorBadge from '../../components/Common/ColorBadge';
import { snColumn } from '../../components/Common/TableContainer/snColumnDef';
import { useFetchLookupTypes } from '../../queries/lookup_types_query';
import { createKeyValueMap } from '../../utils/commonMethods';
import { LOOKUP_TYPE_IDS } from '../../utils/constants/lookUpTypes';

export const useLookupColumns = (
  onDelete,
  onCanvasOpen,
  hasPermission,
  typeId
) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data } = useFetchLookupTypes({}, true);

  const lookUpTypeMap = useMemo(() => {
    return createKeyValueMap(data?.results || [], 'uuid', 'lkt_type_name');
  }, [data]);

  const columns = useMemo(
    () => [
      snColumn,
      {
        accessorKey: 'lookup_type_name',
        header: t('lookup_type_name'),
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
      },
      {
        accessorKey: 'name_or',
        header: t('lku name or'),
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'name_am',
        header: t('lku name am'),
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'name_en',
        header: t('lku name en'),
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'code',
        header: t('lku code'),
        cell: (info) => info.getValue(),
      },
      {
        header: t('actions'),
        id: 'actions',
        size: 100,
        pinned: 'right',
        cell: (info) => {
          const id = info.row.original.uuid;

          return (
            <ActionsCell
              id={id}
              onCanvasToggle={
                info.row.original.lku_type_id === LOOKUP_TYPE_IDS.PROJECT_STATUS
                  ? () => onCanvasOpen(info.row.original)
                  : undefined
              }
              onView={() => navigate(`/lookups/type/${typeId}/${id}`)}
              onEdit={
                hasPermission('lookup.edit_lookup')
                  ? () => navigate(`/lookups/type/${typeId}/${id}/edit`)
                  : undefined
              }
              onDelete={
                hasPermission('lookup.delete_lookup')
                  ? () => onDelete(info.row.original)
                  : undefined
              }
            />
          );
        },
      },
    ],
    [t, navigate, hasPermission, onDelete, lookUpTypeMap, typeId, onCanvasOpen]
  );

  return columns;
};
