import React, { useState, useEffect } from 'react';
import { Card, Typography, Table } from 'antd';
import { WarningOutlined, ExclamationCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, AlertOutlined } from '@ant-design/icons';
import api from '../services/api';
import { getStockTypeLabel } from '../utils/stockTypeMaster';

const { Text } = Typography;

const AlertSection = ({ uploadId, alertSummary, filters }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAlertItems = async () => {
    if (!uploadId) return;
    setLoading(true);
    try {
      const res = await api.get('/monitoring', {
        params: {
          upload_id: uploadId,
          limit: 8,
          page: 1,
          status: 'CRITICAL',
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
    { 
      title: 'Item Code', 
      dataIndex: ['item', 'stock_code'], 
      key: 'stock_code',
      render: t => <Text strong style={{ whiteSpace: 'nowrap' }}>{t}</Text> 
    },
    { 
      title: 'Item Name', 
      dataIndex: ['item', 'item_name'], 
      key: 'item_name',
      ellipsis: true, 
      width: '24%' 
    },
    { 
      title: 'Kategori', 
      dataIndex: ['item', 'stock_class'], 
      key: 'stock_class',
      align: 'center',
      render: v => v || '-' 
    },
    { 
      title: 'Warehouse', 
      dataIndex: ['item', 'warehouse'], 
      key: 'warehouse',
      align: 'center',
      render: v => v || '-' 
    },
    { 
      title: 'Jenis Stok', 
      dataIndex: ['item', 'stock_type'], 
      key: 'stock_type',
      render: v => getStockTypeLabel(v) 
    },
    { 
      title: 'Stok (Qty)', 
      dataIndex: 'soh_qty', 
      key: 'soh_qty',
      align: 'right',
      render: v => <Text strong>{parseFloat(v || 0).toLocaleString('id-ID')}</Text> 
    },
    { 
      title: 'Days of Stock', 
      dataIndex: 'days_stock', 
      key: 'days_stock',
      align: 'center',
      render: v => <Text strong>{parseFloat(v || 0).toFixed(1)}</Text> 
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      align: 'center',
      render: (status) => {
        let bg = '#d9363e';
        let label = 'CRITICAL';

        if (status === 'CRITICAL') {
          bg = '#d9363e';
          label = 'CRITICAL';
        } else if (status === 'WARNING') {
          bg = '#fa8c16';
          label = 'WARNING';
        } else if (status === 'SAFE') {
          bg = '#00a854';
          label = 'AMAN';
        }

        return (
          <span style={{
            background: bg,
            color: '#fff',
            padding: '4px 10px',
            borderRadius: '4px',
            fontWeight: 700,
            fontSize: '12px',
            whiteSpace: 'nowrap',
            display: 'inline-block',
            textAlign: 'center',
            minWidth: '80px'
          }}>
            {label}
          </span>
        );
      }
    }
  ];

  return (
    <div>
      {/* 5 Responsive Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
        marginBottom: '16px'
      }}>
        {/* Critical Card */}
        <Card bodyStyle={{ padding: '14px' }} style={{ borderLeft: '4px solid #f5222d' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
            <CloseCircleOutlined style={{ color: '#f5222d', fontSize: 16, marginRight: 6 }} />
            <Text type="danger" strong style={{ fontSize: 12, whiteSpace: 'nowrap' }}>Critical (&lt; 15 Hari)</Text>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#f5222d', lineHeight: 1 }}>
            {parseFloat(alertSummary?.critical || 0).toLocaleString('id-ID')}
          </div>
          <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>SKU</Text>
        </Card>

        {/* Low Stock Card */}
        <Card bodyStyle={{ padding: '14px' }} style={{ borderLeft: '4px solid #faad14' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
            <WarningOutlined style={{ color: '#faad14', fontSize: 16, marginRight: 6 }} />
            <Text type="warning" strong style={{ fontSize: 12, color: '#faad14', whiteSpace: 'nowrap' }}>Low Stock (&lt; ROP)</Text>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#faad14', lineHeight: 1 }}>
            {parseFloat(alertSummary?.lowStock || 0).toLocaleString('id-ID')}
          </div>
          <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>SKU</Text>
        </Card>

        {/* Overstock Card */}
        <Card bodyStyle={{ padding: '14px' }} style={{ borderLeft: '4px solid #fa8c16' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
            <ExclamationCircleOutlined style={{ color: '#fa8c16', fontSize: 16, marginRight: 6 }} />
            <Text strong style={{ fontSize: 12, color: '#fa8c16', whiteSpace: 'nowrap' }}>Overstock (&gt; 90 Hari)</Text>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#fa8c16', lineHeight: 1 }}>
            {parseFloat(alertSummary?.overStock || 0).toLocaleString('id-ID')}
          </div>
          <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>SKU</Text>
        </Card>

        {/* Dead Stock Card */}
        <Card bodyStyle={{ padding: '14px' }} style={{ borderLeft: '4px solid #722ed1' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
            <ClockCircleOutlined style={{ color: '#722ed1', fontSize: 16, marginRight: 6 }} />
            <Text strong style={{ fontSize: 12, color: '#722ed1', whiteSpace: 'nowrap' }}>Dead Stock (&gt; 180 Hari)</Text>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#722ed1', lineHeight: 1 }}>
            {parseFloat(alertSummary?.deadStock || 0).toLocaleString('id-ID')}
          </div>
          <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>SKU</Text>
        </Card>

        {/* Total Card */}
        <Card bodyStyle={{ padding: '14px' }} style={{ borderLeft: '4px solid #1890ff' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
            <AlertOutlined style={{ color: '#1890ff', fontSize: 16, marginRight: 6 }} />
            <Text strong style={{ fontSize: 12, color: '#1890ff', whiteSpace: 'nowrap' }}>Total Alerts</Text>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#1890ff', lineHeight: 1 }}>
            {parseFloat(totalAlerts || 0).toLocaleString('id-ID')}
          </div>
          <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>SKU</Text>
        </Card>
      </div>

      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id" 
        size="middle" 
        pagination={false} 
        loading={loading}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default AlertSection;
