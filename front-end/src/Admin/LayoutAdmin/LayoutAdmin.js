import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "primereact/chart";
import HeaderAdmin from "../Component/HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../Component/SidebarAdmin/SidebarAdmin";
import moment from 'moment';
import { Calendar } from "primereact/calendar"; 

const LayoutAdmin = () => {
  const [Account, setAccount] = useState([]);
  const [Product, setProduct] = useState([]);
  const [lsOrder, setLsOrder] = useState([]);
  const [lsLog, setlsLog] = useState([]);  
  const [lsOrderDate, setlsOrderDate] = useState([]); //lưu trữ sever trả về danh sách đơn hàng theo ngày
  const [selectedDate, setselectedDate] = useState(new Date());
  const [totalNow, settotalNow] = useState(null);

  useEffect(() => {
    axios.get(`https://localhost:7201/api/Users/list-user`).then((res) => { 
      setAccount(res.data)
    }).catch(ex=>{console.log(ex);});

    axios.get(`https://localhost:7201/api/Products`).then((res) => setProduct(res.data)).catch(ex=>{console.log(ex);});

    axios.get(`https://localhost:7201/api/Orders`).then((res) => setLsOrder(res.data)).catch(ex=>{console.log(ex);});

    axios.get(`https://localhost:7201/api/Logs`).then((res) => setlsLog(res.data)).catch(ex=>{console.log(ex);});

    axios.get(`https://localhost:7201/api/Orders/getTotalOrderDayNow`).then((res) => settotalNow(res.data)).catch(ex=>{console.log(ex);}); 
    
    // Lấy danh sách đơn hàng theo ngày hiện tại khi component mount
    const today = moment(new Date()).format('YYYY-MM-DD');
    axios.get(`https://localhost:7201/api/Orders/getDailyRevenue`, { params: { date: today } }).then(res => {
      setlsOrderDate(res.data);
    }).catch(ex => { console.log(ex); });

  }, []); 
 
  //xử lý người dùng chọn ngày
  const handleDateChange = (e) => { 
    setselectedDate(e.value);
    let selectedDateConvert = moment(e.value).format('YYYY-MM-DD');
    axios.get(`https://localhost:7201/api/Orders/getDailyRevenue`, { params: { date: selectedDateConvert } }).then(res => {
      setlsOrderDate(res.data);
    }).catch(ex => { console.log(ex); });
  };

  // Chuẩn bị dữ liệu cho biểu đồ
  const prepareChartData = () => {
    const labels = lsOrderDate.map(item => item.orders.map(order => order.orderCode).join(', ')); // Lấy danh sách orderCode
    const data = lsOrderDate.map(item => item.orders.reduce((total, order) => total + order.totalMoney, 0)); // Tính tổng doanh thu
    return {
      labels: labels,
      datasets: [
        {
          label: "Doanh thu hàng ngày",
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(75,192,192,0.4)",
          hoverBorderColor: "rgba(75,192,192,1)",
          data: data,
        },
      ],
    };
  };

  // Cấu hình các tùy chọn cho biểu đồ
  const chartOptionsDate = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString(); // Format lại số tiền hiển thị
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Doanh thu: ${tooltipItem.raw.toLocaleString()} VND`;
          }
        }
      }
    }
  };
 
  // Convert price to VND
  function convertToVND(price) {
    const priceInVND = price * 1000;
    return priceInVND.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

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
                    <span className="count">{lsOrder.filter(o => o.deliveryStatusId == 4).length}</span>
                  </div>
                  <small className="text-light text-uppercase font-weight-bold">Đơn hàng đã được giao</small>
                  <div className="progress progress-xs mt-3 mb-0 bg-light" style={{ width: '40%', height: 5 }} />
                </div>
              </div>
              <div className="card col-lg-3 col-md-6 no-padding no-shadow">
                <div className="card-body bg-flat-color-5">
                  <div className="h1 text-right text-light mb-4">
                    <i className="fa fa-money text-light" /> 
                  </div>
                  <div className="h4 mb-0 text-light">
                    <span className="count"> {convertToVND(totalNow)}</span>
                  </div>
                  <small className="text-light text-uppercase font-weight-bold">Doanh thu ngày hôm nay</small>
                  <div className="progress progress-xs mt-3 mb-0 bg-light" style={{ width: '40%', height: 5 }} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-8"> 
            <div className="card">
              <div className="card-body">
                <h4 className="mb-3">Doanh thu hàng ngày</h4>
                <Calendar value={selectedDate} onChange={handleDateChange} showIcon dateFormat="dd-mm-yy" />
                <Chart type="bar" data={prepareChartData()} options={chartOptionsDate} />
              </div>
            </div> 
          </div>
          <div className="col-4">
            <div className="card">
              <h4 className="text-center p-4">Bảng ghi lịch sử</h4> 
              <div className="card-body" style={{ maxHeight: '470px', overflowY: 'auto' }}>
                {lsLog.length > 0 ? (
                  <div>
                    {
                      lsLog.map((item, index) => {
                        return (
                          <div key={index}> 
                            <p>{item.nameAction} {item.descriptionAction} vào {item.dateAction}</p>
                          </div>
                        )
                      })
                    }
                  </div>
                ) : (
                  <p>Không có log nào để hiển thị</p>
                )}
              </div> 
            </div>
            <hr/> 
          </div> 
         
        </div>
      </div>
    </>
  );
};

export default LayoutAdmin;
