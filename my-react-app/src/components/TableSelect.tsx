import React, { useMemo, useState } from 'react';
import { Select, Table, SelectProps } from 'antd';
import type { TableProps } from 'antd';

interface TableSelectProps<T extends object> extends Omit<SelectProps, 'options'> {
  dataSource: T[];
  columns: TableProps<T>['columns'];
  rowKey: keyof T | ((record: T) => string);
  valueKey: keyof T;
  labelKey: keyof T;
}

const TableSelect = <T extends object>({
  dataSource,
  columns,
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

  // 自定义下拉内容
  const dropdownRender = () => {
    const handleRowClick = (record: T) => {
      const newValue = record[valueKey];
      if (mode === 'multiple') {
        // 多选模式
        const currentValue = (value as any[]) || [];
        const newValues = currentValue.includes(newValue)
          ? currentValue.filter((v) => v !== newValue)
          : [...currentValue, newValue];
        onChange?.(newValues);
      } else {
        // 单选模式
        onChange?.(newValue);
        setOpen(false);
      }
    };

    return (
      <div style={{ padding: 8 }}>
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey={rowKey as any}
          size="small"
          pagination={false}
          scroll={{ y: 300 }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: 'pointer' },
          })}
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
    />
  );
};

export default TableSelect;
