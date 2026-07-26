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

  const totalQty = (summary.totalSOH || 0) + (summary.totalCOH || 0) || 1;
  const sohPct = (((summary.totalSOH || 0) / totalQty) * 100).toFixed(1);
  const cohPct = (((summary.totalCOH || 0) / totalQty) * 100).toFixed(1);

  return (
    <Row gutter={[16, 16]}>
      {/* 1. Total SKU Aktif */}
      <Col xs={24} sm={12} md={4} lg={4}>
        <Card bodyStyle={{ padding: '16px' }} style={{ height: '100%' }}>
          <Text type="secondary" strong style={{ fontSize: 11, display: 'block', marginBottom: 12 }}>TOTAL SKU AKTIF</Text>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', background: '#e6f7ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 10, flexShrink: 0
            }}>
              <AppstoreOutlined style={{ fontSize: 22, color: '#1890ff' }} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#000', lineHeight: 1 }}>
                {formatNumber(summary.totalSKU)}
              </div>
              <div style={{ marginTop: 6 }}>
                <span style={{ fontSize: 11, color: '#52c41a', background: '#f6ffed', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                  100% Aktif
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Col>

      {/* 2. Total Stok Gudang */}
      <Col xs={24} sm={12} md={5} lg={5}>
        <Card bodyStyle={{ padding: '16px' }} style={{ height: '100%' }}>
          <Text type="secondary" strong style={{ fontSize: 11, display: 'block', marginBottom: 12 }}>TOTAL STOK GUDANG (SOH)</Text>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', background: '#e6f7ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 10, flexShrink: 0
            }}>
              <ShopOutlined style={{ fontSize: 22, color: '#1890ff' }} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#000', lineHeight: 1 }}>
                {formatNumber(summary.totalSOH)} <span style={{ fontSize: 12, fontWeight: 'normal' }}>Qty</span>
              </div>
              <div style={{ marginTop: 6 }}>
                <span style={{ fontSize: 11, color: '#1890ff', background: '#e6f7ff', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                  {sohPct}% dari Total Stok
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Col>

      {/* 3. Total Stok Consignment */}
      <Col xs={24} sm={12} md={5} lg={5}>
        <Card bodyStyle={{ padding: '16px' }} style={{ height: '100%' }}>
          <Text type="secondary" strong style={{ fontSize: 11, display: 'block', marginBottom: 12 }}>TOTAL STOK CONSIGNMENT (COH)</Text>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', background: '#f6ffed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 10, flexShrink: 0
            }}>
              <SafetyCertificateOutlined style={{ fontSize: 22, color: '#52c41a' }} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#000', lineHeight: 1 }}>
                {formatNumber(summary.totalCOH)} <span style={{ fontSize: 12, fontWeight: 'normal' }}>Qty</span>
              </div>
              <div style={{ marginTop: 6 }}>
                <span style={{ fontSize: 11, color: '#52c41a', background: '#f6ffed', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                  {cohPct}% dari Total Stok
                </span>
              </div>
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
              width: 44, height: 44, borderRadius: '50%', background: '#f9f0ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 10, flexShrink: 0
            }}>
              <StockOutlined style={{ fontSize: 22, color: '#722ed1' }} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#000', lineHeight: 1 }}>
                {formatNumber(summary.totalUsageQty)} <span style={{ fontSize: 12, fontWeight: 'normal' }}>Qty</span>
              </div>
              <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 6 }}>Total Qty Pemakaian</div>
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
              width: 44, height: 44, borderRadius: '50%', background: '#fff7e6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 10, flexShrink: 0
            }}>
              <CalendarOutlined style={{ fontSize: 22, color: '#fa8c16' }} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#000', lineHeight: 1, marginBottom: 4 }}>
                {summary.avgDaysStock?.toFixed(1)} <span style={{ fontSize: 12, fontWeight: 'normal' }}>Hari</span>
              </div>
              <div style={{ fontSize: 11, color: '#8c8c8c' }}>
                Rata-rata Ketahanan Stok
              </div>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default KPICards;
