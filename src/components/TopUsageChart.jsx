import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Empty } from 'antd';

const TopUsageChart = ({ data }) => {
  const reversedData = data ? [...data].reverse() : [];
  
  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value' },
    yAxis: { 
      type: 'category', 
      data: reversedData.map(d => d.name.length > 20 ? d.name.substring(0, 20) + '...' : d.name) 
    },
    series: [{
      name: 'Total Usage Qty',
      type: 'bar',
      data: reversedData.map(d => d.usage),
      itemStyle: {
        color: '#fa8c16',
        borderRadius: [0, 4, 4, 0]
      }
    }]
  };

  const hasData = data && data.length > 0;

  return (
    <div className="chart-panel">
      <div className="chart-title">Top 10 Usage Items</div>
      <div style={{ height: '300px' }}>
        {hasData ? (
          <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
        ) : (
          <Empty description="Tidak ada data pemakaian" />
        )}
      </div>
    </div>
  );
};

export default TopUsageChart;
