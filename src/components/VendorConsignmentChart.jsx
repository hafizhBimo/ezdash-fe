import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Empty } from 'antd';

const VendorConsignmentChart = ({ data }) => {
  const option = {
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : <b>{c} Qty</b> ({d}%)' },
    legend: {
      orient: 'vertical',
      right: '0%',
      top: 'middle',
      icon: 'circle',
      textStyle: { fontSize: 11 },
      formatter: (name) => name.length > 16 ? name.substring(0, 16) + '...' : name
    },
    series: [
      {
        name: 'Konsinyasi per Vendor',
        type: 'pie',
        radius: ['38%', '68%'],
        center: ['30%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: false },
        labelLine: { show: false },
        data: (data || []).map(d => ({
          name: d.vendor || 'Lainnya',
          value: d.coh
        }))
      }
    ]
  };

  const hasData = data && data.length > 0;

  return (
    <div style={{ height: '300px', width: '100%' }}>
      {hasData ? (
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      ) : (
        <Empty description="Tidak ada data consignment" style={{ marginTop: 60 }} />
      )}
    </div>
  );
};

export default VendorConsignmentChart;
