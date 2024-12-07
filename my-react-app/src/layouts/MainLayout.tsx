import { useState } from 'react';
import { Layout, Menu, theme, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  ShopOutlined,
  TeamOutlined,
  FileOutlined,
  BarsOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedModule, setSelectedModule] = useState('dashboard');
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const topMenuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '数据中心',
    },
    {
      key: 'user',
      icon: <TeamOutlined />,
      label: '用户中心',
    },
    {
      key: 'content',
      icon: <FileOutlined />,
      label: '内容管理',
    },
    {
      key: 'operation',
      icon: <ShopOutlined />,
      label: '运营管理',
    },
    {
      key: 'system',
      icon: <SettingOutlined />,
      label: '系统管理',
    },
  ];

  const sideMenuItems = {
    dashboard: [
      {
        key: '/dashboard',
        icon: <BarsOutlined />,
        label: '数据概览',
      },
      {
        key: '/dashboard/analysis',
        icon: <AppstoreOutlined />,
        label: '数据分析',
      },
    ],
    user: [
      {
        key: '/users',
        icon: <TeamOutlined />,
        label: '用户管理',
        children: [
          {
            key: '/users/list',
            label: '用户列表',
          },
          {
            key: '/users/groups',
            label: '用户分组',
          },
        ],
      },
      {
        key: '/users/roles',
        icon: <UserOutlined />,
        label: '角色管理',
      },
    ],
    content: [
      {
        key: '/content/articles',
        icon: <FileOutlined />,
        label: '文章管理',
        children: [
          {
            key: '/content/articles/list',
            label: '文章列表',
          },
          {
            key: '/content/articles/categories',
            label: '分类管理',
          },
        ],
      },
    ],
    operation: [
      {
        key: '/operation/banners',
        icon: <BarsOutlined />,
        label: '轮播图管理',
      },
      {
        key: '/operation/notices',
        icon: <BarsOutlined />,
        label: '公告管理',
      },
    ],
    system: [
      {
        key: '/settings',
        icon: <SettingOutlined />,
        label: '系统设置',
      },
      {
        key: '/settings/logs',
        icon: <FileOutlined />,
        label: '系统日志',
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header 
        style={{ 
          padding: 0, 
          background: colorBgContainer, 
          height: '48px', 
          lineHeight: '48px', 
          borderBottom: '1px solid #f0f0f0',
          // position: 'fixed',
          width: '100%',
          // zIndex: 1000,
        }}
      >
        <div style={{
          float: 'left',
          width: collapsed ? '80px' : '200px',
          height: '48px',
          lineHeight: '48px',
          textAlign: 'center',
          transition: 'all 0.2s',
          backgroundColor: '#001529',
          color: '#fff'
        }}>
          {!collapsed && '运营管理系统'}
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[selectedModule]}
          items={topMenuItems}
          onClick={({ key }) => setSelectedModule(key)}
          style={{ 
            lineHeight: '46px',
            marginLeft: collapsed ? '80px' : '200px'
          }}
        />
      </Header>
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            overflow: 'auto',
            height: 'calc(100vh - 48px)',
            // position: 'fixed',
            // left: 0,
            // top: '48px',
            // bottom: 0,
            backgroundColor: '#fff'
          }}
          width={200}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: '100%',
              height: '48px',
              borderRadius: 0,
              borderBottom: '1px solid #f0f0f0'
            }}
          />
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            defaultOpenKeys={['/users', '/content/articles']}
            items={sideMenuItems[selectedModule as keyof typeof sideMenuItems]}
            onClick={({ key }) => navigate(key)}
            style={{
              height: 'calc(100% - 48px)',
              borderRight: 0
            }}
          />
        </Sider>
        <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              width: '100%',
              minHeight: 280,
            }}
          >
            {children}
          </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
