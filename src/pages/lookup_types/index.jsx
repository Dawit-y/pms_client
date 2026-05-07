import { useCallback, useEffect, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams, useOutletContext } from 'react-router';

import AdvancedSearch from '../../components/Common/AdvancedSearch';
import Breadcrumb from '../../components/Common/Breadcrumb';
import DeleteModal from '../../components/Common/DeleteModal';
import TableContainer from '../../components/Common/TableContainer';
import { usePermissions } from '../../hooks/usePermissions';
import { useUrlPagination } from '../../hooks/useUrlPagination';
import {
  useDeleteLookupType,
  useSearchLookupTypes,
} from '../../queries/lookup_types_query';
import { lookupTypeExportColumns } from '../../utils/exportColumnsForLists';
import { useLookupTypeColumns } from './columns';

function LookupTypes() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const { pageFilter, searchConfig } = useOutletContext();
  const { hasPermission } = usePermissions();
  const [deleteModal, setDeleteModal] = useState(false);
  const [lookup_typeToDelete, setLookupTypeToDelete] = useState(null);

  const deleteLookupTypeMutation = useDeleteLookupType();

  const handleDeleteClick = useCallback((lookup_type) => {
    setLookupTypeToDelete(lookup_type);
    setDeleteModal(true);
  }, []);

  const confirmDelete = async () => {
    if (lookup_typeToDelete?.uuid) {
      try {
        await deleteLookupTypeMutation.mutateAsync(lookup_typeToDelete.uuid);
        setDeleteModal(false);
        setLookupTypeToDelete(null);
      } catch (error) {
        console.error('Failed to delete lookup_type:', error);
      }
    }
  };

  const { pagination, onChange } = useUrlPagination(
    pageFilter.filters,
    pageFilter.setFilters
  );

  useEffect(() => {
    document.title = t('LookupTypes');
  }, [t]);

  const handleAddClick = useCallback(() => {
    navigate(`/lookup_types/add${queryString ? `?${queryString}` : ''}`);
  }, [navigate, queryString]);

  const columns = useLookupTypeColumns(handleDeleteClick, hasPermission);

  return (
    <>
      <div className="page-content">
        <Breadcrumb items={[{ label: t('lookup_types'), active: true }]} />
        <AdvancedSearch
          searchHook={useSearchLookupTypes}
          pageFilter={pageFilter}
          allowEmptySearch={true}
          {...searchConfig}
        >
          {({ result, isLoading }) => {
            return (
              <TableContainer
                data={result?.data ?? []}
                columns={columns}
                isLoading={isLoading}
                isGlobalFilter={true}
                isAddButton={hasPermission('lookuptype.add_lookuptype')}
                isCustomPageSize={true}
                isPagination={true}
                onAddClick={handleAddClick}
                tableName={t('lookup_types')}
                exportColumns={lookupTypeExportColumns}
                paginationState={pagination}
                isServerSidePagination={true}
                onPaginationChange={onChange}
                totalRows={result?.meta?.total}
                pageCount={result?.meta?.total_pages}
              />
            );
          }}
        </AdvancedSearch>

        <DeleteModal
          isOpen={deleteModal}
          toggle={() => setDeleteModal(false)}
          onDeleteClick={confirmDelete}
          isPending={deleteLookupTypeMutation.isPending}
          itemName={
            lookup_typeToDelete ? `${lookup_typeToDelete.lkt_type_name}` : ''
          }
        />
      </div>
    </>
  );
}

export default memo(LookupTypes);
