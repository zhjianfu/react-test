import React, { useState } from 'react';
import { Form, Row, Col, Input, Button, Select, DatePicker, Space } from 'antd';
import { DownOutlined, UpOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

interface SearchFormProps {
  onSearch: (values: any) => void;
  onReset: () => void;
  loading?: boolean;
}

// 模拟的搜索字段配置
const searchFields = [
  { label: '用户名', name: 'username', component: 'Input' },
  { label: '手机号', name: 'phone', component: 'Input' },
  { label: '邮箱', name: 'email', component: 'Input' },
  { label: '状态', name: 'status', component: 'Select', options: [
    { label: '活跃', value: 'active' },
    { label: '非活跃', value: 'inactive' }
  ]},
  { label: '角色', name: 'role', component: 'Select', options: [
    { label: '管理员', value: 'admin' },
    { label: '编辑', value: 'editor' },
    { label: '用户', value: 'user' }
  ]},
  { label: '部门', name: 'department', component: 'Select', options: [
    { label: '技术部', value: 'tech' },
    { label: '市场部', value: 'marketing' },
    { label: '销售部', value: 'sales' }
  ]},
  { label: '创建时间', name: 'createTime', component: 'RangePicker' },
  { label: '最后登录', name: 'lastLogin', component: 'RangePicker' }
];

const AdvancedSearchForm: React.FC<SearchFormProps> = ({ onSearch, onReset, loading }) => {
  const [form] = Form.useForm();
  const [expand, setExpand] = useState(false);
  
  // 默认显示的字段数
  const defaultShowCount = 3;
  
  // 处理表单提交
  const handleSearch = () => {
    form.validateFields().then(values => {
      onSearch(values);
    });
  };

  // 处理表单重置
  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  // 渲染操作按钮组
  const renderButtons = () => (
    <Space>
      <Button
        type="primary"
        onClick={handleSearch}
        loading={loading}
        icon={<SearchOutlined />}
      >
        搜索
      </Button>
      <Button 
        onClick={handleReset} 
        icon={<ReloadOutlined />}
      >
        重置
      </Button>
      <Button
        type="link"
        onClick={() => setExpand(!expand)}
      >
        {expand ? <UpOutlined /> : <DownOutlined />} 
        {expand ? '收起' : '展开'}
      </Button>
    </Space>
  );

  // 渲染表单项
  const renderFormItem = (field: any) => (
    <Form.Item label={field.label} name={field.name} key={field.name}>
      {field.component === 'Input' && (
        <Input placeholder={`请输入${field.label}`} />
      )}
      {field.component === 'Select' && (
        <Select
          placeholder={`请选择${field.label}`}
          options={field.options}
          allowClear
        />
      )}
      {field.component === 'RangePicker' && (
        <RangePicker style={{ width: '100%' }} />
      )}
    </Form.Item>
  );

  return (
    <div className="advanced-search-form">
      <Form
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        onFinish={handleSearch}
      >
        <Row gutter={[24, 0]} wrap>
          {/* 搜索字段 */}
          {(expand ? searchFields : searchFields.slice(0, defaultShowCount)).map((field, index) => (
            <Col key={field.name} xs={24} sm={12} md={8} lg={6}>
              {renderFormItem(field)}
            </Col>
          ))}
          
          {/* 操作按钮组 - 始终在最后一个位置 */}
          <Col xs={24} sm={12} md={8} lg={6} style={{ 
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-end'
          }}>
            <Form.Item style={{ marginBottom: 24, marginRight: 0 }}>
              {renderButtons()}
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <style>
        {`
          .advanced-search-form {
            padding: 24px;
            background: #fbfbfb;
            border: 1px solid #d9d9d9;
            border-radius: 2px;
          }

          .advanced-search-form .ant-form-item {
            margin-bottom: 16px;
          }

          .advanced-search-form .ant-space {
            flex-wrap: wrap;
          }

          .advanced-search-form .ant-row {
            align-items: flex-start;
          }

          @media (max-width: 575px) {
            .advanced-search-form .ant-form-item {
              margin-bottom: 8px;
            }
          }

          .advanced-search-form .ant-row:last-child {
            margin-bottom: 0;
          }
        `}
      </style>
    </div>
  );
};

export default AdvancedSearchForm;
