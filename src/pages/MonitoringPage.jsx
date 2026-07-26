import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Select, Space, Button, Typography, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined, CalendarOutlined } from '@ant-design/icons';
import api from '../services/api';
import { getStockTypeLabel } from '../utils/stockTypeMaster';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const formatRupiah = (val) => {
  return 'Rp ' + parseFloat(val || 0).toLocaleString('id-ID');
};

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
    setStatus(undefined);
    setSearchText('');
    setPage(1);
  };

  // ----------------------------------------------------
  // Table Columns (Matching Google Sheet Specification)
  // Stockcode | Part Number | Item Name | Warehouse | Mnemonic | Stock Class | Equipment | UOI | Price | SOH | Amount | Stock Type
  // ----------------------------------------------------
  const columns = [
    {
      title: 'Stockcode',
      dataIndex: ['item', 'stock_code'],
      key: 'stock_code',
      sorter: true,
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Part Number',
      dataIndex: ['item', 'part_number'],
      key: 'part_number',
      sorter: true,
      render: (val) => val || '-'
    },
    {
      title: 'Item Name',
      dataIndex: ['item', 'item_name'],
      key: 'item_name',
      sorter: true,
      width: '20%'
    },
    {
      title: 'Warehouse',
      dataIndex: ['item', 'warehouse'],
      key: 'warehouse',
      sorter: true
    },
    {
      title: 'Mnemonic',
      dataIndex: ['item', 'mnemonic'],
      key: 'mnemonic',
      sorter: true,
      render: (val) => val || '-'
    },
    {
      title: 'Stock Class',
      dataIndex: ['item', 'stock_class'],
      key: 'stock_class',
      sorter: true,
      render: (val) => val || '-'
    },
    {
      title: 'Equipment',
      dataIndex: ['item', 'equipment'],
      key: 'equipment',
      sorter: true,
      render: (val) => val || '-'
    },
    {
      title: 'UOI',
      dataIndex: ['item', 'uom'],
      key: 'uom',
      sorter: true,
      render: (val) => val || '-'
    },
    {
      title: 'Price',
      dataIndex: ['item', 'price'],
      key: 'price',
      sorter: true,
      render: (val) => formatRupiah(val)
    },
    {
      title: 'SOH',
      dataIndex: 'soh_qty',
      key: 'soh_qty',
      sorter: true,
      render: (val) => <Text strong>{parseFloat(val || 0).toLocaleString('id-ID')}</Text>
    },
    {
      title: 'Amount',
      dataIndex: 'soh_amount',
      key: 'soh_amount',
      sorter: true,
      render: (val, record) => formatRupiah(val || (record.soh_qty * record.item?.price))
    },
    {
      title: 'Stock Type',
      dataIndex: ['item', 'stock_type'],
      key: 'stock_type',
      sorter: true,
      render: (val) => getStockTypeLabel(val)
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
                placeholder="Cari Part Number / Stock Code / Item Name..."
                prefix={<SearchOutlined />}
                allowClear
                onPressEnter={(e) => handleSearch(e.target.value)}
                onChange={(e) => !e.target.value && handleSearch('')}
                style={{ width: '100%', maxWidth: '380px' }}
              />
            </Col>
          </Row>

          <Row gutter={[8, 8]} justify="start">
            <Col xs={12} sm={6} md={4}>
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

            <Col xs={12} sm={8} md={5}>
              <Select 
                placeholder="Vendor" 
                value={vendor} 
                onChange={setVendor} 
                allowClear 
                style={{ width: '100%' }}
              >
                {filterOptions.vendors.map(v => <Option key={v} value={v}>{v}</Option>)}
              </Select>
            </Col>

            <Col xs={12} sm={6} md={4}>
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

            <Col xs={12} sm={6} md={4}>
              <Select 
                placeholder="Stock Class" 
                value={stockClass} 
                onChange={setStockClass} 
                allowClear 
                style={{ width: '100%' }}
              >
                {filterOptions.stockClasses.map(c => <Option key={c} value={c}>{c}</Option>)}
              </Select>
            </Col>

            <Col xs={12} sm={6} md={4}>
              <Select 
                placeholder="Status" 
                value={status} 
                onChange={setStatus} 
                allowClear 
                style={{ width: '100%' }}
              >
                <Option value="SAFE">AMAN</Option>
                <Option value="WARNING">WARNING</Option>
                <Option value="CRITICAL">CRITICAL</Option>
                <Option value="NO STOCK">NO STOCK</Option>
              </Select>
            </Col>

            <Col xs={12} sm={6} md={3} style={{ display: 'flex', gap: '8px' }}>
              <Button onClick={handleResetFilters} style={{ flex: 1 }}>Reset</Button>
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
