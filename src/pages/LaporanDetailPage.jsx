import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const LaporanDetailPage = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card className="glass-card">
        <Title level={2}>Laporan Detail</Title>
        <Paragraph>Halaman ini sengaja dikosongkan untuk pengembangan fitur Laporan di masa depan.</Paragraph>
      </Card>
    </div>
  );
};

export default LaporanDetailPage;
