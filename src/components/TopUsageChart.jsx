import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Empty } from 'antd';

const TopUsageChart = ({ data }) => {
  const reversedData = data ? [...data].reverse() : [];
  
  const option = {
    tooltip: { 
      trigger: 'axis', 
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const item = params[0];
        const fullItem = reversedData[item.dataIndex];
        return `<b>${fullItem?.name || item.name}</b><br/>Usage Qty: <b>${parseFloat(item.value).toLocaleString('id-ID')}</b>`;
      }
    },
    grid: { 
      top: 15, 
      bottom: 25, 
      left: '2%', 
      right: '12%', 
      containLabel: true 
    },
    xAxis: { 
      type: 'value',
      axisLabel: {
        fontSize: 10,
        formatter: (val) => val >= 1000 ? `${(val/1000).toFixed(0)}k` : val
      }
    },
    yAxis: { 
      type: 'category', 
      data: reversedData.map(d => d.name.length > 15 ? d.name.substring(0, 15) + '...' : d.name),
      axisLabel: { fontSize: 11 }
    },
    series: [{
      name: 'Total Usage Qty',
      type: 'bar',
      data: reversedData.map(d => d.usage),
      label: {
        show: true,
        position: 'right',
        fontSize: 10,
        color: '#595959',
        formatter: (params) => parseFloat(params.value).toLocaleString('id-ID')
      },
      itemStyle: {
        color: '#fa8c16',
        borderRadius: [0, 4, 4, 0]
      }
    }]
  };

  const hasData = data && data.length > 0;

  return (
    <div style={{ height: '300px', width: '100%' }}>
      {hasData ? (
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      ) : (
        <Empty description="Tidak ada data pemakaian" style={{ marginTop: 60 }} />
      )}
    </div>
  );
};

export default TopUsageChart;
