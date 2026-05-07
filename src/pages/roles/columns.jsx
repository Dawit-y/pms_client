import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router';

import ActionsCell from '../../components/Common/ActionsCell';
import { snColumn } from '../../components/Common/TableContainer/snColumnDef';

export const useRoleColumns = (onDelete, hasPermission, onDuplicate) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const searchString = searchParams.toString();
  const queryString = searchString ? `?${searchString}` : '';

  const columns = [
    snColumn,
    {
      accessorKey: 'name',
      header: t('name'),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'user_count',
      header: t('users_count'),
      cell: (info) => info.getValue() ?? 0,
    },
    {
      header: t('actions'),
      id: 'actions',
      size: 100,
      cell: (info) => {
        const id = info.row.original.id;
        return (
          <ActionsCell
            id={id}
            onEdit={
              hasPermission('auth.change_group')
                ? () => navigate(`/roles/${id}/edit${queryString}`)
                : undefined
            }
            onDelete={
              hasPermission('auth.delete_group')
                ? () => onDelete(info.row.original)
                : undefined
            }
            onDuplicate={
              hasPermission('auth.add_group')
                ? () => onDuplicate(info.row.original)
                : undefined
            }
          />
        );
      },
    },
  ];

  return columns;
};
