import React, { useContext } from 'react';
import { Layout, Menu, Button, Space, Typography } from 'antd';
import { 
  DashboardOutlined, 
  TableOutlined, 
  UploadOutlined, 
  LogoutOutlined,
  UserOutlined 
} from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    const items = [
      {
        key: '/',
        icon: <DashboardOutlined />,
        label: <Link to="/">Dashboard</Link>
      },
      {
        key: '/monitoring',
        icon: <TableOutlined />,
        label: <Link to="/monitoring">Stock Monitoring</Link>
      }
    ];

    // Show upload menu item only for ADMIN
    if (user && user.role === 'ADMIN') {
      items.push({
        key: '/upload',
        icon: <UploadOutlined />,
        label: <Link to="/upload">Upload Excel</Link>
      });
    }

    return items;
  };

  return (
    <Layout className="dashboard-layout" style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="logo">EZDASH</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={getMenuItems()}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', zIndex: 1 }}>
          <Space size="middle">
            <Space>
              <UserOutlined style={{ color: '#1890ff' }} />
              <Text strong>{user?.username}</Text>
              <Text type="secondary">({user?.role})</Text>
            </Space>
            <Button 
              type="text" 
              danger 
              icon={<LogoutOutlined />} 
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </Space>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: '#f0f2f5', overflow: 'initial' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
