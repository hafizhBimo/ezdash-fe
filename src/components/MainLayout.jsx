import React, { useContext, useState, useEffect } from 'react';
import { Layout, Menu, Button, Space, Typography, Drawer, Tooltip } from 'antd';
import { 
  HomeOutlined,
  AppstoreOutlined,
  TableOutlined,
  LineChartOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  DeleteOutlined,
  FileTextOutlined,
  SettingOutlined,
  UploadOutlined, 
  LogoutOutlined,
  MenuOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

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

  const [lastUpdate, setLastUpdate] = useState('Loading...');

  const fetchLastUpdate = async () => {
    try {
      const response = await api.get('/upload/history');
      const successfulUploads = response.data.data.filter(u => u.status === 'SUCCESS');
      if (successfulUploads.length > 0) {
        const latest = successfulUploads[0];
        const date = new Date(latest.upload_date);
        
        // Memformat manual menjadi DD/MM/YY HH:MM
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).substring(2); // Ambil 2 angka terakhir tahun
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
        setLastUpdate(formattedDate);
      } else {
        setLastUpdate('Belum ada data');
      }
    } catch (error) {
      console.error('Gagal mengambil tanggal update terakhir:', error);
      setLastUpdate('Gagal memuat');
    }
  };

  useEffect(() => {
    fetchLastUpdate();
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    const items = [
      {
        key: '/',
        icon: <HomeOutlined />,
        label: <Link to="/" onClick={() => setDrawerVisible(false)}>Overview</Link>
      },
      {
        key: '/monitoring',
        icon: <HomeOutlined />,
        label: <Link to="/monitoring" onClick={() => setDrawerVisible(false)}>Stok Gudang</Link>
      },
      {
        key: '/stok-consignment',
        icon: <AppstoreOutlined />,
        label: <Link to="/stok-consignment" onClick={() => setDrawerVisible(false)}>Stok Consignment</Link>
      },
      {
        key: '/pemakaian',
        icon: <LineChartOutlined />,
        label: <Link to="/pemakaian" onClick={() => setDrawerVisible(false)}>Pemakaian</Link>
      },
      {
        key: '/coverage',
        icon: <ClockCircleOutlined />,
        label: <Link to="/coverage" onClick={() => setDrawerVisible(false)}>Coverage (Days of Stock)</Link>
      },
      {
        key: '/alert-exception',
        icon: <WarningOutlined />,
        label: <Link to="/alert-exception" onClick={() => setDrawerVisible(false)}>Alert & Exception</Link>
      },
      {
        key: '/dead-stock',
        icon: <DeleteOutlined />,
        label: <Link to="/dead-stock" onClick={() => setDrawerVisible(false)}>Dead Stock / Overstock</Link>
      },
      {
        key: '/laporan-detail',
        icon: <FileTextOutlined />,
        label: <Link to="/laporan-detail" onClick={() => setDrawerVisible(false)}>Laporan Detail</Link>
      }
    ];

    if (user && user.role === 'ADMIN') {
      items.push(
        {
          key: '/settings',
          icon: <SettingOutlined />,
          label: <Link to="/settings" onClick={() => setDrawerVisible(false)}>Settings</Link>
        },
        {
          key: '/upload',
          icon: <UploadOutlined />,
          label: <Link to="/upload" onClick={() => setDrawerVisible(false)}>Upload Excel</Link>
        }
      );
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
            background: '#013a77', // Matched with the mockup deep blue
            position: 'sticky',
            top: 0,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
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

          <div style={{ flex: 1, overflow: 'auto' }}>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[location.pathname]}
              items={getMenuItems()}
              inlineCollapsed={collapsed}
              style={{ borderRight: 0, marginTop: 8, background: 'transparent' }}
            />
          </div>

          {!collapsed && (
            <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ 
                border: '1px solid rgba(255,255,255,0.3)', 
                borderRadius: '8px', 
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <FileTextOutlined style={{ fontSize: 24, color: '#fff' }} />
                <div style={{ color: '#fff', fontSize: 12 }}>
                  <div style={{ fontWeight: 600 }}>Last Update :</div>
                  <div>{lastUpdate}</div>
                </div>
              </div>
            </div>
          )}
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
