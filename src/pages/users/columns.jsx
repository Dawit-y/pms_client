import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router';

import ActionsCell from '../../components/Common/ActionsCell';
import { snColumn } from '../../components/Common/TableContainer/snColumnDef';

export const useUserColumns = (onDelete, hasPermission, onDuplicate) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const searchString = searchParams.toString();
  const queryString = searchString ? `?${searchString}` : '';

  const columns = [
    snColumn,
    {
      accessorKey: 'first_name',
      header: t('first_name'),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'last_name',
      header: t('last_name'),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'email',
      header: t('email'),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'phone',
      header: t('phone'),
      cell: (info) => info.getValue(),
    },
    {
      header: t('actions'),
      id: 'actions',
      size: 100,
      cell: (info) => {
        const id = info.row.original.uuid;
        return (
          <ActionsCell
            id={id}
            onView={() => navigate(`/users/${id}${queryString}`)}
            onEdit={
              hasPermission('accounts.change_user')
                ? () => navigate(`/users/${id}/edit${queryString}`)
                : undefined
            }
            onDelete={
              hasPermission('accounts.delete_user')
                ? () => onDelete(info.row.original)
                : undefined
            }
            onDuplicate={
              hasPermission('accounts.add_user')
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
