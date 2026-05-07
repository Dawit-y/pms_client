import { useCallback, useEffect, memo, useState, useMemo } from 'react';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useOutletContext } from 'react-router';

import Breadcrumb from '../../components/Common/Breadcrumb';
import DeleteModal from '../../components/Common/DeleteModal';
import RightOffCanvas from '../../components/Common/RightOffCanvas';
import TableContainer from '../../components/Common/TableContainer';
import { usePermissions } from '../../hooks/usePermissions';
import { useDeleteLookup, useFetchLookups } from '../../queries/lookups_query';
import { lookupExportColumns } from '../../utils/exportColumnsForLists';
import { useLookupColumns } from './columns';

function Lookups() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const { typeId } = useOutletContext();
  const { hasPermission } = usePermissions();
  const [deleteModal, setDeleteModal] = useState(false);
  const [lookupToDelete, setLookupToDelete] = useState(null);

  const [openCanvas, setOpenCanvas] = useState(false);
  const [rowData, setRowData] = useState(null);

  const deleteLookupMutation = useDeleteLookup();

  const { data: result, isLoading } = useFetchLookups({}, true);

  const handleDeleteClick = useCallback((lookup) => {
    setLookupToDelete(lookup);
    setDeleteModal(true);
  }, []);

  const confirmDelete = async () => {
    if (lookupToDelete?.uuid) {
      try {
        await deleteLookupMutation.mutateAsync(lookupToDelete.uuid);
        setDeleteModal(false);
        setLookupToDelete(null);
      } catch (error) {
        console.error('Failed to delete lookup:', error);
      }
    }
  };

  useEffect(() => {
    document.title = t('Lookups');
  }, [t]);

  const handleAddClick = useCallback(() => {
    navigate(`/lookups/type/${typeId}/add`);
  }, [navigate, typeId]);

  const handleCanvasOpen = useCallback((monitoring) => {
    setRowData(monitoring);
    setOpenCanvas(true);
  }, []);

  const handleCanvasClose = useCallback(() => {
    setOpenCanvas(false);
    setRowData(null);
  }, []);

  const columns = useLookupColumns(
    handleDeleteClick,
    handleCanvasOpen,
    hasPermission,
    typeId
  );

  // Client-side filtering and searching
  const filteredResults = useMemo(() => {
    let data = result?.data || [];

    // Filter by typeId
    if (typeId) {
      data = data.filter((item) => item.lookup_type_uuid === typeId);
    }

    return data;
  }, [result, typeId]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: t('lookups') }]} />
      <TableContainer
        key={typeId}
        data={filteredResults}
        columns={columns}
        isLoading={isLoading}
        isGlobalFilter={true}
        isAddButton={hasPermission('lookups.add_lookup')}
        isCustomPageSize={true}
        isPagination={true}
        onAddClick={handleAddClick}
        tableName={t('lookups')}
        exportColumns={lookupExportColumns}
      />

      <DeleteModal
        isOpen={deleteModal}
        toggle={() => setDeleteModal(false)}
        onDeleteClick={confirmDelete}
        isPending={deleteLookupMutation.isPending}
        itemName={lookupToDelete ? `${lookupToDelete.code}` : ''}
      />

      <RightOffCanvas
        handleClick={handleCanvasClose}
        showCanvas={openCanvas}
        canvasWidth={80}
        name={
          rowData
            ? `${t('reasons_for_status')} - ${lang === 'en' ? rowData?.name_en : lang === 'am' ? rowData?.name_am : rowData?.name_or || 'N/A'}`
            : t('reasons')
        }
        id={rowData?.uuid}
        components={{}}
      />
    </>
  );
}

export default memo(Lookups);
