import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Empty } from 'antd';

const StockDistributionChart = ({ data }) => {
  const option = {
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
      data: data
    }]
  };

  const hasData = data && (data[0]?.value > 0 || data[1]?.value > 0);

  return (
    <div className="chart-panel">
      <div className="chart-title">Distribusi Stok</div>
      <div style={{ height: '300px' }}>
        {hasData ? (
          <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
        ) : (
          <Empty description="No Stock Data" />
        )}
      </div>
    </div>
  );
};

export default StockDistributionChart;
