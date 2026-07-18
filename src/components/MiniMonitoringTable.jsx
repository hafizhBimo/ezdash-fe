import React, { useState, useEffect } from 'react';
import { Table, Typography } from 'antd';
import api from '../services/api';

const { Text } = Typography;

const MiniMonitoringTable = ({ uploadId, filters }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPreview = async () => {
    if (!uploadId) return;
    setLoading(true);
    try {
      const res = await api.get('/monitoring', {
        params: {
          upload_id: uploadId,
          limit: 5,
          page: 1,
          ...filters
        }
      });
      if (res.data?.status === 'success') {
        setData(res.data.data.rows);
      }
    } catch (err) {
      console.error('Error fetching preview table:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreview();
  }, [uploadId, filters]);

  const columns = [
    { title: 'Item Code', dataIndex: ['item', 'stock_code'], render: t => <Text strong>{t}</Text> },
    { title: 'Item Name', dataIndex: ['item', 'item_name'], ellipsis: true },
    { title: 'Warehouse', dataIndex: ['item', 'warehouse'] },
    { title: 'Stok On Hand (Qty)', dataIndex: 'soh_qty', render: v => parseFloat(v).toLocaleString('id-ID') },
    { title: 'Safety Stock (Qty)', dataIndex: 'rop_qty', render: v => parseFloat(v).toLocaleString('id-ID') },
    { 
      title: 'Selisih (Qty)', 
      key: 'selisih',
      render: (_, record) => {
        const selisih = parseFloat(record.soh_qty) - parseFloat(record.rop_qty);
        return <Text type={selisih < 0 ? 'danger' : 'success'} strong>{selisih.toLocaleString('id-ID')}</Text>;
      } 
    },
    { 
      title: 'Status', 
      dataIndex: 'status',
      render: (status) => {
        let color = '#d9d9d9', bg = '#fafafa', text = 'NO STOCK';
        if (status === 'SAFE') { color = '#52c41a'; bg = '#f6ffed'; text = 'Aman'; }
        else if (status === 'WARNING') { color = '#faad14'; bg = '#fffbe6'; text = 'Low Stock'; }
        else if (status === 'CRITICAL') { color = '#f5222d'; bg = '#fff1f0'; text = 'Critical'; }
        
        return (
          <span style={{ 
            color, background: bg, border: `1px solid ${color}`, 
            padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 
          }}>
            {text}
          </span>
        );
      }
    }
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={data} 
      rowKey="id" 
      size="small" 
      pagination={false} 
      loading={loading}
      style={{ marginTop: 16 }}
    />
  );
};

export default MiniMonitoringTable;
