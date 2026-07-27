import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Select, Space, Button, Typography, Row, Col, Tag } from 'antd';
import { SearchOutlined, ReloadOutlined, CalendarOutlined, FileExcelOutlined, LineChartOutlined } from '@ant-design/icons';
import api from '../services/api';
import { getStockTypeLabel } from '../utils/stockTypeMaster';
import UsageTrendChart from '../components/UsageTrendChart';

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

  // Unique filter lists
  const [uniqueWarehouses, setUniqueWarehouses] = useState([]);
  const [uniqueVendors, setUniqueVendors] = useState([]);
  const [uniqueStockTypes, setUniqueStockTypes] = useState([]);
  const [uniqueStockClasses, setUniqueStockClasses] = useState([]);

  // Trends
  const [trends, setTrends] = useState({ usage: [] });

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
        warehouse: warehouse || undefined,
        vendor: vendor || undefined,
        stock_type: stockType || undefined,
        stock_class: stockClass || undefined,
        sortBy,
        sortOrder
      };

      const [usageRes, chartsRes] = await Promise.all([
        api.get('/usages', { params }),
        api.get('/dashboard/charts', { params: { 
          upload_id: selectedUpload,
          search: searchText || undefined,
          warehouse: warehouse || undefined,
          vendor: vendor || undefined,
          stock_type: stockType || undefined,
          stock_class: stockClass || undefined
        }})
      ]);

      if (usageRes.data?.status === 'success') {
        const { rows, count, uniqueFilters } = usageRes.data.data;
        setData(rows);
        setTotalCount(count);

        if (uniqueFilters) {
          setUniqueWarehouses(uniqueFilters.warehouses || []);
          setUniqueVendors(uniqueFilters.vendors || []);
          setUniqueStockTypes(uniqueFilters.stockTypes || []);
          setUniqueStockClasses(uniqueFilters.stockClasses || []);
        }
      }

      if (chartsRes.data?.data?.trends) {
        setTrends(chartsRes.data.data.trends);
      }
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

  const handleSearch = () => {
    setPage(1);
    fetchUsageData();
  };

  const handleResetFilters = () => {
    setWarehouse(undefined);
    setVendor(undefined);
    setStockType(undefined);
    setStockClass(undefined);
    setSearchText('');
    setPage(1);
  };

  // Export CSV functionality
  const handleExportCSV = () => {
    if (!data || data.length === 0) return;
    
    const headers = [
      'No', 'Stock Code', 'Part Number', 'Nama Item', 'Warehouse', 'Jenis Stok', 'Kategori', 'Vendor', 'Qty Pemakaian', 'Harga Satuan (Rp)', 'Nilai Pemakaian (Rp)'
    ];

    const rows = data.map((row, idx) => {
      const qty = parseFloat(row.usage_qty || 0);
      const price = parseFloat(row.item?.price || 0);
      return [
        (page - 1) * pageSize + idx + 1,
        `"${row.item?.stock_code || ''}"`,
        `"${row.item?.part_number || '-'}"`,
        `"${(row.item?.item_name || '').replace(/"/g, '""')}"`,
        `"${row.item?.warehouse || '-'}"`,
        `"${getStockTypeLabel(row.item?.stock_type)}"`,
        `"${row.item?.stock_class || '-'}"`,
        `"${row.item?.vendor || '-'}"`,
        qty,
        price,
        qty * price
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Pemakaian_Barang_${selectedUpload}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      title: 'No',
      key: 'no',
      width: 60,
      align: 'center',
      render: (_, __, index) => (page - 1) * pageSize + index + 1
    },
    {
      title: 'Stock Code',
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
      render: (val) => val ? <Tag color="blue">{val}</Tag> : <Text type="secondary">-</Text>
    },
    {
      title: 'Nama Item',
      dataIndex: ['item', 'item_name'],
      key: 'item_name',
      sorter: true,
      ellipsis: true,
      width: '24%'
    },
    {
      title: 'Warehouse',
      dataIndex: ['item', 'warehouse'],
      key: 'warehouse',
      sorter: true,
      align: 'center',
      render: (val) => val || '-'
    },
    {
      title: 'Jenis Stok',
      dataIndex: ['item', 'stock_type'],
      key: 'stock_type',
      sorter: true,
      render: (val) => getStockTypeLabel(val)
    },
    {
      title: 'Kategori',
      dataIndex: ['item', 'stock_class'],
      key: 'stock_class',
      sorter: true,
      align: 'center',
      render: (val) => val ? <Tag color="purple">{val}</Tag> : '-'
    },
    {
      title: 'Qty Pemakaian',
      dataIndex: 'usage_qty',
      key: 'usage_qty',
      sorter: true,
      align: 'right',
      render: (val) => <Text strong style={{ color: '#eb2f96' }}>{parseFloat(val || 0).toLocaleString('id-ID')}</Text>
    },
    {
      title: 'Harga Satuan (Rp)',
      dataIndex: ['item', 'price'],
      key: 'price',
      sorter: true,
      align: 'right',
      render: (val) => 'Rp ' + parseFloat(val || 0).toLocaleString('id-ID')
    },
    {
      title: 'Nilai Pemakaian (Rp)',
      key: 'usage_amount',
      align: 'right',
      render: (_, record) => {
        const qty = parseFloat(record.usage_qty || 0);
        const price = parseFloat(record.item?.price || 0);
        return <Text strong style={{ color: '#722ed1' }}>{'Rp ' + (qty * price).toLocaleString('id-ID')}</Text>;
      }
    }
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: 0, fontWeight: 800 }}>PEMAKAIAN BARANG</Title>
        <Paragraph type="secondary" style={{ margin: 0 }}>
          Laporan jumlah dan nilai barang yang telah digunakan/dikeluarkan (Periode 6 Bulan Terakhir).
        </Paragraph>
      </div>

      {/* Usage Trend Line Chart (6 Months) */}
      <Card title="DIAGRAM PEMAKAIAN BULANAN (6 BULAN TERAKHIR)" bordered={false} className="glass-card">
        <UsageTrendChart trends={trends} />
      </Card>

      {/* Filters Card */}
      <Card className="glass-card">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Periode Excel Upload</Text>
            <Select 
              value={selectedUpload} 
              style={{ width: '100%' }} 
              onChange={val => { setSelectedUpload(val); setPage(1); }}
              placeholder="Pilih File Upload"
            >
              {uploads.map(u => {
                const dateStr = u.upload_date ? new Date(u.upload_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
                return (
                  <Option key={u.id} value={u.id}>
                    {u.filename} ({dateStr})
                  </Option>
                );
              })}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Pencarian Item</Text>
            <Input
              placeholder="Cari Part No / Stock Code / Nama Item..."
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
            />
          </Col>

          <Col xs={24} sm={8} md={4}>
            <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Warehouse</Text>
            <Select
              style={{ width: '100%' }}
              value={warehouse}
              onChange={val => { setWarehouse(val); setPage(1); }}
              placeholder="Semua Warehouse"
              allowClear
            >
              <Option value="">Semua Warehouse</Option>
              {uniqueWarehouses.map(w => (
                <Option key={w} value={w}>{w}</Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={8} md={4}>
            <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Jenis Stok (Stock Type)</Text>
            <Select
              style={{ width: '100%' }}
              value={stockType}
              onChange={val => { setStockType(val); setPage(1); }}
              placeholder="Semua Jenis Stok"
              allowClear
            >
              <Option value="">Semua Jenis Stok</Option>
              {uniqueStockTypes.map(st => (
                <Option key={st} value={st}>{getStockTypeLabel(st)}</Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={8} md={4}>
            <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Kategori (Stock Class)</Text>
            <Select
              style={{ width: '100%' }}
              value={stockClass}
              onChange={val => { setStockClass(val); setPage(1); }}
              placeholder="Semua Kategori"
              allowClear
            >
              <Option value="">Semua Kategori</Option>
              {uniqueStockClasses.map(sc => (
                <Option key={sc} value={sc}>Kategori {sc}</Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Row justify="start" align="middle" style={{ marginTop: 16 }}>
          <Col>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                Cari Pemakaian
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>
                Reset Filter
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card 
        title={
          <Space>
            <LineChartOutlined style={{ color: '#eb2f96' }} />
            <span>Laporan Detail Pemakaian ({totalCount.toLocaleString('id-ID')} Items)</span>
          </Space>
        } 
        className="glass-card" 
        bodyStyle={{ padding: 0 }}
      >
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
            onChange: (p, ps) => { setPage(p); setPageSize(ps); },
            showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total.toLocaleString('id-ID')} Items Pemakaian`
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
