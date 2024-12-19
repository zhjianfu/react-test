import { SelectProps, TableProps } from "antd";

export interface RequestParams {
  page: number;
  pageSize: number;
  search?: string;
  [key: string]: any;
}

export interface ResponseData<T> {
  list: T[];
  total: number;
}

export interface TableSelectProps<T extends object> extends Omit<SelectProps, 'options'> {
  dataSource?: T[];
  columns: TableProps<T>['columns'];
  rowKey: keyof T | ((record: T) => string);
  valueKey: keyof T;
  labelKey: keyof T;
  pageSize?: number;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchKeys?: string[];
  request?: (params: RequestParams) => Promise<ResponseData<T>>;
  extraParams?: Record<string, any>;
}
