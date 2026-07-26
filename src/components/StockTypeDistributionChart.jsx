import React from 'react';
import ReactECharts from 'echarts-for-react';
import { getStockTypeLabel } from '../utils/stockTypeMaster';

const StockTypeDistributionChart = ({ data }) => {
  const chartData = (data || []).map(item => ({
    ...item,
    name: getStockTypeLabel(item.name || item.code),
    value: parseFloat(item.value || item.qty || 0)
  }));

  const option = {
    tooltip: { 
      trigger: 'item', 
      formatter: (params) => {
        const val = parseFloat(params.value || 0).toLocaleString('id-ID');
        return `<b>${params.name}</b><br/>Total SOH Qty: <b>${val}</b> (${params.percent}%)`;
      } 
    },
    legend: { 
      show: true, 
      type: 'scroll',
      orient: 'vertical', 
      right: 0, 
      top: 'middle', 
      textStyle: { fontSize: 11 },
      formatter: (name) => name.length > 20 ? name.substring(0, 20) + '...' : name
    },
    color: ['#1890ff', '#13c2c2', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#eb2f96', '#2f54eb', '#fa8c16', '#fa541c', '#a0d911', '#1890ff', '#722ed1'],
    series: [{
      name: 'Stock Type',
      type: 'pie',
      radius: ['38%', '68%'],
      center: ['30%', '50%'],
      avoidLabelOverlap: true,
      minAngle: 3,
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 1 },
      label: { show: false },
      labelLine: { show: false },
      data: chartData
    }]
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default StockTypeDistributionChart;
