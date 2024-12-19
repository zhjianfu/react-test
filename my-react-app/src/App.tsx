import { observer } from 'mobx-react-lite';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Settings from './pages/Settings';
import UserGroups from './pages/UserGroups';

// 临时的占位组件
const PlaceholderPage = ({ title }: { title: string }) => (
  <div>
    <h2>{title}</h2>
    <p>该功能正在开发中...</p>
  </div>
);

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/analysis" element={<PlaceholderPage title="数据分析" />} />
          
          <Route path="/users/list" element={<Users />} />
          <Route path="/users/groups" element={<UserGroups />} />
          <Route path="/users/roles" element={<PlaceholderPage title="角色管理" />} />
          
          <Route path="/content/articles/list" element={<PlaceholderPage title="文章列表" />} />
          <Route path="/content/articles/categories" element={<PlaceholderPage title="分类管理" />} />
          
          <Route path="/operation/banners" element={<PlaceholderPage title="轮播图管理" />} />
          <Route path="/operation/notices" element={<PlaceholderPage title="公告管理" />} />
          
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/logs" element={<PlaceholderPage title="系统日志" />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default observer(App);
