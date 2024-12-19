import React, { useMemo, useState } from 'react';
import { Select, Table } from 'antd';
import type { SelectProps } from 'antd/es/select';
import type { TableProps } from 'antd/es/table';

interface TableSelectProps<T extends object> extends Omit<SelectProps, 'options'> {
  dataSource: T[];
  columns: TableProps<T>['columns'];
  rowKey: keyof T | ((record: T) => string);
  valueKey: keyof T;
  labelKey: keyof T;
}

const TableSelect = <T extends object>({
  dataSource,
  columns = [],
  rowKey,
  valueKey,
  labelKey,
  mode,
  value,
  onChange,
  ...restProps
}: TableSelectProps<T>) => {
  const [open, setOpen] = useState(false);

  // 将数据转换为Select需要的options格式
  const options = useMemo(() => {
    return dataSource.map((item) => ({
      value: item[valueKey],
      label: item[labelKey],
    }));
  }, [dataSource, valueKey, labelKey]);

  // 获取当前选中的行key数组
  const selectedRowKeys = useMemo(() => {
    if (mode === 'multiple') {
      return (value as any[]) || [];
    }
    return value ? [value] : [];
  }, [value, mode]);

  // 自定义下拉内容
  const dropdownRender = () => {
    return (
      <div style={{ padding: 0 }}>
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey={rowKey as any}
          rowSelection={{
            type: 'checkbox'//mode === 'multiple' ? 'checkbox' : 'radio',
            selectedRowKeys,
            onChange: (selectedKeys: React.Key[]) => {
              if (mode === 'multiple') {
                onChange?.(selectedKeys);
              } else {
                onChange?.(selectedKeys[0]);
                setOpen(false);
              }
            },
            selections: true,
            hideSelectAll: mode !== 'multiple'
          }}
          size="small"
          pagination={false}
          scroll={{ y: 300 }}
          onRow={(record) => ({
            onClick: () => {
              const key = typeof rowKey === 'function' ? rowKey(record) : record[rowKey];
              if (mode === 'multiple') {
                const newSelectedKeys = selectedRowKeys.includes(key)
                  ? selectedRowKeys.filter(k => k !== key)
                  : [...selectedRowKeys, key];
                onChange?.(newSelectedKeys);
              } else {
                onChange?.(key);
                setOpen(false);
              }
            },
          })}
          style={{ width: '100%' }}
        />
      </div>
    );
  };

  return (
    <Select
      {...restProps}
      value={value}
      mode={mode}
      open={open}
      onDropdownVisibleChange={setOpen}
      options={options}
      dropdownRender={dropdownRender}
      style={{ minWidth: 200, ...restProps.style }}
      dropdownStyle={{ 
        padding: 0,
        minWidth: 500
      }}
    />
  );
};

export default TableSelect;
