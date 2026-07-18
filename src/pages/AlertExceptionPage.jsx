import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Select, Space, Button, Typography, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined, CalendarOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const AlertExceptionPage = () => {
  const [loading, setLoading] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [selectedUpload, setSelectedUpload] = useState(null);

  // Table parameters
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('days_stock');
  const [sortOrder, setSortOrder] = useState('ASC');

  // Filters
  const [filterOptions, setFilterOptions] = useState({
    warehouses: [],
    vendors: [],
    stockTypes: []
  });
  const [warehouse, setWarehouse] = useState(undefined);
  const [vendor, setVendor] = useState(undefined);
  const [stockType, setStockType] = useState(undefined);
  const [stockClass, setStockClass] = useState(undefined);
  const [status, setStatus] = useState(undefined);
  const [alertFilter, setAlertFilter] = useState('ALL_ALERTS');

  // Fetch upload snapshots
  const fetchUploadHistory = async () => {
    try {
      const response = await api.get('/upload/history');
      const successfulUploads = response.data.data.filter(u => u.status === 'SUCCESS');
      setUploads(successfulUploads);
      
      if (successfulUploads.length > 0 && !selectedUpload) {
        setSelectedUpload(successfulUploads[0].id);
      }
    } catch (error) {
      console.error('Failed to load uploads:', error);
    }
  };

  // Fetch monitoring list specifically for Coverage
  const fetchConsignmentData = async () => {
    if (!selectedUpload) return;
    setLoading(true);
    try {
      const params = {
        upload_id: selectedUpload,
        page,
        limit: pageSize,
        search: searchText || undefined,
        warehouse,
        vendor,
        stock_type: stockType,
        alert_filter: alertFilter,
        sortBy,
        sortOrder
      };

      const response = await api.get('/monitoring', { params });
      const { rows, count, uniqueFilters } = response.data.data;
      
      setData(rows);
      setTotalCount(count);
      if (uniqueFilters) {
        setFilterOptions(uniqueFilters);
      }
    } catch (error) {
      console.error('Failed to load consignment data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploadHistory();
  }, []);

  useEffect(() => {
    if (selectedUpload) {
      fetchConsignmentData();
    }
  }, [selectedUpload, page, pageSize, searchText, warehouse, vendor, stockType, alertFilter, sortBy, sortOrder]);

  const handleTableChange = (pagination, filters, sorter) => {
    if (pagination.current !== page) setPage(pagination.current);
    if (pagination.pageSize !== pageSize) setPageSize(pagination.pageSize);

    if (sorter.field) {
      const sortField = Array.isArray(sorter.field) 
        ? sorter.field[sorter.field.length - 1] 
        : sorter.field;
      
      setSortBy(sortField);
      setSortOrder(sorter.order === 'descend' ? 'DESC' : 'ASC');
    }
  };

  const handleSearch = (val) => {
    setSearchText(val);
    setPage(1); // Reset page on new search
  };

  const handleResetFilters = () => {
    setWarehouse(undefined);
    setVendor(undefined);
    setStockType(undefined);
    setStockClass(undefined);
    setAlertFilter('ALL_ALERTS');
    setSearchText('');
    setPage(1);
  };

  // ----------------------------------------------------
  // Table Columns (SOH is removed, only COH is shown)
  // ----------------------------------------------------
  const columns = [
    {
      title: 'Stock Code',
      dataIndex: ['item', 'stock_code'],
      key: 'stock_code',
      sorter: true,
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Item Name',
      dataIndex: ['item', 'item_name'],
      key: 'item_name',
      sorter: true,
      width: '25%'
    },
    {
      title: 'Warehouse',
      dataIndex: ['item', 'warehouse'],
      key: 'warehouse',
      sorter: true
    },
    {
      title: 'Vendor (COGS)',
      dataIndex: ['item', 'vendor'],
      key: 'vendor',
      sorter: true,
      render: (val) => val || '-'
    },
    {
      title: 'Type',
      dataIndex: ['item', 'stock_type'],
      key: 'stock_type',
      sorter: true
    },
    {
      title: 'Class',
      dataIndex: ['item', 'stock_class'],
      key: 'stock_class',
      sorter: true
    },
    {
      title: 'SOH (Qty)',
      dataIndex: 'soh_qty',
      key: 'soh_qty',
      sorter: true,
      render: (val) => parseFloat(val).toLocaleString('id-ID')
    },
    {
      title: 'COH (Qty)',
      dataIndex: 'coh_qty',
      key: 'coh_qty',
      sorter: true,
      render: (val) => parseFloat(val).toLocaleString('id-ID')
    },
    {
      title: 'MIN',
      dataIndex: 'min_qty',
      key: 'min_qty',
      sorter: true,
      render: (val) => parseFloat(val).toLocaleString('id-ID')
    },
    {
      title: 'ROP',
      dataIndex: 'rop_qty',
      key: 'rop_qty',
      sorter: true,
      render: (val) => parseFloat(val).toLocaleString('id-ID')
    },
    {
      title: 'Days of Stock',
      dataIndex: 'days_stock',
      key: 'days_stock',
      sorter: true,
      render: (val) => {
        const days = parseFloat(val);
        let color = '#52c41a'; // Safe (Green)
        if (days < 15) color = '#f5222d'; // Critical (Red)
        else if (days > 90) color = '#faad14'; // Overstock (Yellow)
        
        return <Text strong style={{ color }}>{days.toFixed(1)}</Text>;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (status) => {
        let badgeClass = 'status-badge no_stock';
        let label = 'NO STOCK';

        if (status === 'SAFE') {
          badgeClass = 'status-badge safe';
          label = 'AMAN';
        } else if (status === 'WARNING') {
          badgeClass = 'status-badge warning';
          label = 'WARNING';
        } else if (status === 'CRITICAL') {
          badgeClass = 'status-badge critical';
          label = 'CRITICAL';
        }

        return <span className={badgeClass}>{label}</span>;
      }
    }
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2}>Alert & Exception</Title>
        <Paragraph>Laporan barang-barang yang membutuhkan perhatian segera (Stok Kritis atau Low Stock), berdasarkan threshold dari Settings.</Paragraph>
      </div>

      {/* Snapshot and filters panel */}
      <Card className="glass-card">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Row gutter={[16, 16]} align="middle">
            {/* Snapshot Selector */}
            <Col xs={24} md={12} lg={10} xl={8}>
              <Space style={{ width: '100%', justifyContent: 'flex-start' }}>
                <CalendarOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                <Text strong style={{ whiteSpace: 'nowrap' }}>Snapshot:</Text>
                <Select 
                  value={selectedUpload} 
                  style={{ width: '100%', minWidth: '180px' }} 
                  onChange={setSelectedUpload}
                >
                  {uploads.map(u => (
                    <Option key={u.id} value={u.id}>
                      {new Date(u.upload_date).toLocaleDateString('id-ID')} ({u.filename.substring(0, 12)}...)
                    </Option>
                  ))}
                </Select>
              </Space>
            </Col>
            
            {/* Search Input */}
            <Col xs={24} md={12} lg={14} xl={16} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Input
                placeholder="Cari Nama Barang / Stock Code..."
                prefix={<SearchOutlined />}
                allowClear
                onPressEnter={(e) => handleSearch(e.target.value)}
                onChange={(e) => !e.target.value && handleSearch('')}
                style={{ width: '100%', maxWidth: '360px' }}
              />
            </Col>
          </Row>

          <Row gutter={[8, 8]} justify="start">
            <Col xs={12} sm={6} md={5}>
              <Select 
                placeholder="Warehouse" 
                value={warehouse} 
                onChange={setWarehouse} 
                allowClear 
                style={{ width: '100%' }}
              >
                {filterOptions.warehouses.map(w => <Option key={w} value={w}>{w}</Option>)}
              </Select>
            </Col>

            <Col xs={12} sm={6} md={6}>
              <Select 
                placeholder="Vendor COGS" 
                value={vendor} 
                onChange={setVendor} 
                allowClear 
                style={{ width: '100%' }}
              >
                {filterOptions.vendors.map(v => <Option key={v} value={v}>{v}</Option>)}
              </Select>
            </Col>

            <Col xs={12} sm={6} md={5}>
              <Select 
                placeholder="Stock Type" 
                value={stockType} 
                onChange={setStockType} 
                allowClear 
                style={{ width: '100%' }}
              >
                {filterOptions.stockTypes.map(t => <Option key={t} value={t}>{t}</Option>)}
              </Select>
            </Col>

            <Col xs={12} sm={6} md={5}>
              <Select 
                placeholder="Tipe Alert" 
                value={alertFilter} 
                onChange={setAlertFilter} 
                style={{ width: '100%' }}
              >
                <Option value="ALL_ALERTS">Semua Alert</Option>
                <Option value="CRITICAL">Critical (Hari)</Option>
                <Option value="LOW_STOCK">Low Stock (Qty)</Option>
              </Select>
            </Col>

            <Col xs={12} sm={24} md={3} style={{ display: 'flex', gap: '8px' }}>
              <Button onClick={handleResetFilters} style={{ flex: 1 }}>Reset</Button>
              <Button 
                type="primary" 
                icon={<ReloadOutlined />} 
                onClick={fetchConsignmentData} 
                loading={loading}
              />
            </Col>
          </Row>
        </Space>
      </Card>

      {/* Main Table */}
      <Card className="glass-card" bodyStyle={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: pageSize,
            total: totalCount,
            showSizeChanger: true,
            pageSizeOptions: ['10', '25', '50', '100'],
            showTotal: (total) => `Total ${total} items`
          }}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </Space>
  );
};

export default AlertExceptionPage;
