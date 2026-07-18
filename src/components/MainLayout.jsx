import React, { useContext, useState, useEffect } from 'react';
import { Layout, Menu, Button, Space, Typography, Drawer, Tooltip } from 'antd';
import { 
  DashboardOutlined, 
  TableOutlined, 
  UploadOutlined, 
  LogoutOutlined,
  UserOutlined,
  MenuOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Monitor screen size to handle layout responsiveness dynamically
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      // Auto-collapse on smaller desktops
      if (window.innerWidth < 1200 && window.innerWidth >= 992) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    const items = [
      {
        key: '/',
        icon: <DashboardOutlined />,
        label: <Link to="/" onClick={() => setDrawerVisible(false)}>Dashboard</Link>
      },
      {
        key: '/monitoring',
        icon: <TableOutlined />,
        label: <Link to="/monitoring" onClick={() => setDrawerVisible(false)}>Stock Monitoring</Link>
      }
    ];

    if (user && user.role === 'ADMIN') {
      items.push({
        key: '/upload',
        icon: <UploadOutlined />,
        label: <Link to="/upload" onClick={() => setDrawerVisible(false)}>Upload Excel</Link>
      });
    }

    return items;
  };

  const siderWidth = 220;

  return (
    <Layout className="dashboard-layout" style={{ minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          width={siderWidth}
          collapsedWidth={64}
          collapsed={collapsed}
          style={{
            background: '#001529',
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'auto',
            flexShrink: 0
          }}
        >
          {/* Logo area */}
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'space-between',
              padding: collapsed ? '0' : '0 16px',
              background: 'linear-gradient(135deg, #1890ff, #096dd9)',
              overflow: 'hidden',
              transition: 'all 0.2s',
              flexShrink: 0
            }}
          >
            {!collapsed && (
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 16, letterSpacing: 1, whiteSpace: 'nowrap' }}>
                EZDASH
              </span>
            )}
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                color: '#fff',
                fontSize: 16,
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            />
          </div>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={getMenuItems()}
            inlineCollapsed={collapsed}
            style={{ borderRight: 0, marginTop: 8 }}
          />
        </Sider>
      )}

      {/* Mobile Drawer Navigation */}
      {isMobile && (
        <Drawer
          title={
            <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>EZDASH</span>
          }
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          styles={{
            header: { background: 'linear-gradient(135deg, #1890ff, #096dd9)', borderBottom: 0 },
            body: { background: '#001529', padding: 0 }
          }}
          width={240}
        >
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={getMenuItems()}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Drawer>
      )}

      <Layout style={{ flex: 1, minWidth: 0 }}>
        <Header
          style={{
            background: '#fff',
            padding: isMobile ? '0 16px' : '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            zIndex: 1,
            position: 'sticky',
            top: 0,
            height: 64
          }}
        >
          {/* Header Left */}
          <Space>
            {isMobile ? (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setDrawerVisible(true)}
                style={{ fontSize: 18, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              />
            ) : (
              <Text style={{ color: '#8c8c8c', fontSize: 14 }}>
                {location.pathname === '/' && 'Dashboard'}
                {location.pathname === '/monitoring' && 'Stock Monitoring'}
                {location.pathname === '/upload' && 'Upload Excel'}
              </Text>
            )}
          </Space>

          {/* Header Right */}
          <Space size={isMobile ? 'small' : 'middle'}>
            {!isMobile && (
              <Space>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1890ff, #096dd9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 13
                  }}
                >
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                <div style={{ lineHeight: 1.3 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{user?.username}</div>
                  <div style={{ fontSize: 11, color: '#8c8c8c' }}>{user?.role}</div>
                </div>
              </Space>
            )}
            <Tooltip title="Sign Out">
              <Button
                type="text"
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                {!isMobile && 'Sign Out'}
              </Button>
            </Tooltip>
          </Space>
        </Header>

        <Content
          style={{
            margin: isMobile ? '12px 8px' : '24px 20px',
            padding: isMobile ? 12 : 24,
            minHeight: 280,
            background: '#f0f2f5',
            overflow: 'initial'
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
