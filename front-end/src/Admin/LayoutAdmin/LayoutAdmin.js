import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "primereact/chart";
import HeaderAdmin from "../Component/HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../Component/SidebarAdmin/SidebarAdmin";
import moment from 'moment';

const LayoutAdmin = () => {
  const [Account, setAccount] = useState([]);
  const [Product, setProduct] = useState([]);
  const [lsOrder, setLsOrder] = useState([]);

  useEffect(() => {
    axios.get(`https://localhost:7201/api/Users/list-user`).then((res) => setAccount(res.data));
    axios.get(`https://localhost:7201/api/Products`).then((res) => setProduct(res.data));
    axios.get(`https://localhost:7201/api/Orders`).then((res) => setLsOrder(res.data));
  }, []);

  const deliveredOrdersCount = lsOrder.filter((order) => order.deliveryStatusId === 4).length;

  // const totalRevenue = lsOrder.reduce((total, order) => {
  //   if (order.deliveryStatusId === 7) {
  //     return total + parseFloat(order.totalMoney);
  //   }
  //   return total;
  // }, 0);

  const convertToVND = (price) => {
    const priceInVND = price * 1000;
    return priceInVND.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  const deliveredOrders = lsOrder.filter((order) => order.deliveryStatusId ===4);

  const labels = deliveredOrders.map((order) => order.code || `Order ${order.id}`);

  const data = deliveredOrders.map((order) => order.totalMoney * 1000); 
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Doanh thu theo đơn hàng",
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75,192,192,0.4)",
        hoverBorderColor: "rgba(75,192,192,1)",
        data: data,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString(); 
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Revenue: ${tooltipItem.raw.toLocaleString()} VND`;
          }
        }
      }
    }
  };

  // Tính toán doanh thu theo ngày cho tháng hiện tại
  const currentMonth = moment().month();
  const dailyRevenue = lsOrder.filter(order => order.deliveryStatusId === 4&& moment(order.date).month() === currentMonth)
    .reduce((acc, order) => {
      const date = moment(order.date).format('YYYY-MM-DD');
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += parseFloat(order.totalMoney *1000);
      return acc;
    }, {});

  const dailyLabels = Object.keys(dailyRevenue).sort();
  const dailyData = dailyLabels.map(label => dailyRevenue[label]);

  // const dailyChartData = {
  //   labels: dailyLabels,
  //   datasets: [
  //     {
  //       label: "Doanh thu theo ngày",
  //       backgroundColor: "rgba(153,102,255,0.2)",
  //       borderColor: "rgba(153,102,255,1)",
  //       borderWidth: 1,
  //       hoverBackgroundColor: "rgba(153,102,255,0.4)",
  //       hoverBorderColor: "rgba(153,102,255,1)",
  //       data: dailyData,
  //     },
  //   ],
  // };

  // const monthlyRevenue = Array(12).fill(0); 
  // lsOrder.filter(order => order.deliveryStatusId === 4).forEach((order) => {
  //   const month = moment(order.date).month(); 
  //   monthlyRevenue[month] += parseFloat(order.totalMoney * 1000 );
  // });

  // const monthlyLabels = [
  //   "Tháng 1",
  //   "Tháng 2",
  //   "Tháng 3",
  //   "Tháng 4",
  //   "Tháng 5",
  //   "Tháng 6",
  //   "Tháng 7",
  //   "Tháng 8",
  //   "Tháng 9",
  //   "Tháng 10",
  //   "Tháng 11",
  //   "Tháng 12"
  // ];

  // const monthlyChartData = {
  //   labels: monthlyLabels,
  //   datasets: [
  //     {
  //       label: "Doanh thu theo tháng",
  //       backgroundColor: "rgba(255,159,64,0.2)",
  //       borderColor: "rgba(255,159,64,1)",
  //       borderWidth: 1,
  //       hoverBackgroundColor: "rgba(255,159,64,0.4)",
  //       hoverBorderColor: "rgba(255,159,64,1)",
  //       data: monthlyRevenue,
  //     },
  //   ],
  // };

  return (
    <>
      <SidebarAdmin />
      <div id="right-panel" className="right-panel">
        <HeaderAdmin />
        <div className="breadcrumbs">
          <div className="col-sm-4">
            <div className="page-header float-left">
              <div className="page-title">
                <h1>Dashboard</h1>
              </div>
            </div>
          </div>
          <div className="col-sm-8">
            <div className="page-header float-right">
              <div className="page-title">
                <ol className="breadcrumb text-right">
                  <li className="breadcrumb-item active">Dashboard</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="content mt-3">
          <div className="col-sm-12 mb-4">
            <div className="card-group">
              <div className="card col-lg-3 col-md-6 no-padding no-shadow">
                <div className="card-body bg-flat-color-2">
                  <div className="h1 text-muted text-right mb-4">
                    <i className="fa fa-user-plus text-light" />
                  </div>
                  <div className="h4 mb-0 text-light">
                    <span className="count">{Account.length}</span>
                  </div>
                  <small className="text-uppercase font-weight-bold text-light">Người dùng</small>
                  <div className="progress progress-xs mt-3 mb-0 bg-light" style={{ width: '40%', height: 5 }} />
                </div>
              </div>
              <div className="card col-lg-3 col-md-6 no-padding no-shadow">
                <div className="card-body bg-flat-color-3">
                  <div className="h1 text-right mb-4">
                    <i className="fa fa-laptop text-light" />
                  </div>
                  <div className="h4 mb-0 text-light">
                    <span className="count">{Product.length}</span>
                  </div>
                  <small className="text-light text-uppercase font-weight-bold">Sản phẩm </small>
                  <div className="progress progress-xs mt-3 mb-0 bg-light" style={{ width: '40%', height: 5 }} />
                </div>
              </div>
              <div className="card col-lg-3 col-md-6 no-padding no-shadow">
                <div className="card-body bg-flat-color-4">
                  <div className="h1 text-right text-light mb-4">
                    <i className="fa fa-truck text-light" /> 
                  </div>
                  <div className="h4 mb-0 text-light">
                    <span className="count">{deliveredOrdersCount}</span>
                  </div>
                  <small className="text-light text-uppercase font-weight-bold">Đơn hàng đã được giao</small>
                  <div className="progress progress-xs mt-3 mb-0 bg-light" style={{ width: '40%', height: 5 }} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="card">
              <div className="card-body">
                <h4 className="mb-3">Doanh thu theo đơn hàng</h4>
                <Chart type="bar" data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
          {/* <div className="col-xl-6">
            <div className="card">
              <div className="card-body">
                <h4 className="mb-3">Doanh thu theo ngày</h4>
                <Chart type="line" data={dailyChartData} options={chartOptions} />
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="card">
              <div className="card-body">
                <h4 className="mb3">Doanh thu theo tháng</h4>
                <Chart type="bar" data={monthlyChartData} options={chartOptions} />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default LayoutAdmin;
