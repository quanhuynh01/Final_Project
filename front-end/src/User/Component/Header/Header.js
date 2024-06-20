import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import $ from 'jquery'
import './Header.css'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Cart from '../Cart/Cart';
import Watch from '../Watch/Watch';
import { Modal } from '../Modal/Modal'

const Header = () => {
  const [token, setToken] = useState(null); // Khởi tạo token với giá trị null
  const [tokenUpdated, setTokenUpdated] = useState(false); // Khởi tạo state để theo dõi việc cập nhật token
  const [Name, setName] = useState();
  const [Cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => { 
    const tokenFromStorage = localStorage.getItem('token');
    setToken(tokenFromStorage); // Cập nhật token từ localStorage
    setTokenUpdated(true); // Đã cập nhật token
    
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(cartItems);


  }, []); // useEffect chỉ chạy một lần sau khi component được render

  useEffect(() => {
    if (tokenUpdated) {
      //console.log(token);  
      setTokenUpdated(false); // Đặt lại tokenUpdated để tránh việc gọi console.log trong các render sau
      if (token != null) {
        const decode = jwtDecode(token);
        setName(decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
      }
    }
    $('.click-show').on('click', function () {
      $('.menu-logout').toggleClass('d-none');
    });
  }, [token, tokenUpdated]); //

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };
  const countItemsInCart = () => {
    return Cart.length;
  };
  return (
    <div className="container-fluid">
      <div className="row bg-warning py-1 px-xl-5">
        <div className="col-lg-6 d-none d-lg-block">
          <div className="d-inline-flex align-items-center h-100">
            <a className="text-body mr-3" href="#">About</a>
            <a className="text-body mr-3" href="#">Contact</a>
            <a className="text-body mr-3" href="#">Help</a>
            <a className="text-body mr-3" href="#">FAQs</a>
          </div>
        </div>
        <div className="col-lg-6 text-center text-lg-right">
          <div className="d-inline-flex align-items-center">
            <div className="btn-group">
              {Name != null ? (
                <div className="dropdown-container">
                  <span className='click-show btn'>Xin chào <b>{Name}</b></span>
                  <div className="menu-logout d-none">
                    <ul>
                      <li> <Link className='btn btn-primary' to={'/accounts'}><i className='fa fa-user mr-2'></i> Tài khoản</Link> </li>
                      <li><button onClick={handleLogout} className='btn btn-primary' to={'/accounts'}><i className='fa fa-power-off'></i> Đăng xuất</button> </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <>
                  <Link title='Đăng nhập' to={'/login'} className="btn btn-sm btn-light mr-2">Đăng nhập</Link>
                  <button onClick={toggleOpen}>Open Modal</button>
                  <Modal isOpen = {isOpen} toggleOpen = {toggleOpen}>
                  <h2>Form Đăng Ký</h2>
                    <form>
                      <div className="form-group">
                        <label htmlFor="username">Tên đăng nhập:</label>
                        <input type="text" id="username" className="form-control" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" className="form-control" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="password">Mật khẩu:</label>
                        <input type="password" id="password" className="form-control" />
                      </div>
                      <button type="submit" className="btn btn-primary">Đăng ký</button>
                    </form> 
                  </Modal>
                </>
              )}
            </div>
          </div>
          <div className="d-inline-flex align-items-center d-block d-lg-none">
            <a href="#" className="btn px-0 ml-2">
              <i className="fas fa-heart text-dark" />
              <span className="badge text-dark border border-dark rounded-circle" style={{ paddingBottom: 2 }}>0</span>
            </a>
            <a href="#" className="btn px-0 ml-2">
              <i className="fas fa-shopping-cart text-dark" />
              <span className="badge text-dark border border-dark rounded-circle" style={{ paddingBottom: 2 }}>0</span>
            </a>
          </div>
        </div>
      </div>
      <div className="row align-items-center bg-light py-3 px-xl-5 d-none d-lg-flex">
        <div className="col-lg-4">
          <a href="#" className="text-decoration-none">
            <span className="h1 text-uppercase text-warning bg-dark px-2">ĐQ</span>
            <span className="h1 text-uppercase text-dark bg-warning px-2 ml-n1">Store</span>
          </a>
        </div>
        <div className="col-lg-4 col-6 text-left">
          <form className='d-flex' action="/">
            <select className='form-control col-3'>
              <option value={1}>Tất cả</option>
              <option value={2}>Laptop</option>
              <option value={3}>PC</option>
            </select>
            <div className="input-group w-100 col-9">
              <input type="text" className="form-control" placeholder="Search for products" />
              <div className="input-group-append">
                <span className="input-group-text bg-transparent text-warning">
                  <i className="fa fa-search" />
                </span>
              </div>
            </div>
          </form>
        </div>
        <div className="col-lg-4 col-6 text-right d-flex align-items-center justify-content-end">
          <div className="d-flex align-items-center">
            <Link to="/cart" className="btn px-0 ml-2">
              <i className="fa fa-shopping-cart"></i>
              <span className="badge text-danger">{countItemsInCart()}</span>
            </Link>
            <Watch />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;