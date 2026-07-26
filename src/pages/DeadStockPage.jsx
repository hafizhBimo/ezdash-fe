import React from 'react';
import { Card, Empty, Typography } from 'antd';

const { Title, Text } = Typography;

const DeadStockPage = () => {
  return (
    <Card className="glass-card" style={{ textAlign: 'center', padding: '80px 24px', minHeight: 400 }}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div>
            <Title level={4} style={{ marginBottom: 8, color: '#595959' }}>
              Dead Stock / Overstock Analysis
            </Title>
            <Text type="secondary" style={{ fontSize: 14 }}>
              Halaman ini sengaja dikosongkan untuk pengembangan fitur Laporan di masa depan.
            </Text>
          </div>
        }
      />
    </Card>
  );
};

export default DeadStockPage;
