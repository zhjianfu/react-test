import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { Select, Table, Input, SelectProps, TableProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import type { RequestParams, ResponseData } from './types';
import type { TableRowSelection } from 'antd/es/table/interface';
import type { DefaultOptionType } from 'antd/es/select';
import styles from './style.module.css';

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
  searchKey?: string;
  showHeader?: boolean;
  showPagination?: boolean;
  request?: (params: RequestParams) => Promise<ResponseData<T>>;
  extraParams?: Record<string, any>;
  dropdownWidth?: number;
  dropdownHeight?: number;
  labelProps?: (keyof T)[];
  ellipsis?: boolean;
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
  searchKey,
  showHeader = true,
  showPagination = true,
  request,
  extraParams = {},
  dropdownWidth,
  dropdownHeight,
  labelProps,
  ellipsis = true,
  ...restProps
}: TableSelectProps<T>) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [localDataSource, setLocalDataSource] = useState<T[]>([]);
  const [total, setTotal] = useState(0);

  // 创建一个稳定的 fetch 函数
  const fetchData = useCallback(async (params: RequestParams) => {
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
  }, [request, extraParams]);

  // 加载回显数据
  const loadSelectedData = useCallback(async () => {
    if (!request || !value || localDataSource.length) return;
    
    const values = Array.isArray(value) ? value : [value];
    try {
      const res = await request({
        page: 1,
        pageSize: values.length,
        [idKey || valueKey]: values,
        ...extraParams,
      });
      setLocalDataSource(res.list);
    } catch (error) {
      console.error('Failed to load selected data:', error);
    }
  }, [request, value, localDataSource.length, idKey, valueKey, extraParams]);

  // 加载下拉列表数据
  const loadDropdownData = useCallback(() => {
    if (!request) return;
    
    const params: RequestParams = {
      page: currentPage,
      pageSize: currentPageSize,
      ...(searchText ? { keyword: searchText } : {}),
      ...extraParams,
    };
    fetchData(params);
  }, [currentPage, currentPageSize, searchText, extraParams, fetchData]);

  // 创建防抖版本的 fetch
  const debouncedFetchRef = useRef(
    debounce((params: RequestParams) => {
      fetchData(params);
    }, 300)
  );

  // 清理防抖
  useEffect(() => {
    const debounced = debouncedFetchRef.current;
    return () => {
      debounced?.cancel();
    };
  }, []);

  // 处理搜索
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    if (!request) return;

    const params: RequestParams = {
      page: 1,
      pageSize: currentPageSize,
      ...extraParams,
    };
    
    if (value) {
      if (searchKey) {
        (params as Record<string, any>)[searchKey as string] = value;
      } else {
        params.keyword = value;
      }
    }

    debouncedFetchRef.current(params);
    setCurrentPage(1);
  }, [currentPageSize, searchKey, extraParams]);

  // 处理分页
  const handlePageChange = useCallback((page: number, size?: number) => {
    const newSize = size || currentPageSize;
    if (!request) return;

    const params: RequestParams = {
      page,
      pageSize: newSize,
      ...(searchText ? { keyword: searchText } : {}),
      ...extraParams,
    };

    setCurrentPage(page);
    setCurrentPageSize(newSize);
    fetchData(params);
  }, [currentPageSize, searchText, extraParams, fetchData]);

  // 初始加载回显数据
  useEffect(() => {
    loadSelectedData();
  }, [loadSelectedData]);

  // 打开下拉框时加载列表数据
  useEffect(() => {
    if (open) {
      loadDropdownData();
    }
  }, [open]);

  const getFilteredDataSource = useCallback((data: T[]) => {
    if (!searchText || !data?.length) return data;
    const searchLower = searchText.toLowerCase();
    return data.filter(item => {
      if (searchKey) {
        const fieldValue = (item as Record<string, any>)[searchKey as string];
        return String(fieldValue).toLowerCase().includes(searchLower);
      }
      return Object.values(item as Record<string, any>).some(value => 
        String(value).toLowerCase().includes(searchLower)
      );
    });
  }, [searchText, searchKey]);

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

  // 获取选项的展示标签
  const getOptionLabel = useCallback((record: T) => {
    if (!mode && labelProps?.length) {
      return labelProps.map(key => String(record[key])).join(' - ');
    }
    return String(record[labelKey]);
  }, [mode, labelProps, labelKey]);

  // 构建选项
  const options = useMemo(() => {
    return currentDataSource.map((item) => ({
      label: getOptionLabel(item),
      value: item[valueKey],
    })) as DefaultOptionType[];
  }, [currentDataSource, valueKey, getOptionLabel]);

  const selectedRowKeys = useMemo(() => {
    if (!value) return [];
    if (mode === 'multiple') {
      return Array.isArray(value) ? value.map(String) : [];
    }
    return [String(value)];
  }, [value, mode]);

  const handleSelect = useCallback((selectedValue: any, selected: boolean) => {
    if (mode === 'multiple') {
      const currentValue = Array.isArray(value) ? value : [];
      const newValue = selected
        ? [...new Set([...currentValue, selectedValue])]
        : currentValue.filter(v => String(v) !== String(selectedValue));
      onChange?.(newValue);
    } else {
      onChange?.(selectedValue);
      setOpen(false);  // 单选时自动关闭下拉框
    }
  }, [mode, value, onChange]);

  const handleSelectAll = useCallback((selected: boolean, changeRows: T[]) => {
    if (!mode || mode !== 'multiple') return;
    const changedValues = changeRows.map(row => row[valueKey]);
    const currentValue = Array.isArray(value) ? value : [];
    const newValue = selected
      ? [...new Set([...currentValue, ...changedValues])]
      : currentValue.filter(v => !changedValues.some(cv => String(cv) === String(v)));
    onChange?.(newValue);
  }, [mode, value, onChange, valueKey]);

  const rowSelection: TableRowSelection<T> = useMemo(() => ({
    type: mode === 'multiple' ? 'checkbox' : 'radio' as const,
    selectedRowKeys,
    onSelect: (record: T, selected: boolean) => {
      handleSelect(record[valueKey], selected);
    },
    onSelectAll: (selected: boolean, selectedRows: T[], changeRows: T[]) => {
      handleSelectAll(selected, changeRows);
    },
    getCheckboxProps: (record: T) => ({
      value: String(record[valueKey]),
    }),
  }), [mode, selectedRowKeys, handleSelect, handleSelectAll, valueKey]);

  const tableHeight = useMemo(() => {
    if (dropdownHeight) {
      // 预留搜索框和分页的空间
      return dropdownHeight - (showSearch ? 56 : 0) - (showPagination ? 56 : 0);
    }
    return 240; // 默认高度
  }, [dropdownHeight, showSearch, showPagination]);

  const renderTable = useCallback(() => (
    <div style={{ 
      padding: '8px',
      width: dropdownWidth || '100%',
      maxWidth: '100%',
    }}>
      {showSearch && (
        <div style={{ marginBottom: 8, padding: '0 8px' }}>
          <Input
            placeholder={searchPlaceholder}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            allowClear
            style={{ width: '100%' }}
          />
        </div>
      )}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={currentDataSource}
        loading={loading}
        size="small"
        rowKey={record => String(record[valueKey])}
        pagination={showPagination ? {
          current: currentPage,
          pageSize: currentPageSize,
          total: totalCount,
          onChange: handlePageChange,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          style: { marginBottom: 0 }
        } : false}
        showHeader={showHeader}
        scroll={{ y: tableHeight, x: '100%' }}
        onRow={(record) => ({
          onClick: () => {
            const recordValue = record[valueKey];
            handleSelect(recordValue, !selectedRowKeys.includes(String(recordValue)));
          },
        })}
      />
    </div>
  ), [tableHeight, rowSelection, columns, currentDataSource, loading, currentPage, currentPageSize, totalCount, showPagination, showHeader, valueKey, selectedRowKeys, dropdownWidth, searchText]);

  const dropdownStyle = useMemo(() => ({
    padding: 0,
    maxHeight: dropdownHeight,
    minWidth: dropdownWidth || 'auto',
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
    ...restProps.dropdownStyle,
  }), [dropdownHeight, dropdownWidth, restProps.dropdownStyle]);

  return (
    <Select
      {...restProps}
      mode={mode}
      value={value}
      open={open}
      onDropdownVisibleChange={setOpen}
      options={options}
      labelInValue={false}
      dropdownRender={renderTable}
      style={{ 
        minWidth: 200,
        ...restProps.style
      }}
      dropdownStyle={dropdownStyle}
      popupMatchSelectWidth={false}
      className={ellipsis ? styles.selectNoWrap : undefined}
      maxTagCount={ellipsis ? 'responsive' : undefined}
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
