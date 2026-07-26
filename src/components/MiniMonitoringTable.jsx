import React, { useState, useEffect } from 'react';
import { Table, Typography } from 'antd';
import api from '../services/api';
import { getStockTypeLabel } from '../utils/stockTypeMaster';

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
          limit: 10,
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

  // Columns matching exact screenshot:
  // Stock Code | Item Name | Stock Type | Stock Class | SOH (Qty) | MIN (Qty) | ROP (Qty) | ROQ (Qty) | Days of Stock | Status
  const columns = [
    {
      title: 'Stock Code',
      dataIndex: ['item', 'stock_code'],
      key: 'stock_code',
      render: (t) => <Text strong>{t}</Text>
    },
    {
      title: 'Item Name',
      dataIndex: ['item', 'item_name'],
      key: 'item_name',
      ellipsis: true,
      width: '20%'
    },
    {
      title: 'Stock Type',
      dataIndex: ['item', 'stock_type'],
      key: 'stock_type',
      render: (val) => getStockTypeLabel(val)
    },
    {
      title: 'Stock Class',
      dataIndex: ['item', 'stock_class'],
      key: 'stock_class',
      align: 'center',
      render: (val) => val || '-'
    },
    {
      title: 'SOH (Qty)',
      dataIndex: 'soh_qty',
      key: 'soh_qty',
      align: 'right',
      render: (val) => <Text strong>{parseFloat(val || 0).toLocaleString('id-ID')}</Text>
    },
    {
      title: 'MIN (Qty)',
      dataIndex: 'min_qty',
      key: 'min_qty',
      align: 'right',
      render: (val) => parseFloat(val || 0).toLocaleString('id-ID')
    },
    {
      title: 'ROP (Qty)',
      dataIndex: 'rop_qty',
      key: 'rop_qty',
      align: 'right',
      render: (val) => parseFloat(val || 0).toLocaleString('id-ID')
    },
    {
      title: 'ROQ (Qty)',
      dataIndex: 'roq_qty',
      key: 'roq_qty',
      align: 'right',
      render: (val) => parseFloat(val || 0).toLocaleString('id-ID')
    },
    {
      title: 'Days of Stock',
      dataIndex: 'days_stock',
      key: 'days_stock',
      align: 'center',
      render: (val) => <Text strong>{parseFloat(val || 0).toFixed(0)}</Text>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => {
        let bg = '#00a854';
        let label = 'Aman';

        if (status === 'SAFE') {
          bg = '#00a854';
          label = 'Aman';
        } else if (status === 'WARNING') {
          bg = '#fa8c16';
          label = 'Warning';
        } else if (status === 'CRITICAL') {
          bg = '#d9363e';
          label = 'Critical';
        } else {
          bg = '#8c8c8c';
          label = 'No Stock';
        }

        return (
          <div
            style={{
              background: bg,
              color: '#fff',
              padding: '6px 16px',
              borderRadius: '4px',
              fontWeight: 700,
              fontSize: '13px',
              textAlign: 'center',
              display: 'inline-block',
              minWidth: '85px'
            }}
          >
            {label}
          </div>
        );
      }
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      size="middle"
      pagination={false}
      loading={loading}
      style={{ marginTop: 8 }}
      scroll={{ x: 'max-content' }}
    />
  );
};

export default MiniMonitoringTable;
