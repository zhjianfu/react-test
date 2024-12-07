import { Table } from 'antd';
import type { TableProps } from 'antd';

export interface BaseTableProps<T> extends Omit<TableProps<T>, 'pagination'> {
  showPagination?: boolean;
  pageSize?: number;
}

const BaseTable = <T extends object>({
  showPagination = true,
  pageSize = 10,
  ...props
}: BaseTableProps<T>) => {
  return (
    <Table
      {...props}
      pagination={
        showPagination
          ? {
              pageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }
          : false
      }
    />
  );
};

export default BaseTable;
