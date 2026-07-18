import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Select, Spin, Space, Typography, Button, Empty, Divider } from 'antd';
import { ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import api from '../services/api';

// Standalone Components
import KPICards from '../components/KPICards';
import StockDistributionChart from '../components/StockDistributionChart';
import StockTypeDistributionChart from '../components/StockTypeDistributionChart';
import StockClassChart from '../components/StockClassChart';
import VendorConsignmentChart from '../components/VendorConsignmentChart';
import CoverageChart from '../components/CoverageChart';
import UsageTrendChart from '../components/UsageTrendChart';
import TopUsageChart from '../components/TopUsageChart';
import AlertSection from '../components/AlertSection';
import AgingBucketChart from '../components/AgingBucketChart';
import MiniMonitoringTable from '../components/MiniMonitoringTable';

const { Text, Title } = Typography;
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
      {/* HEADER & FILTERS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={3} style={{ margin: 0, textTransform: 'uppercase' }}>DASHBOARD MONITORING STOK GUDANG & CONSIGNMENT</Title>
          <Text type="secondary">Ringkasan Kondisi Stok & Pemakaian</Text>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Periode</Text>
            <Select 
              value={selectedUpload}
              onChange={setSelectedUpload}
              style={{ width: 160 }}
              options={uploads.map(u => ({
                value: u.id,
                label: new Date(u.upload_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
              }))}
            />
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Warehouse</Text>
            <Select
              allowClear
              placeholder="Semua"
              value={warehouse}
              onChange={setWarehouse}
              style={{ width: 120 }}
              options={filterOptions.warehouses.map(w => ({ value: w, label: w }))}
            />
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Jenis Stok</Text>
            <Select
              allowClear
              placeholder="Semua"
              value={stockType}
              onChange={setStockType}
              style={{ width: 120 }}
              options={filterOptions.stockTypes.map(w => ({ value: w, label: w }))}
            />
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Kategori</Text>
            <Select
              allowClear
              placeholder="Semua"
              value={stockClass}
              onChange={setStockClass}
              style={{ width: 120 }}
              options={filterOptions.stockClasses.map(w => ({ value: w, label: w }))}
            />
          </div>
          <Button onClick={handleResetFilters}>Reset Filter</Button>
          <Button type="primary" icon={<ReloadOutlined />} onClick={fetchDashboardData}>Refresh</Button>
        </div>
      </div>

      <Divider style={{ margin: '12px 0' }} />

      <Spin spinning={loading}>
        {/* ROW 1: KPI CARDS */}
        <KPICards summary={summary} />

        {/* ROW 2: MAIN CHARTS */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} md={6}>
            <Card title="DISTRIBUSI STOK (Qty)" bordered={false} className="glass-card" style={{ height: '100%' }}>
              <StockDistributionChart data={charts.stockDistribution} />
            </Card>
          </Col>
          <Col xs={24} md={10}>
            <Card title="TREND PEMAKAIAN (6 BULAN TERAKHIR)" bordered={false} className="glass-card" style={{ height: '100%' }}>
              <UsageTrendChart trends={charts.trends} />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card title="TOP 10 PEMAKAIAN TERTINGGI (QTY)" bordered={false} className="glass-card" style={{ height: '100%' }}>
              <TopUsageChart data={charts.topUsageItems} />
            </Card>
          </Col>
        </Row>

        {/* ROW 3: MONITORING & DONUT CHARTS */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} md={12}>
            <Card title="MONITORING STOK GUDANG" bordered={false} className="glass-card" style={{ height: '100%' }}>
              <MiniMonitoringTable 
                uploadId={selectedUpload}
                filters={{ warehouse, vendor, stock_type: stockType, stock_class: stockClass }}
              />
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <a href="/monitoring" style={{ fontSize: 13 }}>Lihat Semua &gt;</a>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card title="COVERAGE (DAYS OF STOCK)" bordered={false} className="glass-card" style={{ height: '100%' }}>
              <CoverageChart data={charts.coverageDistribution} />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card title="STOK CONSIGNMENT PER VENDOR" bordered={false} className="glass-card" style={{ height: '100%' }}>
              <VendorConsignmentChart data={charts.vendorConsignment} />
            </Card>
          </Col>
        </Row>

        {/* ROW 4: ALERTS & EXCEPTIONS */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} md={14}>
            <Card title="ALERT & EXCEPTION" bordered={false} className="glass-card" style={{ height: '100%' }}>
              <AlertSection 
                uploadId={selectedUpload} 
                alertSummary={charts.alertSummary}
                filters={{ warehouse, vendor, stock_type: stockType, stock_class: stockClass }}
              />
            </Card>
          </Col>
          <Col xs={24} md={10}>
            <Card title="DEAD STOCK / OVERSTOCK ANALYSIS (NILAI)" bordered={false} className="glass-card" style={{ height: '100%' }}>
              <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
                <Col span={12}>
                  <div style={{ border: '1px solid #ffccc7', background: '#fff1f0', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                    <Text type="danger" style={{ fontSize: 11, fontWeight: 600, display: 'block' }}>NILAI DEAD STOCK (&gt; 180 HARI)</Text>
                    <Title level={4} style={{ color: '#f5222d', margin: '4px 0' }}>
                      Rp {parseFloat(charts.alertSummary?.deadStockValue || 0).toLocaleString('id-ID')}
                    </Title>
                    <Text type="secondary" style={{ fontSize: 11 }}>{charts.alertSummary?.deadStock || 0} SKU</Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ border: '1px solid #ffe7ba', background: '#fff7e6', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                    <Text type="warning" style={{ fontSize: 11, fontWeight: 600, display: 'block', color: '#fa8c16' }}>NILAI OVERSTOCK (&gt; 90 HARI)</Text>
                    <Title level={4} style={{ color: '#fa8c16', margin: '4px 0' }}>
                      Rp {parseFloat(charts.alertSummary?.overStockValue || 0).toLocaleString('id-ID')}
                    </Title>
                    <Text type="secondary" style={{ fontSize: 11 }}>{charts.alertSummary?.overStock || 0} SKU</Text>
                  </div>
                </Col>
              </Row>
              
              <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>AGING BUCKET (BERDASARKAN NILAI STOK)</Text>
              <AgingBucketChart data={charts.agingBuckets} />
            </Card>
          </Col>
        </Row>
      </Spin>
    </Space>
  );
};

export default DashboardPage;
