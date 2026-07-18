import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Empty } from 'antd';

const VendorConsignmentChart = ({ data }) => {
  const option = {
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)' },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'middle',
      icon: 'circle'
    },
    series: [
      {
        name: 'Konsinyasi per Vendor',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: false },
        labelLine: { show: false },
        data: data.map(d => ({
          name: d.vendor && d.vendor.length > 15 ? d.vendor.substring(0, 15) + '...' : d.vendor || 'Lainnya',
          value: d.coh
        }))
      }
    ]
  };

  const hasData = data && data.length > 0;

  return (
    <div className="chart-panel">
      <div className="chart-title">Consignment per Vendor (Top 5 COH)</div>
      <div style={{ height: '300px' }}>
        {hasData ? (
          <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
        ) : (
          <Empty description="Tidak ada data consignment" />
        )}
      </div>
    </div>
  );
};

export default VendorConsignmentChart;
