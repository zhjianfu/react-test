import { useState } from 'react';
import type { TableRowSelection } from 'antd/es/table/interface';

interface UseTableSelectionProps<T> {
  onSelectionChange?: (selectedRows: T[]) => void;
}

export function useTableSelection<T extends { id: string }>({ 
  onSelectionChange 
}: UseTableSelectionProps<T> = {}) {
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  const rowSelection: TableRowSelection<T> = {
    selectedRowKeys: selectedRows.map(row => row.id),
    onChange: (_, rows) => {
      setSelectedRows(rows);
      onSelectionChange?.(rows);
    },
    getCheckboxProps: (record) => ({
      name: record.id,
    }),
  };

  return {
    selectedRows,
    setSelectedRows,
    rowSelection,
    clearSelection: () => setSelectedRows([]),
    hasSelected: selectedRows.length > 0,
  };
}
