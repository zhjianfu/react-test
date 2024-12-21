# TableSelect 组件

TableSelect 是一个基于 antd 的高级选择器组件，它结合了 Select 和 Table 的功能，提供了更强大的数据选择和展示能力。

## 特性

- 支持单选和多选模式
- 支持本地数据和远程数据加载
- 支持搜索过滤
- 支持分页
- 自定义标签展示
- 响应式标签收缩
- 支持获取选中记录

## 安装

该组件依赖于 `antd`、`lodash` 和 `@ant-design/icons`，请确保已安装这些依赖：

```bash
npm install antd lodash @ant-design/icons
```

## 基础用法

```tsx
import { TableSelect } from '@/components';

// 基础使用
<TableSelect
  mode="multiple"
  valueKey="id"
  labelKey="name"
  columns={columns}
  dataSource={dataSource}
  onSelectedRecordsChange={(selectedRecords) => console.log(selectedRecords)}
/>

// 远程数据加载
<TableSelect
  mode="multiple"
  valueKey="id"
  labelKey="name"
  columns={columns}
  request={async (params) => {
    const res = await fetchData(params);
    return {
      list: res.data,
      total: res.total
    };
  }}
  onSelectedRecordsChange={(selectedRecords) => console.log(selectedRecords)}
/>
```

## API

### 属性

| 属性名 | 类型 | 默认值 | 必填 | 描述 |
|--------|------|--------|------|------|
| mode | 'multiple' \| undefined | undefined | 否 | 设置选择模式，multiple 为多选 |
| valueKey | string | - | 是 | 选项的值字段 |
| labelKey | string | - | 是 | 选项的标签字段 |
| columns | ColumnsType | - | 是 | Table 的列定义 |
| dataSource | T[] | - | 否 | 本地数据源 |
| request | (params) => Promise | - | 否 | 远程数据加载函数 |
| idKey | string | - | 否 | 编辑回显时的请求参数字段名 |
| labelProps | string[] | - | 否 | 单选时的标签展示字段列表 |
| ellipsis | boolean | false | 否 | 是否在标签超出宽度时不换行 |
| showSearch | boolean | true | 否 | 是否显示搜索框 |
| searchPlaceholder | string | '请输入关键词搜索' | 否 | 搜索框占位文本 |
| searchKey | string | - | 否 | 搜索关键字的字段名 |
| showHeader | boolean | true | 否 | 是否显示表格表头 |
| showPagination | boolean | true | 否 | 是否显示分页器 |
| pageSize | number | 25 | 否 | 每页显示条数 |
| dropdownWidth | number | - | 否 | 下拉框宽度 |
| dropdownHeight | number | - | 否 | 下拉框高度 |
| onSelectedRecordsChange | (selectedRecords: T[]) => void | - | 否 | 选中记录改变时的回调 |

### 事件

| 事件名 | 类型 | 描述 |
|--------|------|------|
| onChange | (value: any \| any[]) => void | 选择值改变时的回调 |
| onDropdownVisibleChange | (open: boolean) => void | 下拉框显示状态改变时的回调 |
| onSelectedRecordsChange | (selectedRecords: T[]) => void | 选中记录改变时的回调 |

## 示例

### 基础多选
```tsx
<TableSelect
  mode="multiple"
  valueKey="id"
  labelKey="name"
  columns={[
    { title: '姓名', dataIndex: 'name' },
    { title: '年龄', dataIndex: 'age' },
  ]}
  dataSource={users}
  onSelectedRecordsChange={(selectedRecords) => console.log(selectedRecords)}
/>
```

### 远程搜索
```tsx
<TableSelect
  valueKey="id"
  labelKey="name"
  showSearch={true}
  searchKey="keyword"
  request={async (params) => {
    const res = await api.searchUsers(params);
    return {
      list: res.data,
      total: res.total
    };
  }}
  columns={[
    { title: '姓名', dataIndex: 'name' },
    { title: '邮箱', dataIndex: 'email' },
  ]}
  onSelectedRecordsChange={(selectedRecords) => console.log(selectedRecords)}
/>
```

### 自定义标签显示
```tsx
<TableSelect
  valueKey="id"
  labelKey="name"
  labelProps={['name', 'email', 'department']}
  ellipsis={true}
  columns={[
    { title: '姓名', dataIndex: 'name' },
    { title: '邮箱', dataIndex: 'email' },
    { title: '部门', dataIndex: 'department' },
  ]}
  onSelectedRecordsChange={(selectedRecords) => console.log(selectedRecords)}
/>
```

## 注意事项

1. 当使用远程数据加载时，需要提供 `request` 函数，该函数应返回符合 `{ list: T[], total: number }` 格式的数据。

2. `labelProps` 只在单选模式下生效，用于自定义选中项的显示格式。

3. 设置 `ellipsis={true}` 可以防止多选标签换行，超出部分会显示 "+N"。

4. 如果同时使用了 `dataSource` 和 `request`，优先使用 `request` 加载数据。

5. `searchKey` 用于指定搜索时的参数名，如果不指定则默认使用 `keyword`。

6. `onSelectedRecordsChange` 回调函数会返回选中的记录数组，可以用于进一步的处理。
