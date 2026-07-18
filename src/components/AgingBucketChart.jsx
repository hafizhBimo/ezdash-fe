import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Empty } from 'antd';

const AgingBucketChart = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return <Empty description="Belum ada data aging" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  const { under30, range31to90, range91to180, over180 } = data;

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const val = params[0].value;
        return `${params[0].name}<br/>Rp ${val.toLocaleString('id-ID')}`;
      }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['< 30 Hari', '31 - 90 Hari', '91 - 180 Hari', '> 180 Hari'],
      axisTick: { alignWithLabel: true }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value) => {
          if (value >= 1e9) return (value / 1e9).toFixed(1) + 'M';
          if (value >= 1e6) return (value / 1e6).toFixed(1) + 'Jt';
          return value;
        }
      }
    },
    series: [
      {
        name: 'Nilai Stok',
        type: 'bar',
        barWidth: '40%',
        data: [
          { value: under30, itemStyle: { color: '#1890ff' } },
          { value: range31to90, itemStyle: { color: '#36cfc9' } },
          { value: range91to180, itemStyle: { color: '#faad14' } },
          { value: over180, itemStyle: { color: '#f5222d' } }
        ],
        label: {
          show: true,
          position: 'top',
          formatter: (params) => {
            if (params.value === 0) return '';
            return (params.value / 1e6).toFixed(1) + ' Jt'; // Show in millions for brevity above bars
          },
          fontSize: 10
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '250px', width: '100%' }} />;
};

export default AgingBucketChart;
