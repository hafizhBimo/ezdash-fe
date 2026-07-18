import React from 'react';
import ReactECharts from 'echarts-for-react';

const CoverageChart = ({ data }) => {
  const option = {
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)' },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'middle',
      icon: 'circle'
    },
    color: ['#52c41a', '#faad14', '#f5222d'], // Aman, Warning, Critical
    series: [
      {
        name: 'Days of Stock Coverage',
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
          name: d.name,
          value: d.value
        }))
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
