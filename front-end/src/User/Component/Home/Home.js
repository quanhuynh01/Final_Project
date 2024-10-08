import { useEffect, useState } from 'react';
import './Home.css'
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import Swal from 'sweetalert2'
import { jwtDecode } from 'jwt-decode';
import $ from 'jquery'
import { Button, Modal } from 'react-bootstrap';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [Categories, setCategories] = useState([]);
  const [User, setUser] = useState(null);

  const [productNew, setproductNew] = useState([]);

  const [show, setShowLogin] = useState(false); 
  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);
  const [Discount, setDiscount] = useState([]);
  useEffect(() => { 
    axios.get('https://localhost:7201/api/Products')
      .then(res => setProducts(res.data));//slice(0, 15) lấy ra 15 sản phẩm đầu
    axios.get(`https://localhost:7201/api/Categories`)
      .then(res => { 
        setCategories(res.data)
      });
      axios.get(`https://localhost:7201/api/Products/lspronew`).then(res=>{
        setproductNew(res.data);
      })
      axios.get(`https://localhost:7201/api/Discounts`).then(res=>{
        setDiscount(res.data);
      })
  }, []);
  //khởi chạy khi render để lấy id User
  useEffect(() => {
    let token = localStorage.getItem('token');
    if (token != null) { 
      const decode = jwtDecode(token);
      const userId = decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      setUser(userId); 
    }
  }, []);

  //thêm vào giỏ hàng
  const addToCart = (item) => {
    if (item !== null && User !== null) {
      axios.post(`https://localhost:7201/api/Carts/addToCart/${User}?ProductId=${item.id}`)
        .then(res => {
          console.log(res.data);
          if (res.status === 200) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Thêm vào giỏ hàng thành công",
              showConfirmButton: false,
              timer: 1000
            });
          }
        })
        .catch(error => console.error(error));
    }
    else{
      handleShowLogin(true);
    }

  };

  //chuyển đổi tiền
  function convertToVND(price) { 
    const exchangeRate = 1000;
    const priceInVND = price * exchangeRate;
    return priceInVND.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  } 
 
  const addWistList= (id)=>{ 
    var object = {
      UserId: User,
      ProductId: id
    }
    if (object.UserId !== null) {
      axios.post(`https://localhost:7201/api/WistLists`, object).then(res => {
        if (res.data.status === 200) {
          alert(res.data.message);
        }
        if (res.data.status === 201) {
          alert(res.data.message);
        }
      })
    }
    else{
      setShowLogin(true);
    }
     
  }

     // Filter and sort products by creation date
     const filteredProducts = products.filter(p => p.softDelete === false);
     const sortedProducts = filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
     console.log(products);
  return (<>
<div className="container-fluid pt-5">
  <div className="row px-xl-5 pb-3">
    <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
      <div className="d-flex align-items-center bg-light mb-4" style={{padding: 30}}>
        <h1 className="fa fa-check text-primary m-0 mr-3" />
        <h5 className="font-weight-semi-bold m-0">Sản phẩm chất lượng</h5>
      </div>
    </div>
    <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
      <div className="d-flex align-items-center bg-light mb-4" style={{padding: 30}}>
        <h1 className="fa fa-truck text-primary m-0 mr-2"></h1>  
        <h5 className="font-weight-semi-bold m-0">Miễn phí giao hàng</h5>
      </div>
    </div>
    <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
      <div className="d-flex align-items-center bg-light mb-4" style={{padding: 30}}>
        <h1 className="fa fa-exchange text-primary m-0 mr-3" />
        <h5 className="font-weight-semi-bold m-0">14 ngày hoàn trả</h5>
      </div>
    </div>
    <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
      <div className="d-flex align-items-center bg-light mb-4" style={{padding: 30}}>
        <h1 className="fa fa-phone text-primary m-0 mr-3" />
        <h5 className="font-weight-semi-bold m-0">Hỗ trợ 24/7</h5>
      </div>
    </div>
  </div>
</div>

<div className="container-fluid pt-5">
      <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">DANH MỤC</span></h2>
      <div className="row px-xl-5 pb-3">
        {
          Categories.map((item, index) => {
            return (
              <div key={index} className="col-lg-3 col-md-4 col-sm-6 pb-1">
                <Link to={`/danh-muc/${item.id}`} className="text-decoration-none"  >
                <div className="cat-item d-flex align-items-center mb-4">
                    <div className="overflow-hidden d-flex" style={{ width: 100, height: 100 }}>
                      <img className="img-fluid  " src={`https://localhost:7201${item.iconCate}`} alt='' />
                    </div>
                    <div className="flex-fill pl-3">
                      <h6>{item.nameCategory}</h6> 
                    </div>
                  </div>
                </Link> 
              </div>
            )
          })
        }

      </div>
    </div>

    {/* sản phẩm */}
<div className="container-fluid pt-5 pb-3">
  <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Sản phẩm nổi bật</span></h2>
  <div className="row px-xl-5">
    {
      products.filter(p=>p.bestSeller === true && p.softDelete === false).slice(0,12).map((item,index)=>{
        return (<div key={index} className="col-lg-3 col-md-4 col-sm-6 pb-1">
          <div className="product-item bg-light mb-4">
            <div className="product-img position-relative overflow-hidden">
              <img className="img-fluid w-100" src={`https://localhost:7201${item.avatar}`} alt='' />
              <div className="product-action">
                <a onClick={()=>addToCart(item)} className="btn btn-outline-dark btn-square"  ><i className="fa fa-shopping-cart" /></a>
                <a  onClick={()=>addWistList(item.id)}  className="btn btn-outline-dark btn-square" ><i className="fa fa-heart" /></a> 
                <Link  className="btn btn-outline-dark btn-square" to={`/chi-tiet-san-pham/${item.id}`}><i className="fa fa-search" /></Link>  
              </div>
            </div>
            <div className="text-center py-4">
              <Link
                className="h6 text-decoration-none text-truncate"
                to={`/chi-tiet-san-pham/${item.id}`}
              >
                {item.productName.length > 20 ? `${item.productName.slice(0,20)}` : item.productName}
              </Link>

              <div className="d-flex align-items-center justify-content-center mt-2">
                {item.price <= 0 ? (
                  <h5>Liên hệ</h5>
                ) : (
                  item.salePrice === item.price ? (
                    <h5>{convertToVND(item.price)}</h5>
                  ) : (
                    <>
                      <h5>{convertToVND(item.salePrice)}</h5>
                      <h6 className="text-muted ml-2"><del>{convertToVND(item.price)}</del></h6>
                    </>
                  )
                )} 
              </div> 
              <div className="d-flex align-items-center justify-content-center mb-1">
                <small className="fa fa-star text-primary mr-1" />
                <small className="fa fa-star text-primary mr-1" />
                <small className="fa fa-star text-primary mr-1" />
                <small className="fa fa-star text-primary mr-1" />
                <small className="fa fa-star text-primary mr-1" />
                <small>(99)</small>
              </div>
            </div>
          </div>
        </div>)
      })
        } 
  </div>
</div>
      {/* hình ảnh sale */}
    <div className="container-fluid pt-5 pb-3">
    <div className="row px-xl-5">
        {Discount && Discount.length > 0 ? (
          Discount.filter(d=>d.show).slice(0, 2).map((discount, index) => (
            <div className="col-md-6 mb-30" key={index}>
              <div className="product-offer" style={{ height: 300 }}>
                <img className="img-fluid" src={`https://localhost:7201${discount.banner}`} alt='' />
                <div className="offer-text">
                  <h6 className="text-white text-uppercase">{discount.title}</h6>
                  <h3 className="text-white mb-3">Ưu đãi đặt biệt</h3>
                  <a href='' className="btn btn-primary">Xem ngay</a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>
            <p>Không có khuyến mãi nào.</p>
          </div>
        )}
      </div>

    </div>

<div className="container-fluid pt-5 pb-3">
  <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Sản phẩm mới</span></h2>
  <div className="row px-xl-5">
        {
          productNew.slice(0,12).map((item, index) => {
            return (<div key={index} className="col-lg-3 col-md-4 col-sm-6 pb-1">
              <div className="product-item bg-light mb-4">
                <div className="product-img position-relative overflow-hidden">
                  <img className="img-fluid w-100" src={`https://localhost:7201${item.avatar}`} alt='' />
                  <div className="product-action">
                    {item.price > 0 ? (
                      <a onClick={() => addToCart(item)} className="btn btn-outline-dark btn-square">
                        <i className="fa fa-shopping-cart" />
                      </a>
                    ) : (
                      <a className="btn btn-outline-dark btn-square disabled">
                        <i className="fa fa-shopping-cart" />
                      </a>
                    )}
                    <a className="btn btn-outline-dark btn-square" href="">
                      <i className="fa fa-heart" />
                    </a>
                    <Link className="btn btn-outline-dark btn-square" to={`/chi-tiet-san-pham/${item.id}`}>
                      <i className="fa fa-search" />
                    </Link>
                  </div>

                </div>
                <div className="text-center py-4">
                  <Link
                    className="h6 text-decoration-none text-truncate"
                    to={`/chi-tiet-san-pham/${item.id}`}
                  >
                    {item.productName.length > 20 ? `${item.productName.slice(0, 20)}` : item.productName}
                  </Link>

                  <div className="d-flex align-items-center justify-content-center mt-2">
                    {item.price <= 0 ? (
                      <h5>Liên hệ</h5>
                    ) : (
                      item.salePrice === item.price ? (
                        <h5>{convertToVND(item.price)}</h5>
                      ) : (
                        <>
                          <h5>{convertToVND(item.salePrice)}</h5>
                          <h6 className="text-muted ml-2"><del>{convertToVND(item.price)}</del></h6>
                        </>
                      )
                    )}

                  </div>
                  <div className="d-flex align-items-center justify-content-center mb-1">
                    <small className="fa fa-star text-primary mr-1" />
                    <small className="fa fa-star text-primary mr-1" />
                    <small className="fa fa-star text-primary mr-1" />
                    <small className="fa fa-star text-primary mr-1" />
                    <small className="fa fa-star text-primary mr-1" />
                    <small>(99)</small>
                  </div>
                </div>
              </div>
            </div>)
          })
        }   
  </div>
</div> 
    <Modal show={show} onHide={handleCloseLogin} centered>
      <div className='row justify-content-center mt-4'>
        <h1 className='text-danger'>QT Member</h1>
      </div> 
      <Modal.Body>
        <div className='row justify-content-center'>
          <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:80/q:90/plain/https://cellphones.com.vn/media/wysiwyg/chibi2.png" height={80} alt="cps-smember-icon" />
        </div>
        <div className='mt-3'>
          <h6 style={{ textAlign: 'center' }}>Vui lòng đăng nhập tài khoản QT Member để xem ưu đãi và thanh toán dễ dàng hơn.</h6>
        </div>
      </Modal.Body>
      <div className='row justify-content-center p-2'>
        <Link to={`/register`} className='m-2 btn btn-outline-primary'    >
          Đăng ký
        </Link>
        <Link to={`/login`} className='m-2 btn btn-warning'    >
          Đăng nhập
        </Link>
      </div>
    </Modal> 
 
  </>);
}

export default Home;