import React from 'react';
import ReactECharts from 'echarts-for-react';

const CoverageChart = ({ data }) => {
  // Map specific colors per item name or statusKey
  const colorMap = {
    'No Usage (0 Hari)': '#8c8c8c',
    '<= 15 Hari (Critical)': '#f5222d',
    '15 - 30 Hari (Warning)': '#faad14',
    '> 30 Hari (Stock Safe)': '#52c41a'
  };

  const chartData = (data || []).map(d => ({
    name: d.name,
    value: d.value,
    itemStyle: { color: colorMap[d.name] || d.color }
  }));

  const option = {
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : <b>{c} SKUs</b> ({d}%)' },
    legend: {
      orient: 'vertical',
      right: '2%',
      top: 'middle',
      icon: 'circle'
    },
    series: [
      {
        name: 'Coverage (Days of Stock)',
        type: 'pie',
        radius: ['38%', '68%'],
        center: ['38%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: false },
        labelLine: { show: false },
        data: chartData
      }
    ]
  };

  return (
    <div className="chart-panel">
      <div className="chart-title">Coverage (Days of Stock) Distribution</div>
      <div style={{ height: '300px' }}>
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};

export default CoverageChart;
