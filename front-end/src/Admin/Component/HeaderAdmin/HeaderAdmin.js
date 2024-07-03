import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const HeaderAdmin = () => {
  const [lsOrder, setlsOrder] = useState([]); // Khởi tạo token với giá trị null

  //view tên admin
  const [token, setToken] = useState(null); // Khởi tạo token với giá trị null
  const [tokenUpdated, setTokenUpdated] = useState(false); // Khởi tạo state để theo dõi việc cập nhật token
  const [Name, setName] = useState(); 
  useEffect(() => {
    axios.get(`https://localhost:7201/api/Orders`).then((res) => setlsOrder(res.data));
      const tokenFromStorage = localStorage.getItem('token');
      setToken(tokenFromStorage); // Cập nhật token từ localStorage
      setTokenUpdated(true); // Đã cập nhật token
      
  }, []); // useEffect chỉ chạy một lần sau khi component được mount
  
  useEffect(() => {
      if (tokenUpdated) { 
          //console.log(token);  
          setTokenUpdated(false); // Đặt lại tokenUpdated để tránh việc gọi console.log trong các render sau
          if(token !=null)
          {
              const decode = jwtDecode(token);
              setName(decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]); 
          }
      }
  }, [token, tokenUpdated]); //
  
  const handleClick = () => {
    localStorage.removeItem('token');
    window.location.href = 'http://localhost:3000/login';
}
//console.log(lsOrder);
  return (
 
      <header id="header" className="header">
        <div className="header-menu">
          <div className="col-sm-7">  
            <div className="header-left">
              <div className="form-inline">
                <form className="search-form">
                  <input className="form-control mr-sm-2" type="text" placeholder="Search ..." aria-label="Search" />
                  <button className="search-close" type="submit"><i className="fa fa-close" /></button>
                </form>
              </div>
              <div className="dropdown for-notification">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="notification" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i className="fa fa-bell" />
                  <span className="count bg-danger">{lsOrder.filter(order => order.deliveryStatusId === 1).length}</span> 
                </button>
                <div className="dropdown-menu" aria-labelledby="notification">
                  <p className="red">Bạn có <b className="text-danger">{lsOrder.filter(order => order.deliveryStatusId === 1).length} </b>đơn hàng mới</p>
                  <a className="dropdown-item media bg-flat-color-3" href="#">
                    <i className="fa fa-check" />
                    <p>Server #1 overloaded.</p>
                  </a>
                  
                </div>  
              </div>
              <div className="dropdown for-message">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="message" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i className="ti-email" />
                  <span className="count bg-primary">9</span>
                </button>
                <div className="dropdown-menu" aria-labelledby="message">
                  <p className="red">You have 4 Mails</p>
                  <a className="dropdown-item media bg-flat-color-1" href="#">
                    <span className="photo media-left"><img alt="avatar" src=" /images/avatar/1.jpg" /></span>
                    <span className="message media-body">
                      <span className="name float-left">Jonathan Smith</span>
                      <span className="time float-right">Just now</span>
                      <p>Hello, this is an example msg</p>
                    </span>
                  </a>
                  <a className="dropdown-item media bg-flat-color-4" href="#">
                    <span className="photo media-left"><img alt="avatar" src=" /images/avatar/2.jpg" /></span>
                    <span className="message media-body">
                      <span className="name float-left">Jack Sanders</span>
                      <span className="time float-right">5 minutes ago</span>
                      <p>Lorem ipsum dolor sit amet, consectetur</p>
                    </span>
                  </a>
                  <a className="dropdown-item media bg-flat-color-5" href="#">
                    <span className="photo media-left"><img alt="avatar" src="images/avatar/3.jpg" /></span>
                    <span className="message media-body">
                      <span className="name float-left">Cheryl Wheeler</span>
                      <span className="time float-right">10 minutes ago</span>
                      <p>Hello, this is an example msg</p>
                    </span>
                  </a>
                  <a className="dropdown-item media bg-flat-color-3" href="#">
                    <span className="photo media-left"><img alt="avatar" src="images/avatar/4.jpg" /></span>
                    <span className="message media-body">
                      <span className="name float-left">Rachel Santos</span>
                      <span className="time float-right">15 minutes ago</span>
                      <p>Lorem ipsum dolor sit amet, consectetur</p>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-5">
           
            <div className="user-area dropdown float-right d-flex">
             <p style={{marginTop:'6px'}}>Xin chào <b> {Name}</b></p>
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img className="user-avatar rounded-circle" src="/images/admin.jpg" alt="User Avatar" />
              </a>
              <div className="user-menu dropdown-menu">
                <a className="nav-link" href="#"><i className="fa fa-user" /> My Profile</a>
                <a className="nav-link" href="#"><i className="fa fa-user" /> Notifications <span className="count">13</span></a>
                <a className="nav-link" href="#"><i className="fa fa-cog" /> Settings</a>
                <a className="nav-link" onClick={handleClick} href="#"><i className="fa fa-power-off" /> Logout</a>
              </div>
            </div>
            <div className="language-select dropdown" id="language-select">
              <a className="dropdown-toggle" href="#" data-toggle="dropdown" id="language" aria-haspopup="true" aria-expanded="true">
                <i className="flag-icon flag-icon-us" />
              </a>
              <div className="dropdown-menu" aria-labelledby="language">
                <div className="dropdown-item">
                  <span className="flag-icon flag-icon-fr" />
                </div>
                <div className="dropdown-item">
                  <i className="flag-icon flag-icon-es" />
                </div>
                <div className="dropdown-item">
                  <i className="flag-icon flag-icon-us" />
                </div>
                <div className="dropdown-item">
                  <i className="flag-icon flag-icon-it" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
 
  );
}

export default HeaderAdmin;
