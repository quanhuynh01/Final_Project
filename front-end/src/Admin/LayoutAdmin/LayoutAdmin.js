import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import HeaderAdmin from "../Component/HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../Component/SidebarAdmin/SidebarAdmin";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import moment from 'moment';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LayoutAdmin = () => {
  const [Account, setAccount] = useState([]);
  const [Product, setProduct] = useState([]);
  const [lsOrder, setLsOrder] = useState([]);

  useEffect(() => {
    axios.get(`https://localhost:7201/api/Users/list-user`).then((res) => setAccount(res.data));
    axios.get(`https://localhost:7201/api/Products`).then((res) => setProduct(res.data));
    axios.get(`https://localhost:7201/api/Orders`).then((res) => setLsOrder(res.data));
  }, []);

  // Tính tổng số đơn hàng đã được giao
  const deliveredOrdersCount = lsOrder.filter((order) => order.deliveryStatusId === 5).length;

  // Tính tổng doanh thu từ các đơn hàng
  const totalRevenue = lsOrder.reduce((total, order) => {
    return total + parseFloat(order.totalMoney); // Đảm bảo chuyển đổi TotalMoney sang số nếu không phải số
  }, 0);

  //   // Đếm tổng số đơn hàng
  //   const totalOrders = lsOrder.length;

  // Đếm số đơn hàng theo từng trạng thái khác nhau (ví dụ: đang xử lý, đã hủy, ...)
  const orderStatusCounts = lsOrder.reduce((statusCounts, order) => {
    const statusId = order.deliveryStatusId;
    if (statusCounts[statusId]) {
      statusCounts[statusId]++;
    } else {
      statusCounts[statusId] = 1;
    }
    return statusCounts;
  }, {});

  // Chuyển đổi số thành tiền VND
  const convertToVND = (price) => {
    const priceInVND = price * 1000;
    return priceInVND.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  // Lọc các đơn hàng đã giao
  const deliveredOrders = lsOrder.filter((order) => order.deliveryStatusId === 5);

  // Lấy nhãn (mã đơn hàng) và dữ liệu (totalMoney) cho biểu đồ
  const labels = deliveredOrders.map((order) => order.code || `Order ${order.id}`);
  const data = deliveredOrders.map((order) => order.totalMoney);

  // Dữ liệu biểu đồ doanh thu từng đơn hàng
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

  // Tùy chọn biểu đồ
  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString(); // Định dạng các giá trị trục y
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

  // Tính doanh thu hàng ngày
  const dailyRevenue = lsOrder.reduce((acc, order) => {
    const date = moment(order.date).format('YYYY-MM-DD');
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += parseFloat(order.totalMoney);
    return acc;
  }, {});

  const dailyLabels = Object.keys(dailyRevenue);
  const dailyData = Object.values(dailyRevenue);

  const dailyChartData = {
    labels: dailyLabels,
    datasets: [
      {
        label: "Doanh thu theo ngày",
        backgroundColor: "rgba(153,102,255,0.2)",
        borderColor: "rgba(153,102,255,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(153,102,255,0.4)",
        hoverBorderColor: "rgba(153,102,255,1)",
        data: dailyData,
      },
    ],
  };

  // Tính doanh thu hàng tháng
  const monthlyRevenue = lsOrder.reduce((acc, order) => {
    const month = moment(order.date).format('YYYY-MM');
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += parseFloat(order.totalMoney);
    return acc;
  }, {});

  const monthlyLabels = Object.keys(monthlyRevenue);
  const monthlyData = Object.values(monthlyRevenue);

  const monthlyChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Doanh thu theo tháng",
        backgroundColor: "rgba(255,159,64,0.2)",
        borderColor: "rgba(255,159,64,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,159,64,0.4)",
        hoverBorderColor: "rgba(255,159,64,1)",
        data: monthlyData,
      },
    ],
  };

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
          <div className="col-sm-12">
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <span className="badge badge-pill badge-success">Success</span> Đăng nhập thành công vào hệ thống quản trị
              <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6 col-lg-3">
              <div className="card text-light " style={{ backgroundColor: "#01dbfd" }}>
                <div className="card-body pb-0">
                  <h4 className="mb-0">
                    <span className="count">{Account.length}</span>
                  </h4>
                  <p className="text-light">Tài khoản người dùng</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card text-white  " style={{ backgroundColor: "rgb(255 72 72)" }}  >
                <div className="card-body pb-0">
                  <h4 className="mb-0">
                    <span className="count">{Product.length}</span>
                  </h4>
                  <p className="text-light">Sản phẩm</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card text-white bg-success">
                <div className="card-body pb-0">
                  <h4 className="mb-0">
                    <span className="count">{deliveredOrdersCount}</span>
                  </h4>
                  <p className="text-light">Đơn hàng đã được giao</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card text-white  bg-warning">
                <div className="card-body pb-0">
                  <h4 className="mb-0">
                    <span className="count">{convertToVND(totalRevenue)}</span>
                  </h4>
                  <p className="text-light">Tổng doanh thu</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 mb-4">
            <div className="card-group"> 
              <div className="card col-lg-3 col-md-6 no-padding no-shadow">
                <div className="card-body bg-flat-color-2">
                  <div className="h1 text-muted text-right mb-4">
                    <i className="fa fa-user-plus text-light" />
                  </div>
                  <div className="h4 mb-0 text-light">
                    <span className="count">385</span>
                  </div>
                  <small className="text-uppercase font-weight-bold text-light">New Clients</small>
                  <div className="progress progress-xs mt-3 mb-0 bg-light" style={{ width: '40%', height: 5 }} />
                </div>
              </div>
              <div className="card col-lg-3 col-md-6 no-padding no-shadow">
                <div className="card-body bg-flat-color-3">
                  <div className="h1 text-right mb-4">
                    <i className="fa fa-cart-plus text-light" />
                  </div>
                  <div className="h4 mb-0 text-light">
                    <span className="count">1238</span>
                  </div>
                  <small className="text-light text-uppercase font-weight-bold">Products sold</small>
                  <div className="progress progress-xs mt-3 mb-0 bg-light" style={{ width: '40%', height: 5 }} />
                </div>
              </div>
              <div className="card col-lg-3 col-md-6 no-padding no-shadow">
                <div className="card-body bg-flat-color-5">
                  <div className="h1 text-right text-light mb-4">
                    <i className="fa fa-pie-chart" />
                  </div>
                  <div className="h4 mb-0 text-light">
                    <span className="count">28</span>%
                  </div>
                  <small className="text-uppercase font-weight-bold text-light">Returning Visitors</small>
                  <div className="progress progress-xs mt-3 mb-0 bg-light" style={{ width: '40%', height: 5 }} />
                </div>
              </div>
              <div className="card col-lg-3 col-md-6 no-padding no-shadow">
                <div className="card-body bg-flat-color-4">
                  <div className="h1 text-light text-right mb-4">
                    <i className="fa fa-clock-o" />
                  </div>
                  <div className="h4 mb-0 text-light">5:34:11</div>
                  <small className="text-light text-uppercase font-weight-bold">Avg. Time</small>
                  <div className="progress progress-xs mt-3 mb-0 bg-light" style={{ width: '40%', height: 5 }} />
                </div>
              </div>
              <div className="card col-lg-3 col-md-6 no-padding no-shadow">
                <div className="card-body bg-flat-color-1">
                  <div className="h1 text-light text-right mb-4">
                    <i className="fa fa-comments-o" />
                  </div>
                  <div className="h4 mb-0 text-light">
                    <span className="count">972</span>
                  </div>
                  <small className="text-light text-uppercase font-weight-bold">COMMENTS</small>
                  <div className="progress progress-xs mt-3 mb-0 bg-light" style={{ width: '40%', height: 5 }} />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="content mt-3 col-6">
              <h4>Biểu đồ doanh thu theo đơn hàng</h4>
              <div className="chart-container" style={{ position: "relative", height: "400px", width: "100%" }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
            <div className="content mt-3 col-6">
              <h4>Biểu đồ doanh thu hàng ngày</h4>
              <div className="chart-container" style={{ position: "relative", height: "400px", width: "100%" }}>
                <Bar data={dailyChartData} options={chartOptions} />
              </div>
            </div>
            <div className="content mt-3 col-6">
              <h4>Biểu đồ doanh thu hàng tháng</h4>
              <div className="chart-container" style={{ position: "relative", height: "400px", width: "100%" }}>
                <Bar data={monthlyChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>{" "}
        {/* .content */}
      </div>
    </>
  );
};

export default LayoutAdmin;
