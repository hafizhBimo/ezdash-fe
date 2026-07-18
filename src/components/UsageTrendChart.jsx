import React from 'react';
import ReactECharts from 'echarts-for-react';

const UsageTrendChart = ({ trends }) => {
  const dates = trends.inventoryValue.map(t => t.date);
  const values = trends.inventoryValue.map(t => t.value);

  const option = {
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

  return (
    <div className="chart-panel">
      <div className="chart-title">Tren Nilai Inventory (Total Asset)</div>
      <div style={{ height: '350px' }}>
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};

export default UsageTrendChart;
