import React, { useMemo, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { Select, Table, Input, SelectProps, TableProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import type { RequestParams, ResponseData } from './types';
import type { DefaultOptionType } from 'antd/es/select';

interface TableSelectProps<T extends object> extends Omit<SelectProps, 'options'> {
  dataSource?: T[];
  columns: TableProps<T>['columns'];
  rowKey: keyof T | ((record: T) => string);
  valueKey: keyof T;
  labelKey: keyof T;
  idKey?: keyof T;  
  pageSize?: number;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchKeys?: string[];
  request?: (params: RequestParams) => Promise<ResponseData<T>>;
  extraParams?: Record<string, any>;
}

const TableSelect = <T extends object>({
  dataSource: propDataSource,
  columns = [],
  rowKey,
  valueKey,
  labelKey,
  idKey,  
  mode,
  value,
  onChange,
  pageSize = 25,
  showSearch = true,
  searchPlaceholder = '请输入关键词搜索',
  searchKeys = [],
  request,
  extraParams = {},
  ...restProps
}: TableSelectProps<T>) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [localDataSource, setLocalDataSource] = useState<T[]>([]);
  const [total, setTotal] = useState(0);

  const debouncedFetchRef = useRef(
    debounce(async (params: RequestParams) => {
      if (!request) return;
      setLoading(true);
      try {
        const res = await request({
          ...params,
          ...extraParams
        });
        setLocalDataSource(res.list);
        setTotal(res.total);
      } catch (error) {
        console.error('Fetch data error:', error);
      } finally {
        setLoading(false);
      }
    }, 300)
  );

  const getFilteredDataSource = useCallback((data: T[]) => {
    if (!searchText || !data?.length) return data;
    const searchLower = searchText.toLowerCase();
    return data.filter(item => {
      if (searchKeys.length > 0) {
        return searchKeys.some(key => 
          String(item[key as keyof T]).toLowerCase().includes(searchLower)
        );
      }
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchLower)
      );
    });
  }, [searchText, searchKeys]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    if (request) {
      debouncedFetchRef.current({
        page: 1,
        pageSize: currentPageSize,
        search: value,
      });
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number, size?: number) => {
    const newSize = size || currentPageSize;
    setCurrentPage(page);
    setCurrentPageSize(newSize);
    if (request) {
      debouncedFetchRef.current({
        page,
        pageSize: newSize,
        search: searchText,
      });
    }
  };

  const currentDataSource = useMemo(() => {
    if (request) {
      return localDataSource;
    }
    const filteredData = getFilteredDataSource(propDataSource || []);
    const start = (currentPage - 1) * currentPageSize;
    const end = start + currentPageSize;
    return filteredData.slice(start, end);
  }, [request, localDataSource, propDataSource, getFilteredDataSource, currentPage, currentPageSize]);

  const totalCount = useMemo(() => {
    if (request) {
      return total;
    }
    return getFilteredDataSource(propDataSource || []).length;
  }, [request, total, getFilteredDataSource, propDataSource]);

  const options = useMemo(() => {
    const data = request ? localDataSource : propDataSource || [];
    return data.map((item) => ({
      value: String(item[valueKey]),  // 确保 value 是字符串
      label: String(item[labelKey]),  // 确保 label 是字符串
    })) as DefaultOptionType[];
  }, [request, localDataSource, propDataSource, valueKey, labelKey]);

  const selectedRowKeys = useMemo(() => {
    if (!value) return [];
    if (mode === 'multiple') {
      return (value as any[]).map(v => String(v));
    }
    return [String(value)];
  }, [value, mode]);

  const handleSelect = useCallback((selectedValue: any, selected: boolean) => {
    console.log('handleSelect:', { selectedValue, selected, currentValue: value });
    if (mode === 'multiple') {
      const currentValue = Array.isArray(value) ? value : [];
      const newValue = selected
        ? [...currentValue, selectedValue]
        : currentValue.filter(v => String(v) !== String(selectedValue));
      onChange?.(newValue);
    } else {
      onChange?.(selectedValue);
      setOpen(false);
    }
  }, [mode, value, onChange]);

  const handleSelectAll = useCallback((selected: boolean, changeRows: T[]) => {
    if (!mode || mode !== 'multiple') return;
    const changedValues = changeRows.map(row => String(row[valueKey]));
    const currentValue = Array.isArray(value) ? value : [];
    const newValue = selected
      ? [...new Set([...currentValue, ...changedValues])]
      : currentValue.filter(v => !changedValues.includes(String(v)));
    onChange?.(newValue);
  }, [mode, value, onChange, valueKey]);

  useEffect(() => {
    if (request && open) {
      debouncedFetchRef.current({
        page: currentPage,
        pageSize: currentPageSize,
        search: searchText,
      });
    }
  }, [open]);

  useEffect(() => {
    if (request && value && !localDataSource.length) {
      const values = Array.isArray(value) ? value : [value];
      console.log('Loading initial data for values:', values);
      request({
        page: 1,
        pageSize: values.length,
        [idKey || valueKey]: values,
      }).then(res => {
        console.log('Initial data loaded:', res);
          setLocalDataSource(prev => {
            const newData = [...prev];
            res.list.forEach(item => {
              if (!newData.some(d => String(d[valueKey]) === String(item[valueKey]))) {
                newData.push(item);
              }
            });
            return newData;
          });
      });
    }
  }, [request, value, valueKey, idKey]);

  const dropdownRender = () => {
    return (
      <div style={{ padding: 8 }}>
        {showSearch && (
          <div style={{ marginBottom: 8 }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder={searchPlaceholder}
              value={searchText}
              onChange={handleSearch}
              allowClear
            />
          </div>
        )}
        <Table
          loading={loading}
          dataSource={currentDataSource}
          columns={columns}
          rowKey={(record) => String(record[valueKey])}
          rowSelection={{
            type: mode === 'multiple' ? 'checkbox' : 'radio',
            selectedRowKeys,
            onSelect: (record, selected) => {
              handleSelect(record[valueKey], selected);
            },
            onSelectAll: (selected, _, changeRows) => {
              handleSelectAll(selected, changeRows);
            }
          }}
          size="small"
          pagination={{
            current: currentPage,
            pageSize: currentPageSize,
            total: totalCount,
            size: 'small',
            position: ['bottomRight'],
            showTotal: (total) => `共 ${total} 条`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '25', '50', '100'],
            onChange: handlePageChange
          }}
          scroll={{ y: 240 }}
          onRow={(record) => ({
            onClick: () => {
              const recordValue = String(record[valueKey]);
              handleSelect(recordValue, !selectedRowKeys.includes(recordValue));
            },
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
      labelInValue={false}
      dropdownRender={dropdownRender}
      style={{ minWidth: 200, ...restProps.style }}
      dropdownStyle={{ 
        padding: 0,
        minWidth: 500
      }}
      onDeselect={(deselectedValue) => {
        if (mode === 'multiple' && Array.isArray(value)) {
          const newValue = value.filter(v => String(v) !== String(deselectedValue));
          onChange?.(newValue);
        }
      }}
    />
  );
};

export default TableSelect;
