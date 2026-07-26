import React from 'react';
import ReactECharts from 'echarts-for-react';

const UsageTrendChart = ({ trends }) => {
  const usageData = trends?.usage || [];
  const dates = usageData.map(t => {
    if (!t.date) return '-';
    const d = new Date(t.date);
    return isNaN(d.getTime()) ? t.date : d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
  });
  const values = usageData.map(t => t.value || 0);
  const qtys = usageData.map(t => t.qty || 0);

  const option = {
    tooltip: { 
      trigger: 'axis',
      formatter: (params) => {
        let res = `<b>${params[0]?.name || ''}</b><br/>`;
        params.forEach(p => {
          const val = p.seriesName.includes('Nilai') 
            ? `Rp ${parseFloat(p.value).toLocaleString('id-ID')}`
            : `${parseFloat(p.value).toLocaleString('id-ID')} Qty`;
          res += `${p.marker} ${p.seriesName}: <b>${val}</b><br/>`;
        });
        return res;
      }
    },
    legend: { data: ['Nilai Pemakaian (Rp)', 'Qty Pemakaian'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: dates },
    yAxis: [
      {
        type: 'value',
        name: 'Nilai (Rp)',
        axisLabel: {
          formatter: (val) => val >= 1e6 ? `${(val/1e6).toFixed(0)}M` : val
        }
      },
      {
        type: 'value',
        name: 'Qty',
        position: 'right'
      }
    ],
    series: [
      {
        name: 'Nilai Pemakaian (Rp)',
        type: 'line',
        data: values,
        smooth: true,
        itemStyle: { color: '#722ed1' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(114,46,209,0.3)' }, { offset: 1, color: 'rgba(114,46,209,0)' }]
          }
        }
      },
      {
        name: 'Qty Pemakaian',
        type: 'line',
        yAxisIndex: 1,
        data: qtys,
        smooth: true,
        itemStyle: { color: '#13c2c2' }
      }
    ]
  };

  return (
    <div className="chart-panel">
      <div className="chart-title">Tren Pemakaian 6 Bulan Terakhir</div>
      <div style={{ height: '350px' }}>
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};

export default UsageTrendChart;
