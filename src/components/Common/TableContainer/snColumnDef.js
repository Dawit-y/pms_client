export const snColumn = {
  id: 'sn',
  header: 'S.N',
  cell: ({ row, table }) => {
    const { pageIndex, pageSize } = table.getState().pagination;
    const pageRows = table.getRowModel().rows;
    const rowIndexInPage = pageRows.findIndex((r) => r.id === row.id);
    return (pageIndex * pageSize + rowIndexInPage + 1).toLocaleString();
  },
  enableSorting: false,
  enableColumnFilter: false,
  maxSize: 50,
};
