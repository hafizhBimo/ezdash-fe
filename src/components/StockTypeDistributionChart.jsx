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
    legend: { show: false },
    color: ['#1890ff', '#13c2c2', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#eb2f96', '#2f54eb', '#fa8c16', '#fa541c', '#a0d911'],
    series: [{
      name: 'Stock Type',
      type: 'pie',
      radius: ['38%', '65%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 1 },
      label: { show: true, position: 'outside', formatter: '{b}: {d}%', fontSize: 11 },
      data: chartData
    }]
  };

  return (
    <div className="chart-panel">
      <div className="chart-title">Distribusi Stock Type (Berdasarkan Qty)</div>
      <div style={{ height: '300px' }}>
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};

export default StockTypeDistributionChart;
