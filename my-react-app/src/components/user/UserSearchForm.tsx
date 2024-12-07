import { Form, Input, Select, Col } from 'antd';
import SearchForm from '../base/SearchForm';

export interface UserSearchFormProps {
  onSearch: (values: any) => void;
  onReset?: () => void;
}

const UserSearchForm = ({ onSearch, onReset }: UserSearchFormProps) => {
  return (
    <SearchForm onSearch={onSearch} onReset={onReset}>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Form.Item name="name" label="用户名">
          <Input placeholder="请输入用户名" allowClear />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Form.Item name="email" label="邮箱">
          <Input placeholder="请输入邮箱" allowClear />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Form.Item name="role" label="角色">
          <Select
            placeholder="请选择角色"
            allowClear
            options={[
              { value: '管理员', label: '管理员' },
              { value: '编辑', label: '编辑' },
              { value: '普通用户', label: '普通用户' },
            ]}
          />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Form.Item name="status" label="状态">
          <Select
            placeholder="请选择状态"
            allowClear
            options={[
              { value: '活跃', label: '活跃' },
              { value: '禁用', label: '禁用' },
              { value: '待验证', label: '待验证' },
            ]}
          />
        </Form.Item>
      </Col>
    </SearchForm>
  );
};

export default UserSearchForm;
