import { useCallback, useEffect, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams, useOutletContext } from 'react-router';

import AdvancedSearch from '../../components/Common/AdvancedSearch';
import Breadcrumb from '../../components/Common/Breadcrumb';
import DeleteModal from '../../components/Common/DeleteModal';
import TableContainer from '../../components/Common/TableContainer';
import { usePermissions } from '../../hooks/usePermissions';
import { useUrlPagination } from '../../hooks/useUrlPagination';
import { useDeleteRole, useSearchRoles } from '../../queries/roles_query';
import { roleExportColumns } from '../../utils/exportColumns/roleExportColumns';
import { useRoleColumns } from './columns';

function Roles() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const { pageFilter, searchConfig } = useOutletContext();
  const { hasPermission } = usePermissions();
  const [deleteModal, setDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  const deleteRoleMutation = useDeleteRole();

  const handleDeleteClick = useCallback((role) => {
    setRoleToDelete(role);
    setDeleteModal(true);
  }, []);

  const handleDuplicateClick = useCallback(
    (role) => {
      navigate(`/roles/add${queryString ? `?${queryString}` : ''}`, {
        state: { duplicateData: role },
      });
    },
    [navigate, queryString]
  );

  const confirmDelete = async () => {
    if (roleToDelete?.id) {
      try {
        await deleteRoleMutation.mutateAsync(roleToDelete.id);
        setDeleteModal(false);
        setRoleToDelete(null);
      } catch (error) {
        console.error('Failed to delete role:', error);
      }
    }
  };

  const { pagination, onChange } = useUrlPagination(
    pageFilter.filters,
    pageFilter.setFilters
  );

  useEffect(() => {
    document.title = t('roles');
  }, [t]);

  const handleAddClick = useCallback(() => {
    navigate(`/roles/add${queryString ? `?${queryString}` : ''}`);
  }, [navigate, queryString]);

  const columns = useRoleColumns(
    handleDeleteClick,
    hasPermission,
    handleDuplicateClick
  );

  return (
    <>
      <div className="page-content">
        <Breadcrumb items={[{ label: t('roles'), active: true }]} />
        <AdvancedSearch
          pageFilter={pageFilter}
          allowEmptySearch={true}
          searchHook={useSearchRoles}
          {...searchConfig}
        >
          {({ result, isLoading }) => {
            return (
              <TableContainer
                data={result?.data ?? []}
                columns={columns}
                isLoading={isLoading}
                isGlobalFilter={true}
                isAddButton={hasPermission('auth.add_group')}
                isCustomPageSize={true}
                isPagination={true}
                onAddClick={handleAddClick}
                tableName={t('roles')}
                exportColumns={roleExportColumns}
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
          isPending={deleteRoleMutation.isPending}
          itemName={roleToDelete ? roleToDelete.name : ''}
        />
      </div>
    </>
  );
}

export default memo(Roles);
