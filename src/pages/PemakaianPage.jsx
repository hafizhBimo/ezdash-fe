import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Select, Space, Button, Typography, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined, CalendarOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const PemakaianPage = () => {
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
  const [warehouse, setWarehouse] = useState(undefined);
  const [vendor, setVendor] = useState(undefined);
  const [stockType, setStockType] = useState(undefined);
  const [stockClass, setStockClass] = useState(undefined);

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

  const fetchUsageData = async () => {
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
        sortBy,
        sortOrder
      };

      const response = await api.get('/usages', { params });
      const { rows, count } = response.data.data;
      
      setData(rows);
      setTotalCount(count);
    } catch (error) {
      console.error('Failed to load usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploadHistory();
  }, []);

  useEffect(() => {
    if (selectedUpload) {
      fetchUsageData();
    }
  }, [selectedUpload, page, pageSize, searchText, warehouse, vendor, stockType, stockClass, sortBy, sortOrder]);

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
    setSearchText('');
    setPage(1);
  };

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
      title: 'Usage Qty',
      dataIndex: 'usage_qty',
      key: 'usage_qty',
      sorter: true,
      render: (val) => <Text strong style={{ color: '#eb2f96' }}>{parseFloat(val).toLocaleString('id-ID')}</Text>
    },
    {
      title: 'Unit Price (Rp)',
      dataIndex: ['item', 'price'],
      key: 'price',
      sorter: true,
      render: (val) => parseFloat(val || 0).toLocaleString('id-ID')
    },
    {
      title: 'Usage Amount (Rp)',
      key: 'usage_amount',
      render: (_, record) => {
        const qty = parseFloat(record.usage_qty || 0);
        const price = parseFloat(record.item?.price || 0);
        return <Text strong>{(qty * price).toLocaleString('id-ID')}</Text>;
      }
    }
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2}>Data Pemakaian Barang</Title>
        <Paragraph>Laporan jumlah dan nilai barang yang telah digunakan/dikeluarkan.</Paragraph>
      </div>

      <Card className="glass-card">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Row gutter={[16, 16]} align="middle">
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
              <Select placeholder="Warehouse" value={warehouse} onChange={setWarehouse} allowClear style={{ width: '100%' }}>
                {/* Simplified filter options since they aren't generated by usage service yet */}
                <Option value="WH1">WH1</Option>
              </Select>
            </Col>
            <Col xs={12} sm={6} md={5}>
              <Select placeholder="Class" value={stockClass} onChange={setStockClass} allowClear style={{ width: '100%' }}>
                <Option value="C">C</Option>
                <Option value="M">M</Option>
              </Select>
            </Col>
            <Col xs={12} sm={12} md={3} style={{ display: 'flex', gap: '8px' }}>
              <Button onClick={handleResetFilters} style={{ flex: 1 }}>Reset</Button>
              <Button type="primary" icon={<ReloadOutlined />} onClick={fetchUsageData} loading={loading} />
            </Col>
          </Row>
        </Space>
      </Card>

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

export default PemakaianPage;
