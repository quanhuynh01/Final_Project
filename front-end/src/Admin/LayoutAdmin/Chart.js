import React from 'react';
import { Bar } from 'react-chartjs-2';

const RevenueChart = ({ lsOrder }) => {
  // Filter orders that have deliveryStatusId === 5 (Delivered orders)
  const deliveredOrders = lsOrder.filter(order => order.deliveryStatusId === 5);

  // Extract labels (order codes) and data (totalMoney) for the chart
  const labels = deliveredOrders.map(order => order.code || `Order ${order.id}`);
  const data = deliveredOrders.map(order => order.totalMoney);

  // Chart data object
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Revenue',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.4)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: data,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            callback: function(value) {
              return value.toLocaleString(); // Format y-axis ticks to locale string
            },
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem) {
          return `Revenue: ${tooltipItem.yLabel.toLocaleString()} VND`;
        },
      },
    },
  };

  return (
    <div className="chart-container" style={{ position: 'relative', height: '400px', width: '100%' }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default RevenueChart;
