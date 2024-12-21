import { SelectProps, TableProps } from "antd";

export type RequestParams = {
  page: number;
  pageSize: number;
  keyword?: string;
} & Record<string, any>;

export interface ResponseData<T> {
  list: T[];
  total: number;
}

export interface TableSelectProps<T extends Record<string, any>> extends Omit<SelectProps, 'options'> {
  dataSource?: T[];
  columns: TableProps<T>['columns'];
  rowKey: keyof T | ((record: T) => string);
  valueKey: keyof T;
  labelKey: keyof T;
  pageSize?: number;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchKey?: string;  // 改为 string 类型，因为我们会用它作为动态键名
  showHeader?: boolean;
  showPagination?: boolean;
  request?: (params: RequestParams) => Promise<ResponseData<T>>;
  extraParams?: Record<string, any>;
  dropdownWidth?: number;  // 下拉框宽度，不设置则与 select 同宽
  dropdownHeight?: number;  // 下拉框高度
  labelProps?: (keyof T)[];  // 用于配置单选时展示的字段列表
  ellipsis?: boolean;  // 是否在超出宽度时显示省略号而不换行
}
