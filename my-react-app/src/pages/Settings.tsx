import { Card, Form, Input, Switch, Button, Space } from 'antd';

const Settings = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  return (
    <Card title="系统设置">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          siteName: '运营管理系统',
          enableNotifications: true,
          enableAnalytics: true,
        }}
      >
        <Form.Item
          label="系统名称"
          name="siteName"
          rules={[{ required: true, message: '请输入系统名称' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="系统通知" name="enableNotifications" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label="数据分析" name="enableAnalytics" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              保存设置
            </Button>
            <Button onClick={() => form.resetFields()}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Settings;
