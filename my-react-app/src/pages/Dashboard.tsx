import { Card, Statistic, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const Dashboard = () => {
  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic
            title="今日活跃用户"
            value={11.28}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            prefix={<ArrowUpOutlined />}
            suffix="%"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="今日订单量"
            value={9.3}
            precision={2}
            valueStyle={{ color: '#cf1322' }}
            prefix={<ArrowDownOutlined />}
            suffix="%"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="总用户数"
            value={93123}
            valueStyle={{ color: '#1677ff' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="总收入"
            value={112893}
            precision={2}
            valueStyle={{ color: '#1677ff' }}
            prefix="¥"
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Dashboard;
