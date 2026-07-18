import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Table, Space, Badge } from 'antd';
import { WarningOutlined, ExclamationCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Text, Title } = Typography;

const AlertSection = ({ uploadId, alertSummary, filters }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch only items that are problematic (status: CRITICAL or WARNING)
  const fetchAlertItems = async () => {
    if (!uploadId) return;
    setLoading(true);
    try {
      const res = await api.get('/monitoring', {
        params: {
          upload_id: uploadId,
          limit: 10,
          page: 1,
          status: 'CRITICAL', // we can prioritize critical first, or just rely on default sort if backend sorts by severity
          sortBy: 'days_stock',
          sortOrder: 'ASC',
          ...filters
        }
      });
      if (res.data?.status === 'success') {
        setData(res.data.data.rows);
      }
    } catch (err) {
      console.error('Error fetching alert items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertItems();
  }, [uploadId, filters]);

  const totalAlerts = (alertSummary?.critical || 0) + (alertSummary?.lowStock || 0) + (alertSummary?.overStock || 0) + (alertSummary?.deadStock || 0);

  const columns = [
    { title: 'Item Code', dataIndex: ['item', 'stock_code'], render: t => <Text strong>{t}</Text> },
    { title: 'Item Name', dataIndex: ['item', 'item_name'], ellipsis: true },
    { title: 'Kategori', dataIndex: ['item', 'stock_class'] },
    { title: 'Warehouse', dataIndex: ['item', 'warehouse'] },
    { title: 'Jenis Stok', dataIndex: ['item', 'stock_type'] },
    { title: 'Stok (Qty)', dataIndex: 'soh_qty', render: v => parseFloat(v).toLocaleString('id-ID') },
    { title: 'Days of Stock', dataIndex: 'days_stock', render: v => parseFloat(v).toFixed(1) },
    { title: 'Status', dataIndex: 'status', render: (status) => {
      let color = 'red';
      if (status === 'WARNING') color = 'orange';
      if (status === 'SAFE') color = 'green';
      return <Badge color={color} text={<Text type={color === 'red' ? 'danger' : 'warning'}>{status}</Text>} />;
    }}
  ];

  return (
    <div style={{ marginTop: 24 }}>
      <Row gutter={[16, 16]}>
        {/* Critical Card */}
        <Col xs={12} sm={12} md={5}>
          <Card bodyStyle={{ padding: '16px' }} style={{ borderLeft: '4px solid #f5222d' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <CloseCircleOutlined style={{ color: '#f5222d', fontSize: 18, marginRight: 8 }} />
              <Text type="danger" strong style={{ fontSize: 13 }}>Critical (Stok &lt; 15 Hari)</Text>
            </div>
            <Title level={2} style={{ margin: 0, color: '#f5222d' }}>{alertSummary?.critical || 0}</Title>
            <Text type="secondary" style={{ fontSize: 12 }}>SKU</Text>
          </Card>
        </Col>

        {/* Low Stock Card */}
        <Col xs={12} sm={12} md={5}>
          <Card bodyStyle={{ padding: '16px' }} style={{ borderLeft: '4px solid #faad14' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <WarningOutlined style={{ color: '#faad14', fontSize: 18, marginRight: 8 }} />
              <Text type="warning" strong style={{ fontSize: 13, color: '#faad14' }}>Low Stock (&lt; Safety Stock)</Text>
            </div>
            <Title level={2} style={{ margin: 0, color: '#faad14' }}>{alertSummary?.lowStock || 0}</Title>
            <Text type="secondary" style={{ fontSize: 12 }}>SKU</Text>
          </Card>
        </Col>

        {/* Overstock Card */}
        <Col xs={12} sm={12} md={5}>
          <Card bodyStyle={{ padding: '16px' }} style={{ borderLeft: '4px solid #fa8c16' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <ExclamationCircleOutlined style={{ color: '#fa8c16', fontSize: 18, marginRight: 8 }} />
              <Text strong style={{ fontSize: 13, color: '#fa8c16' }}>Overstock (&gt; 90 Hari)</Text>
            </div>
            <Title level={2} style={{ margin: 0, color: '#fa8c16' }}>{alertSummary?.overStock || 0}</Title>
            <Text type="secondary" style={{ fontSize: 12 }}>SKU</Text>
          </Card>
        </Col>

        {/* Dead Stock Card */}
        <Col xs={12} sm={12} md={5}>
          <Card bodyStyle={{ padding: '16px' }} style={{ borderLeft: '4px solid #722ed1' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <ClockCircleOutlined style={{ color: '#722ed1', fontSize: 18, marginRight: 8 }} />
              <Text strong style={{ fontSize: 13, color: '#722ed1' }}>Dead Stock (&gt; 180 Hari)</Text>
            </div>
            <Title level={2} style={{ margin: 0, color: '#722ed1' }}>{alertSummary?.deadStock || 0}</Title>
            <Text type="secondary" style={{ fontSize: 12 }}>SKU</Text>
          </Card>
        </Col>

        {/* Total Card */}
        <Col xs={24} sm={24} md={4}>
          <Card bodyStyle={{ padding: '16px' }} style={{ borderLeft: '4px solid #1890ff', textAlign: 'center' }}>
            <Text strong style={{ fontSize: 13, color: '#1890ff', display: 'block', marginBottom: 8 }}>Total Alerts</Text>
            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>{totalAlerts}</Title>
            <Text type="secondary" style={{ fontSize: 12 }}>SKU</Text>
          </Card>
        </Col>
      </Row>

      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id" 
        size="small" 
        pagination={false} 
        loading={loading}
        style={{ marginTop: 16 }}
      />
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <a href="/monitoring" style={{ fontSize: 13 }}>Lihat Semua &gt;</a>
      </div>
    </div>
  );
};

export default AlertSection;
