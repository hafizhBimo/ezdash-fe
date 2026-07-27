import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Select, Button, Space, Typography, Row, Col, Tag, Spin, Tooltip } from 'antd';
import { SearchOutlined, ReloadOutlined, DatabaseOutlined, DownloadOutlined, FileExcelOutlined } from '@ant-design/icons';
import api from '../services/api';
import { getStockTypeLabel } from '../utils/stockTypeMaster';

const { Title, Text } = Typography;
const { Option } = Select;

const MasterDataPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Upload history & selected upload
  const [uploads, setUploads] = useState([]);
  const [selectedUpload, setSelectedUpload] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [stockType, setStockType] = useState('');
  const [stockClass, setStockClass] = useState('');

  // Dropdown options
  const [uniqueWarehouses, setUniqueWarehouses] = useState([]);
  const [uniqueStockTypes, setUniqueStockTypes] = useState([]);
  const [uniqueStockClasses, setUniqueStockClasses] = useState([]);

  // Fetch Upload History
  const fetchUploadHistory = async () => {
    try {
      const res = await api.get('/upload/history');
      if (res.data?.status === 'success') {
        const history = res.data.data.filter(u => u.status === 'SUCCESS');
        setUploads(history);
        if (history.length > 0 && !selectedUpload) {
          setSelectedUpload(history[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching upload history:', err);
    }
  };

  useEffect(() => {
    fetchUploadHistory();
  }, []);

  // Fetch Master Data
  const fetchMasterData = async () => {
    if (!selectedUpload) return;
    setLoading(true);
    try {
      const res = await api.get('/monitoring', {
        params: {
          upload_id: selectedUpload,
          page,
          limit: pageSize,
          search: search || undefined,
          warehouse: warehouse || undefined,
          stock_type: stockType || undefined,
          stock_class: stockClass || undefined
        }
      });

      if (res.data?.status === 'success') {
        setData(res.data.data.rows);
        setTotal(res.data.data.count);

        if (res.data.data.uniqueFilters) {
          setUniqueWarehouses(res.data.data.uniqueFilters.warehouses || []);
          setUniqueStockTypes(res.data.data.uniqueFilters.stockTypes || []);
          setUniqueStockClasses(res.data.data.uniqueFilters.stockClasses || []);
        }
      }
    } catch (err) {
      console.error('Error fetching master data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUpload) {
      fetchMasterData();
    }
  }, [selectedUpload, page, pageSize, search, warehouse, stockType, stockClass]);

  const handleSearch = () => {
    setPage(1);
    fetchMasterData();
  };

  const handleReset = () => {
    setSearch('');
    setWarehouse('');
    setStockType('');
    setStockClass('');
    setPage(1);
  };

  // Export CSV functionality
  const handleExportCSV = () => {
    if (!data || data.length === 0) return;
    
    const headers = [
      'No', 'Stock Code', 'Part Number', 'Nama Item', 'Kategori', 'Jenis Stok', 'Warehouse', 'Vendor', 'Harga Satuan (Rp)', 'MIN Qty', 'ROP Qty', 'ROQ Qty', 'UOM'
    ];

    const rows = data.map((row, idx) => [
      (page - 1) * pageSize + idx + 1,
      `"${row.item?.stock_code || ''}"`,
      `"${row.item?.part_number || '-'}"`,
      `"${(row.item?.item_name || '').replace(/"/g, '""')}"`,
      `"${row.item?.stock_class || '-'}"`,
      `"${getStockTypeLabel(row.item?.stock_type)}"`,
      `"${row.item?.warehouse || '-'}"`,
      `"${row.item?.vendor || '-'}"`,
      parseFloat(row.item?.price || 0),
      parseFloat(row.min_qty || 0),
      parseFloat(row.rop_qty || 0),
      parseFloat(row.roq_qty || 0),
      `"${row.item?.uom || '-'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Master_Data_Excel_Upload_${selectedUpload}.csv`);
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
      width: 130,
      render: text => <Text strong>{text}</Text>
    },
    {
      title: 'Part Number',
      dataIndex: ['item', 'part_number'],
      key: 'part_number',
      width: 140,
      render: text => text ? <Tag color="blue">{text}</Tag> : <Text type="secondary">-</Text>
    },
    {
      title: 'Nama Item',
      dataIndex: ['item', 'item_name'],
      key: 'item_name',
      ellipsis: true
    },
    {
      title: 'Kategori',
      dataIndex: ['item', 'stock_class'],
      key: 'stock_class',
      width: 90,
      align: 'center',
      render: v => v ? <Tag color="purple">{v}</Tag> : '-'
    },
    {
      title: 'Jenis Stok',
      dataIndex: ['item', 'stock_type'],
      key: 'stock_type',
      width: 180,
      render: code => getStockTypeLabel(code)
    },
    {
      title: 'Warehouse',
      dataIndex: ['item', 'warehouse'],
      key: 'warehouse',
      width: 110,
      align: 'center',
      render: v => v || '-'
    },
    {
      title: 'Vendor',
      dataIndex: ['item', 'vendor'],
      key: 'vendor',
      width: 150,
      ellipsis: true,
      render: v => v || '-'
    },
    {
      title: 'Harga Satuan (Rp)',
      dataIndex: ['item', 'price'],
      key: 'price',
      width: 140,
      align: 'right',
      render: val => val ? `Rp ${parseFloat(val).toLocaleString('id-ID')}` : '-'
    },
    {
      title: 'MIN (Qty)',
      dataIndex: 'min_qty',
      key: 'min_qty',
      width: 100,
      align: 'right',
      render: v => parseFloat(v || 0).toLocaleString('id-ID')
    },
    {
      title: 'ROP (Qty)',
      dataIndex: 'rop_qty',
      key: 'rop_qty',
      width: 100,
      align: 'right',
      render: v => parseFloat(v || 0).toLocaleString('id-ID')
    },
    {
      title: 'ROQ (Qty)',
      dataIndex: 'roq_qty',
      key: 'roq_qty',
      width: 100,
      align: 'right',
      render: v => parseFloat(v || 0).toLocaleString('id-ID')
    },
    {
      title: 'UOM',
      dataIndex: ['item', 'uom'],
      key: 'uom',
      width: 80,
      align: 'center',
      render: v => v || '-'
    }
  ];

  return (
    <div style={{ padding: '0 4px' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 800 }}>MASTER DATA ITEM</Title>
        <Text type="secondary">
          Daftar Master Item & Parameter dari Excel Upload Terakhir (atau Upload Terpilih)
        </Text>
      </div>

      {/* Filter Card */}
      <Card bordered={false} className="glass-card" style={{ marginBottom: 20 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Periode Excel Upload</Text>
            <Select
              style={{ width: '100%' }}
              value={selectedUpload}
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
              placeholder="Cari Stock Code / Part No / Item..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onPressEnter={handleSearch}
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              allowClear
            />
          </Col>

          <Col xs={24} sm={8} md={4}>
            <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Warehouse</Text>
            <Select
              style={{ width: '100%' }}
              value={warehouse}
              onChange={val => { setWarehouse(val); setPage(1); }}
              placeholder="Semua Warehouse"
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
                Cari Data
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                Reset Filter
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Main Table Card */}
      <Card 
        title={
          <Space>
            <DatabaseOutlined style={{ color: '#1890ff' }} />
            <span>Daftar Master Data Item ({total.toLocaleString('id-ID')} SKU)</span>
          </Space>
        } 
        bordered={false} 
        className="glass-card"
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 'max-content' }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '15', '25', '50', '100'],
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
            showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total.toLocaleString('id-ID')} Master Items`
          }}
        />
      </Card>
    </div>
  );
};

export default MasterDataPage;
