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
  onSelectedRecordsChange?: (selectedRecords: T[]) => void;
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
  onSelectedRecordsChange,
  ...restProps
}: TableSelectProps<T>) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [localDataSource, setLocalDataSource] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

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

  // 初始化 selectedRowKeys
  useEffect(() => {
    if (!value) {
      setSelectedRowKeys([]);
    } else if (mode === 'multiple') {
      setSelectedRowKeys(Array.isArray(value) ? value.map(String) : []);
    } else {
      setSelectedRowKeys([String(value)]);
    }
  }, [value, mode]);

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

  // 更新选中记录的回调
  const updateSelectedRecords = useCallback((selectedKeys: string[]) => {
    if (onSelectedRecordsChange && currentDataSource) {
      const selectedRecords = currentDataSource.filter(record => 
        selectedKeys.includes(String(record[valueKey]))
      );
      onSelectedRecordsChange(selectedRecords);
    }
  }, [currentDataSource, onSelectedRecordsChange, valueKey]);

  // 处理选择变化
  const handleSelect = useCallback((selectedValue: any, selected: boolean) => {
    let newValue: any;
    let newSelectedKeys: string[];

    if (mode === 'multiple') {
      const currentValue = Array.isArray(value) ? value : [];
      if (selected) {
        newValue = [...currentValue, selectedValue];
        newSelectedKeys = [...selectedRowKeys, String(selectedValue)];
      } else {
        newValue = currentValue.filter(v => String(v) !== String(selectedValue));
        newSelectedKeys = selectedRowKeys.filter(key => key !== String(selectedValue));
      }
    } else {
      newValue = selected ? selectedValue : undefined;
      newSelectedKeys = selected ? [String(selectedValue)] : [];
    }

    setSelectedRowKeys(newSelectedKeys);
    updateSelectedRecords(newSelectedKeys);
    onChange?.(newValue);
  }, [mode, onChange, selectedRowKeys, value, updateSelectedRecords]);

  // 处理全选/取消全选
  const handleSelectAll = useCallback((selected: boolean, selectedRows: T[], changeRows: T[]) => {
    const changeKeys = changeRows.map(record => String(record[valueKey]));
    let newSelectedKeys: string[];
    let newValue: any[];

    if (selected) {
      newSelectedKeys = [...selectedRowKeys, ...changeKeys];
      newValue = [...(Array.isArray(value) ? value : []), ...changeKeys];
    } else {
      newSelectedKeys = selectedRowKeys.filter(key => !changeKeys.includes(key));
      newValue = (Array.isArray(value) ? value : []).filter(v => !changeKeys.includes(String(v)));
    }

    setSelectedRowKeys(newSelectedKeys);
    updateSelectedRecords(newSelectedKeys);
    onChange?.(newValue);
  }, [onChange, selectedRowKeys, value, valueKey, updateSelectedRecords]);

  const rowSelection: TableRowSelection<T> = useMemo(() => ({
    type: mode === 'multiple' ? 'checkbox' : 'radio' as const,
    selectedRowKeys,
    onSelect: (record: T, selected: boolean) => {
      handleSelect(record[valueKey], selected);
    },
    onSelectAll: (selected: boolean, selectedRows: T[], changeRows: T[]) => {
      handleSelectAll(selected, selectedRows, changeRows);
    },
    getCheckboxProps: (record: T) => ({
      value: String(record[valueKey]),
    }),
  }), [mode, selectedRowKeys, handleSelect, handleSelectAll, valueKey]);

  const dropdownStyle = useMemo(() => ({
    padding: 0,
    minWidth: dropdownWidth || '100%',
    width: dropdownWidth || '100%',
    overflowY: 'visible' as const,
    overflowX: 'hidden' as const,
    ...restProps.dropdownStyle,
  }), [dropdownWidth, restProps.dropdownStyle]);

  const renderTable = useCallback(() => (
    <div style={{ 
      padding: '8px',
      width: '100%',
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
        scroll={{ y: dropdownHeight ? dropdownHeight - 120 : 280 }}
        onRow={(record) => ({
          onClick: () => {
            const recordValue = record[valueKey];
            handleSelect(recordValue, !selectedRowKeys.includes(String(recordValue)));
          },
        })}
      />
    </div>
  ), [dropdownHeight, rowSelection, columns, currentDataSource, loading, currentPage, currentPageSize, totalCount, showPagination, showHeader, valueKey, selectedRowKeys, searchText]);

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
          const newSelectedKeys = selectedRowKeys.filter(key => key !== String(deselectedValue));
          setSelectedRowKeys(newSelectedKeys);
          updateSelectedRecords(newSelectedKeys);
          onChange?.(newValue);
        }
      }}
    />
  );
};

export default TableSelect;
