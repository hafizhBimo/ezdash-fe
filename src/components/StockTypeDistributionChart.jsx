import React from 'react';
import ReactECharts from 'echarts-for-react';

const StockTypeDistributionChart = ({ data }) => {
  const option = {
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
      data: data
    }]
  };

  return (
    <div className="chart-panel">
      <div className="chart-title">Distribusi Stock Type</div>
      <div style={{ height: '300px' }}>
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};

export default StockTypeDistributionChart;
