import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Select, Statistic, Spin, Space, Typography, Button, Empty } from 'antd';
import { 
  ReloadOutlined, 
  DatabaseOutlined, 
  InboxOutlined, 
  DollarOutlined, 
  CalendarOutlined 
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import api from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

const DashboardPage = () => {
  const [loading, setLoading] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [selectedUpload, setSelectedUpload] = useState(null);
  
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

  // Data states
  const [summary, setSummary] = useState({
    totalSKU: 0,
    totalSOH: 0,
    totalCOH: 0,
    totalValue: 0,
    avgDaysStock: 0
  });

  const [charts, setCharts] = useState({
    stockDistribution: [],
    stockTypeDistribution: [],
    stockClassDistribution: [],
    vendorConsignment: [],
    coverageDistribution: [],
    topUsageItems: [],
    trends: {
      inventoryValue: [],
      usage: []
    }
  });

  // Fetch initial files lists
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

  // Fetch unique filter values (from monitoring list api helper)
  const fetchFilterOptions = async () => {
    if (!selectedUpload) return;
    try {
      const response = await api.get('/monitoring', {
        params: { upload_id: selectedUpload, limit: 1 }
      });
      if (response.data.data.uniqueFilters) {
        setFilterOptions(response.data.data.uniqueFilters);
      }
    } catch (error) {
      console.error('Failed to load filter options:', error);
    }
  };

  // Fetch dashboard metrics
  const fetchDashboardData = async () => {
    if (!selectedUpload) return;
    setLoading(true);
    try {
      const params = {
        upload_id: selectedUpload,
        warehouse,
        vendor,
        stock_type: stockType,
        stock_class: stockClass
      };

      const [summaryRes, chartsRes] = await Promise.all([
        api.get('/dashboard/summary', { params }),
        api.get('/dashboard/charts', { params })
      ]);

      setSummary(summaryRes.data.data.summary);
      setCharts(chartsRes.data.data);
    } catch (error) {
      console.error('Failed to load dashboard statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploadHistory();
  }, []);

  useEffect(() => {
    if (selectedUpload) {
      fetchFilterOptions();
      fetchDashboardData();
    }
  }, [selectedUpload, warehouse, vendor, stockType, stockClass]);

  const handleResetFilters = () => {
    setWarehouse(undefined);
    setVendor(undefined);
    setStockType(undefined);
    setStockClass(undefined);
  };

  // ----------------------------------------------------
  // Chart Config Options
  // ----------------------------------------------------

  // 1. Stock SOH vs COH pie
  const getStockDistOption = () => ({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: '0', left: 'center', icon: 'circle' },
    color: ['#1890ff', '#52c41a'],
    series: [{
      name: 'Stock',
      type: 'pie',
      radius: ['45%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      data: charts.stockDistribution
    }]
  });

  // 2. Stock Type distribution donut
  const getStockTypeDistOption = () => ({
    tooltip: { trigger: 'item', formatter: '{b}: {c} SKUs ({d}%)' },
    legend: { show: false },
    color: ['#1890ff', '#13c2c2', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#eb2f96', '#2f54eb', '#fa8c16'],
    series: [{
      name: 'Type',
      type: 'pie',
      radius: ['40%', '65%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 1 },
      label: { show: true, position: 'outside', formatter: '{b}: {d}%' },
      data: charts.stockTypeDistribution
    }]
  });

  // 3. SKU by Stock Class horizontal bar
  const getStockClassOption = () => {
    const data = charts.stockClassDistribution;
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'value', boundaryGap: [0, 0.01] },
      yAxis: { type: 'category', data: data.map(d => `Class ${d.name}`) },
      series: [{
        name: 'SKU Count',
        type: 'bar',
        data: data.map(d => d.value),
        itemStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [{ offset: 0, color: '#1890ff' }, { offset: 1, color: '#69c0ff' }]
          },
          borderRadius: [0, 4, 4, 0]
        }
      }]
    };
  };

  // 4. Consignment per Vendor (Top 5)
  const getVendorConsignmentOption = () => {
    const data = charts.vendorConsignment;
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'value' },
      yAxis: { 
        type: 'category', 
        data: data.map(d => d.vendor && d.vendor.length > 15 ? d.vendor.substring(0, 15) + '...' : d.vendor || 'N/A') 
      },
      series: [{
        name: 'Total Consignment Stock (COH)',
        type: 'bar',
        data: data.map(d => d.coh),
        itemStyle: {
          color: '#52c41a',
          borderRadius: [0, 4, 4, 0]
        }
      }]
    };
  };

  // 5. Coverage Distribution (Column chart)
  const getCoverageDistOption = () => {
    const data = charts.coverageDistribution;
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: data.map(d => d.name) },
      yAxis: { type: 'value' },
      series: [{
        name: 'SKU count',
        type: 'bar',
        data: data.map(d => d.value),
        itemStyle: {
          color: (params) => {
            const colors = ['#bfbfbf', '#ff4d4f', '#ffc069', '#95de64', '#95de64', '#95de64'];
            return colors[params.dataIndex];
          },
          borderRadius: [4, 4, 0, 0]
        }
      }]
    };
  };

  // 6. Trend Lines
  const getTrendOption = () => {
    const dates = charts.trends.inventoryValue.map(t => t.date);
    const values = charts.trends.inventoryValue.map(t => t.value);
    
    return {
      tooltip: { trigger: 'axis' },
      legend: { data: ['Inventory Value (Rp)'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', boundaryGap: false, data: dates },
      yAxis: { type: 'value' },
      series: [{
        name: 'Inventory Value (Rp)',
        type: 'line',
        data: values,
        smooth: true,
        itemStyle: { color: '#1890ff' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(24,144,255,0.3)' }, { offset: 1, color: 'rgba(24,144,255,0)' }]
          }
        }
      }]
    };
  };

  // 7. Top 10 Usage items bar chart
  const getTopUsageOption = () => {
    const data = [...charts.topUsageItems].reverse(); // reverse for clean layout
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'value' },
      yAxis: { 
        type: 'category', 
        data: data.map(d => d.name.length > 20 ? d.name.substring(0, 20) + '...' : d.name) 
      },
      series: [{
        name: 'Total Usage Qty',
        type: 'bar',
        data: data.map(d => d.usage),
        itemStyle: {
          color: '#fa8c16',
          borderRadius: [0, 4, 4, 0]
        }
      }]
    };
  };

  if (uploads.length === 0) {
    return (
      <Card className="glass-card" style={{ textAlign: 'center', padding: '64px 0' }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Belum ada data snapshot stok terunggah."
        >
          <Text type="secondary">Silakan hubungi administrator untuk mengunggah file Excel terlebih dahulu.</Text>
        </Empty>
      </Card>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Top filter section */}
      <Card className="glass-card">
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={8}>
            <Space>
              <CalendarOutlined style={{ color: '#1890ff', fontSize: '18px' }} />
              <Text strong>Pilih Snapshot:</Text>
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
          
          <Col xs={24} md={16} style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '8px' }}>
            <Select 
              placeholder="Warehouse" 
              value={warehouse} 
              onChange={setWarehouse} 
              allowClear 
              style={{ width: 140 }}
            >
              {filterOptions.warehouses.map(w => <Option key={w} value={w}>{w}</Option>)}
            </Select>

            <Select 
              placeholder="Vendor" 
              value={vendor} 
              onChange={setVendor} 
              allowClear 
              style={{ width: 140 }}
            >
              {filterOptions.vendors.map(v => <Option key={v} value={v}>{v}</Option>)}
            </Select>

            <Select 
              placeholder="Stock Type" 
              value={stockType} 
              onChange={setStockType} 
              allowClear 
              style={{ width: 120 }}
            >
              {filterOptions.stockTypes.map(t => <Option key={t} value={t}>{t}</Option>)}
            </Select>

            <Select 
              placeholder="Stock Class" 
              value={stockClass} 
              onChange={setStockClass} 
              allowClear 
              style={{ width: 120 }}
            >
              {filterOptions.stockClasses.map(c => <Option key={c} value={c}>{c}</Option>)}
            </Select>

            <Button onClick={handleResetFilters}>Reset</Button>
            
            <Button 
              type="primary" 
              icon={<ReloadOutlined />} 
              onClick={fetchDashboardData} 
              loading={loading}
            />
          </Col>
        </Row>
      </Card>

      {/* KPI Cards */}
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={4}>
            <Card className="glass-card" bordered={false}>
              <Statistic 
                title={<div className="kpi-title">Total SKU</div>}
                value={summary.totalSKU} 
                prefix={<DatabaseOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={5}>
            <Card className="glass-card" bordered={false}>
              <Statistic 
                title={<div className="kpi-title">Stok Gudang (SOH)</div>}
                value={summary.totalSOH} 
                precision={0}
                prefix={<InboxOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={5}>
            <Card className="glass-card" bordered={false}>
              <Statistic 
                title={<div className="kpi-title">Stok Consignment (COH)</div>}
                value={summary.totalCOH} 
                precision={0}
                prefix={<InboxOutlined style={{ color: '#52c41a' }} />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="glass-card" bordered={false}>
              <Statistic 
                title={<div className="kpi-title">Inventory Value</div>}
                value={summary.totalValue} 
                precision={0}
                prefix={<DollarOutlined style={{ color: '#1890ff' }} />}
                formatter={(val) => `Rp ${val.toLocaleString('id-ID')}`}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={4}>
            <Card className="glass-card" bordered={false}>
              <Statistic 
                title={<div className="kpi-title">Avg Days of Stock</div>}
                value={summary.avgDaysStock} 
                precision={1}
                suffix=" Days"
              />
            </Card>
          </Col>
        </Row>
      </Spin>

      {/* Main charts grid */}
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <div className="chart-panel">
              <div className="chart-title">Distribusi Stok</div>
              <div style={{ height: '300px' }}>
                {charts.stockDistribution[0]?.value > 0 || charts.stockDistribution[1]?.value > 0 ? (
                  <ReactECharts option={getStockDistOption()} style={{ height: '100%', width: '100%' }} />
                ) : (
                  <Empty description="No Stock Data" />
                )}
              </div>
            </div>
          </Col>

          <Col xs={24} lg={16}>
            <div className="chart-panel">
              <div className="chart-title">Coverage (Days of Stock) Distribution</div>
              <div style={{ height: '300px' }}>
                <ReactECharts option={getCoverageDistOption()} style={{ height: '100%', width: '100%' }} />
              </div>
            </div>
          </Col>
        </Row>
      </Spin>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <div className="chart-panel">
              <div className="chart-title">SKU by Stock Class</div>
              <div style={{ height: '300px' }}>
                <ReactECharts option={getStockClassOption()} style={{ height: '100%', width: '100%' }} />
              </div>
            </div>
          </Col>

          <Col xs={24} lg={12}>
            <div className="chart-panel">
              <div className="chart-title">Distribusi Stock Type</div>
              <div style={{ height: '300px' }}>
                <ReactECharts option={getStockTypeDistOption()} style={{ height: '100%', width: '100%' }} />
              </div>
            </div>
          </Col>
        </Row>
      </Spin>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <div className="chart-panel">
              <div className="chart-title">Consignment per Vendor (Top 5 COH)</div>
              <div style={{ height: '300px' }}>
                {charts.vendorConsignment.length > 0 ? (
                  <ReactECharts option={getVendorConsignmentOption()} style={{ height: '100%', width: '100%' }} />
                ) : (
                  <Empty description="Tidak ada data consignment" />
                )}
              </div>
            </div>
          </Col>

          <Col xs={24} lg={12}>
            <div className="chart-panel">
              <div className="chart-title">Top 10 Usage Items</div>
              <div style={{ height: '300px' }}>
                {charts.topUsageItems.length > 0 ? (
                  <ReactECharts option={getTopUsageOption()} style={{ height: '100%', width: '100%' }} />
                ) : (
                  <Empty description="Tidak ada data pemakaian" />
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Spin>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <div className="chart-panel">
              <div className="chart-title">Tren Nilai Inventory (Total Asset)</div>
              <div style={{ height: '350px' }}>
                <ReactECharts option={getTrendOption()} style={{ height: '100%', width: '100%' }} />
              </div>
            </div>
          </Col>
        </Row>
      </Spin>
    </Space>
  );
};

export default DashboardPage;
