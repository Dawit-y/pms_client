import { useCallback, useEffect, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams, useOutletContext } from 'react-router';

import AdvancedSearch from '../../components/Common/AdvancedSearch';
import Breadcrumb from '../../components/Common/Breadcrumb';
import DeleteModal from '../../components/Common/DeleteModal';
import TableContainer from '../../components/Common/TableContainer';
import { usePermissions } from '../../hooks/usePermissions';
import { useUrlPagination } from '../../hooks/useUrlPagination';
import { useDeleteUser, useSearchUsers } from '../../queries/users_query';
import { userExportColumns } from '../../utils/exportColumns/userExportColumns';
import { useUserColumns } from './columns';

function Users() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const { pageFilter, searchConfig } = useOutletContext();
  const { hasPermission } = usePermissions();
  const [deleteModal, setDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const deleteUserMutation = useDeleteUser();

  const handleDeleteClick = useCallback((user) => {
    setUserToDelete(user);
    setDeleteModal(true);
  }, []);

  const handleDuplicateClick = useCallback(
    (user) => {
      navigate(`/users/add${queryString ? `?${queryString}` : ''}`, {
        state: { duplicateData: user },
      });
    },
    [navigate, queryString]
  );

  const confirmDelete = async () => {
    if (userToDelete?.id) {
      try {
        await deleteUserMutation.mutateAsync(userToDelete.id);
        setDeleteModal(false);
        setUserToDelete(null);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const { pagination, onChange } = useUrlPagination(
    pageFilter.filters,
    pageFilter.setFilters
  );

  useEffect(() => {
    document.title = t('Users');
  }, [t]);

  const handleAddClick = useCallback(() => {
    navigate(`/users/add${queryString ? `?${queryString}` : ''}`);
  }, [navigate, queryString]);

  const columns = useUserColumns(
    handleDeleteClick,
    hasPermission,
    handleDuplicateClick
  );

  return (
    <>
      <div className="page-content">
        <Breadcrumb items={[{ label: t('users'), active: true }]} />
        <AdvancedSearch
          pageFilter={pageFilter}
          allowEmptySearch={true}
          searchHook={useSearchUsers}
          {...searchConfig}
        >
          {({ result, isLoading }) => {
            return (
              <TableContainer
                data={result?.data ?? []}
                columns={columns}
                isLoading={isLoading}
                isGlobalFilter={true}
                isAddButton={hasPermission('accounts.add_user')}
                isCustomPageSize={true}
                isPagination={true}
                onAddClick={handleAddClick}
                tableName={t('users')}
                exportColumns={userExportColumns}
                paginationState={pagination}
                isServerSidePagination={true}
                onPaginationChange={onChange}
                totalRows={result?.pagination?.total}
                pageCount={result?.pagination?.total_pages}
              />
            );
          }}
        </AdvancedSearch>

        <DeleteModal
          isOpen={deleteModal}
          toggle={() => setDeleteModal(false)}
          onDeleteClick={confirmDelete}
          isPending={deleteUserMutation.isPending}
          itemName={userToDelete ? `userToDelete.id` : ''}
        />
      </div>
    </>
  );
}

export default memo(Users);
