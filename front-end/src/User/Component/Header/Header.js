import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import $ from 'jquery'
import './Header.css' 
import axios from 'axios';


const Header = ({ soluong }) => {

  const [token, setToken] = useState(null); // Khởi tạo token với giá trị null
  const [tokenUpdated, setTokenUpdated] = useState(false); // Khởi tạo state để theo dõi việc cập nhật token
  const [Name, setName] = useState();
  const [searchResult, setsearchResult] = useState([]);
  
  const [Quantity, setQuantity] = useState(null);
  const [Cart, setCart] = useState([]);
  
  useEffect(() => { 
    const tokenFromStorage = localStorage.getItem('token');
    setToken(tokenFromStorage); // Cập nhật token từ localStorage
    setTokenUpdated(true); // Đã cập nhật token 
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(cartItems); 
         ///tìm kiếm sản phẩm
    $('.text-search').on('input',function(){
      let text = $(this).val();
      if (text.length >0) {
        axios.get(`https://localhost:7201/Search/${text}`).then(res =>
          {
          if (res.data !=null) {
              $('.ls-Product').removeClass("d-none");
              $('.ls-Product').addClass("d-block");
          }
            setsearchResult(res.data) 
          } );
      }
      
         
    }); 
  }, []); 

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
 // console.log(searchResult);
 
  return (<>
    {/* <div className="container-fluid  ">
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
            <div className="btn-group" >
              {Name != null ? (
                <div className="dropdown-container">
                  <span className='click-show btn '>Xin chào <b>{Name}</b></span>

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
                  <button type="button" className="btn btn-sm btn-light">Đăng ký</button>
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
        <div className="col-lg-4 col-6 text-left " >
          <form className='d-flex' action="/">
            <select className='form-control col-3'>
              <option value={1}>Tất cả</option>
              <option value={2}>Laptop</option>
              <option value={3}>PC</option>
            </select>
            <div className="input-group w-100 col-9">
              <input type="text" className="form-control text-search" placeholder="Search for products" />
              <div className="input-group-append">
                <span className="input-group-text bg-transparent text-warning">
                  <i className="fa fa-search" />
                </span>
              </div>
            </div>
          </form>
        </div>
        <div className="col-lg-4 col-6 text-right" >
          <Link to={`http://localhost:3000/cart`}>
          <h5 className="m-0" style={{position:"relative",color:"black"}}> <i className='fa fa-shopping-cart'></i></h5>
          <b style={{position:"absolute" ,right:"35px",bottom:"0"}} className='text-danger'><b>{soluong}</b></b>
          </Link> 
        </div>
      </div>
    </div>  */}

{/* Topbar Start */}
<div className="container-fluid">
  <div className="row bg-warning py-1 px-xl-5">
    <div className="col-lg-6 d-none d-lg-block">
      <div className="d-inline-flex align-items-center h-100">
        <a className="text-body mr-3" href=''>About</a>
        <a className="text-body mr-3" href=''>Contact</a>
        <a className="text-body mr-3" href=''>Help</a>
        <a className="text-body mr-3" href=''>FAQs</a>
      </div>
    </div>
    <div className="col-lg-6 text-center text-lg-right">
      <div className="d-inline-flex align-items-center">
        <div className="btn-group"> 
            {Name != null ? (
                <div className="dropdown-container">
                  <span className='click-show btn '>Xin chào <b>{Name}</b></span>
                  <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-toggle="dropdown"><i className='fa fa-cog'></i></button>
                  <div className="dropdown-menu dropdown-menu-right  " style={{ marginTop: "35px"  }}>
                    <button className="dropdown-item " type="button"> <Link to={'/tai-khoan'} className='text-dark'><i className='fa fa-user mr-2'></i> Tài khoản</Link></button>
                    <button onClick={handleLogout} className="dropdown-item" type="button"><i className='fa fa-sign-out mr-2'></i> Đăng xuất</button>
                  </div>
                </div>
            ) : (
              <>
                    <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-toggle="dropdown">My Account</button>
                    <div className="dropdown-menu dropdown-menu-right  " style={{ marginTop: "35px" }}>
                      <Link to={"/login"}><button className="dropdown-item" type="button">Sign in </button></Link>
                      <Link to={"/register"}><button className="dropdown-item" type="button">Sign up </button></Link>
                  
                    </div>
              </>
            )} 
        </div> 
      </div>
      <div className="d-inline-flex align-items-center d-block d-lg-none">
        <a href='' className="btn px-0 ml-2 p-2">
          <i className="fa fa-heart text-dark mr-2" />
          <span className="badge text-dark border  rounded-circle" style={{paddingBottom: 2}}>0</span>
        </a>
        <a href='/cart' className="btn px-0 ml-2 p-2">
          <i className="fa fa-shopping-cart text-dark mr-2" />
          <span className="badge text-dark border rounded-circle" style={{paddingBottom: 2}}>0</span>
        </a>
      </div>
    </div>
  </div>
  <div className="row align-items-center bg-light py-3 px-xl-5 d-none d-lg-flex">
    <div className="col-lg-4">
      <a href='/' className="text-decoration-none">
        <span className="h1 text-uppercase text-warning bg-dark px-2">ĐQ</span>
        <span className="h1 text-uppercase text-dark bg-warning px-2 ml-n1">Shop</span>
      </a>
    </div>
    <div className="col-lg-4 col-6 text-left" style={{position:"relative"}}>
      <form >
        <div className="input-group">
          <input type="text" className="form-control text-search" placeholder="Search for products" />
          <div className="input-group-append">
            <span className="input-group-text bg-transparent text-warning">
              <i className="fa fa-search" />
            </span>
          </div>
        </div>
      </form>
      <div className='bg-light d-none ls-Product' style={{position:"absolute"}}>
        <h4>Sản phẩm</h4>
      </div>
    </div>
    {/* <div className="col-lg-4 col-6 text-right">
      <p className="m-0">Customer Service</p>
      <h5 className="m-0">+012 345 6789</h5>
    </div> */}
  </div>
</div>
{/* Topbar End */}


  </>);
}

export default Header;