import { Form, Row, Col, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';
import BaseForm from './BaseForm';

export interface SearchFormProps {
  children: ReactNode;
  onSearch: (values: any) => void;
  onReset?: () => void;
}

const SearchForm = ({ children, onSearch, onReset }: SearchFormProps) => {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
    onReset?.();
  };

  return (
    <BaseForm form={form} onFinish={onSearch}>
      <Row gutter={[16, 16]}>
        {children}
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              搜索
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Col>
      </Row>
    </BaseForm>
  );
};

export default SearchForm;
