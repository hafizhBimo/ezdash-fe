import React from 'react';
import ReactECharts from 'echarts-for-react';

const StockClassChart = ({ data }) => {
  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', boundaryGap: [0, 0.01] },
    yAxis: { type: 'category', data: data.map(d => `Class ${d.name}`) },
    series: [{
      name: 'SKU Count',
      type: 'bar',
      data: data.map(d => d.value),
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [{ offset: 0, color: '#1890ff' }, { offset: 1, color: '#69c0ff' }]
        },
        borderRadius: [0, 4, 4, 0]
      }
    }]
  };

  return (
    <div className="chart-panel">
      <div className="chart-title">SKU by Stock Class</div>
      <div style={{ height: '300px' }}>
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};

export default StockClassChart;
