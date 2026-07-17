import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Select, Space, Button, Typography, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined, CalendarOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const MonitoringPage = () => {
  const [loading, setLoading] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [selectedUpload, setSelectedUpload] = useState(null);

  // Table parameters
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('ASC');

  // Filters
  const [filterOptions, setFilterOptions] = useState({
    warehouses: [],
    vendors: [],
    stockTypes: [],
    stockClasses: []
  });
  const [warehouse, setWarehouse] = useState(undefined);
  const [vendor, setVendor] = useState(undefined);
  const [stockType, setStockType] = useState(undefined);
  const [stockClass, setStockClass] = useState(undefined);
  const [status, setStatus] = useState(undefined);

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

  // Fetch monitoring list
  const fetchMonitoringData = async () => {
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
        stock_class: stockClass,
        status,
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
      console.error('Failed to load monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploadHistory();
  }, []);

  useEffect(() => {
    if (selectedUpload) {
      fetchMonitoringData();
    }
  }, [selectedUpload, page, pageSize, searchText, warehouse, vendor, stockType, stockClass, status, sortBy, sortOrder]);

  const handleTableChange = (pagination, filters, sorter) => {
    if (pagination.current !== page) setPage(pagination.current);
    if (pagination.pageSize !== pageSize) setPageSize(pagination.pageSize);

    if (sorter.field) {
      setSortBy(sorter.field);
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
    setStatus(undefined);
    setSearchText('');
    setPage(1);
  };

  // ----------------------------------------------------
  // Table Columns
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
      title: 'Vendor',
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
      title: 'SOH',
      dataIndex: 'soh_qty',
      key: 'soh_qty',
      sorter: true,
      render: (val) => parseFloat(val).toLocaleString('id-ID')
    },
    {
      title: 'COH',
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
      render: (val) => <Text strong>{parseFloat(val).toFixed(1)}</Text>
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
        <Title level={2}>Stock Monitoring Table</Title>
        <Paragraph>Lihat dan filter seluruh data inventaris barang gudang dan konsinyasi.</Paragraph>
      </div>

      {/* Snapshot and filters panel */}
      <Card className="glass-card">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col xs={24} md={8}>
              <Space>
                <CalendarOutlined style={{ color: '#1890ff', fontSize: '18px' }} />
                <Text strong>Snapshot Tanggal:</Text>
                <Select 
                  value={selectedUpload} 
                  style={{ width: 220 }} 
                  onChange={setSelectedUpload}
                >
                  {uploads.map(u => (
                    <Option key={u.id} value={u.id}>
                      {new Date(u.upload_date).toLocaleDateString('id-ID')} ({u.filename.substring(0, 15)}...)
                    </Option>
                  ))}
                </Select>
              </Space>
            </Col>
            
            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
              <Input
                placeholder="Cari Nama Barang / Stock Code..."
                prefix={<SearchOutlined />}
                allowClear
                onPressEnter={(e) => handleSearch(e.target.value)}
                onChange={(e) => !e.target.value && handleSearch('')}
                style={{ width: 300 }}
              />
            </Col>
          </Row>

          <Row gutter={[8, 8]} justify="start" style={{ flexWrap: 'wrap' }}>
            <Col>
              <Select 
                placeholder="Warehouse" 
                value={warehouse} 
                onChange={setWarehouse} 
                allowClear 
                style={{ width: 140 }}
              >
                {filterOptions.warehouses.map(w => <Option key={w} value={w}>{w}</Option>)}
              </Select>
            </Col>

            <Col>
              <Select 
                placeholder="Vendor" 
                value={vendor} 
                onChange={setVendor} 
                allowClear 
                style={{ width: 180 }}
              >
                {filterOptions.vendors.map(v => <Option key={v} value={v}>{v}</Option>)}
              </Select>
            </Col>

            <Col>
              <Select 
                placeholder="Stock Type" 
                value={stockType} 
                onChange={setStockType} 
                allowClear 
                style={{ width: 120 }}
              >
                {filterOptions.stockTypes.map(t => <Option key={t} value={t}>{t}</Option>)}
              </Select>
            </Col>

            <Col>
              <Select 
                placeholder="Stock Class" 
                value={stockClass} 
                onChange={setStockClass} 
                allowClear 
                style={{ width: 120 }}
              >
                {filterOptions.stockClasses.map(c => <Option key={c} value={c}>{c}</Option>)}
              </Select>
            </Col>

            <Col>
              <Select 
                placeholder="Status" 
                value={status} 
                onChange={setStatus} 
                allowClear 
                style={{ width: 120 }}
              >
                <Option value="SAFE">AMAN</Option>
                <Option value="WARNING">WARNING</Option>
                <Option value="CRITICAL">CRITICAL</Option>
                <Option value="NO STOCK">NO STOCK</Option>
              </Select>
            </Col>

            <Col>
              <Button onClick={handleResetFilters}>Reset</Button>
            </Col>

            <Col>
              <Button 
                type="primary" 
                icon={<ReloadOutlined />} 
                onClick={fetchMonitoringData} 
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

export default MonitoringPage;
