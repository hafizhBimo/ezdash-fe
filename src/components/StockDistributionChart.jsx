import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Empty } from 'antd';

const StockDistributionChart = ({ data }) => {
  const option = {
    tooltip: { trigger: 'item', formatter: '{b}: <b>{c} SKU</b> ({d}%)' },
    legend: { top: 0, left: 'center', icon: 'circle', textStyle: { fontSize: 11 } },
    color: ['#1890ff', '#52c41a'],
    series: [{
      name: 'Stock',
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '55%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      data: data
    }]
  };

  const hasData = data && (data[0]?.value > 0 || data[1]?.value > 0);

  return (
    <div style={{ height: '300px', width: '100%' }}>
      {hasData ? (
        <ReactECharts option={option} notMerge={true} lazyUpdate={true} style={{ height: '100%', width: '100%' }} />
      ) : (
        <Empty description="No Stock Data" style={{ marginTop: 60 }} />
      )}
    </div>
  );
};

export default StockDistributionChart;
