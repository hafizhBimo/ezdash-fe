import React from 'react';
import ReactECharts from 'echarts-for-react';

const CoverageChart = ({ data }) => {
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
      right: '0%',
      top: 'middle',
      icon: 'circle',
      textStyle: { fontSize: 11 }
    },
    series: [
      {
        name: 'Coverage (Days of Stock)',
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
        data: chartData
      }
    ]
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default CoverageChart;
