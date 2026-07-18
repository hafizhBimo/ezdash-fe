import React from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import { 
  AppstoreOutlined, 
  ShopOutlined, 
  SafetyCertificateOutlined,
  StockOutlined,
  CalendarOutlined,
  ArrowUpOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const formatNumber = (val) => parseFloat(val || 0).toLocaleString('id-ID');

const formatRupiah = (val) => {
  return 'Rp ' + parseFloat(val || 0).toLocaleString('id-ID');
};

const KPICards = ({ summary }) => {
  if (!summary) return null;

  return (
    <Row gutter={[16, 16]}>
      {/* 1. Total SKU Aktif */}
      <Col xs={24} sm={12} md={4} lg={4}>
        <Card bodyStyle={{ padding: '16px' }} style={{ height: '100%' }}>
          <Text type="secondary" strong style={{ fontSize: 11, display: 'block', marginBottom: 12 }}>TOTAL SKU AKTIF</Text>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: '#e6f7ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12
            }}>
              <AppstoreOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#000', lineHeight: 1 }}>
                {formatNumber(summary.totalSKU)}
              </div>
              <Text type="secondary" style={{ fontSize: 12 }}>SKU</Text>
            </div>
          </div>
        </Card>
      </Col>

      {/* 2. Total Stok Gudang */}
      <Col xs={24} sm={12} md={5} lg={5}>
        <Card bodyStyle={{ padding: '16px' }} style={{ height: '100%' }}>
          <Text type="secondary" strong style={{ fontSize: 11, display: 'block', marginBottom: 12 }}>TOTAL STOK GUDANG</Text>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: '#e6f7ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12
            }}>
              <ShopOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#000', lineHeight: 1 }}>
                {formatNumber(summary.totalSOH)} <span style={{fontSize: 12, fontWeight: 'normal'}}>Qty</span>
              </div>
              <Text style={{ fontSize: 13, fontWeight: 600 }}>{formatRupiah(summary.totalSOHAmount)}</Text>
              <div style={{ fontSize: 11, color: '#8c8c8c' }}>Nilai</div>
            </div>
          </div>
        </Card>
      </Col>

      {/* 3. Total Stok Consignment */}
      <Col xs={24} sm={12} md={5} lg={5}>
        <Card bodyStyle={{ padding: '16px' }} style={{ height: '100%' }}>
          <Text type="secondary" strong style={{ fontSize: 11, display: 'block', marginBottom: 12 }}>TOTAL STOK CONSIGNMENT</Text>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: '#f6ffed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12
            }}>
              <SafetyCertificateOutlined style={{ fontSize: 24, color: '#52c41a' }} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#000', lineHeight: 1 }}>
                {formatNumber(summary.totalCOH)} <span style={{fontSize: 12, fontWeight: 'normal'}}>Qty</span>
              </div>
              <Text style={{ fontSize: 13, fontWeight: 600 }}>{formatRupiah(summary.totalCOHAmount)}</Text>
              <div style={{ fontSize: 11, color: '#8c8c8c' }}>Nilai</div>
            </div>
          </div>
        </Card>
      </Col>

      {/* 4. Total Pemakaian */}
      <Col xs={24} sm={12} md={5} lg={5}>
        <Card bodyStyle={{ padding: '16px' }} style={{ height: '100%' }}>
          <Text type="secondary" strong style={{ fontSize: 11, display: 'block', marginBottom: 12 }}>TOTAL PEMAKAIAN (TERBARU)</Text>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: '#f9f0ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12
            }}>
              <StockOutlined style={{ fontSize: 24, color: '#722ed1' }} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#000', lineHeight: 1 }}>
                {formatNumber(summary.totalUsageQty)} <span style={{fontSize: 12, fontWeight: 'normal'}}>Qty</span>
              </div>
              <Text style={{ fontSize: 13, fontWeight: 600 }}>{formatRupiah(summary.totalUsageValue)}</Text>
              <div style={{ fontSize: 11, color: '#8c8c8c' }}>Nilai</div>
            </div>
          </div>
        </Card>
      </Col>

      {/* 5. Days of Inventory */}
      <Col xs={24} sm={12} md={5} lg={5}>
        <Card bodyStyle={{ padding: '16px' }} style={{ height: '100%' }}>
          <Text type="secondary" strong style={{ fontSize: 11, display: 'block', marginBottom: 12 }}>DAYS OF INVENTORY</Text>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: '#fff7e6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12
            }}>
              <CalendarOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#000', lineHeight: 1, marginBottom: 4 }}>
                {summary.avgDaysStock?.toFixed(1)} <span style={{fontSize: 12, fontWeight: 'normal'}}>Hari</span>
              </div>
              <div style={{ fontSize: 11, color: '#8c8c8c' }}>
                vs rata-rata <ArrowUpOutlined style={{color: '#52c41a'}}/>
              </div>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default KPICards;
