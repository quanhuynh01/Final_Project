import { useEffect, useState } from 'react';
import './Home.css'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Card, Tab, Tabs } from 'react-bootstrap';
import Swal from 'sweetalert2'
import { jwtDecode } from 'jwt-decode';


const Home = () => {
  const [products, setProducts] = useState([]);
  const [Categories, setCategories] = useState([]);
  const [User, setUser] = useState(null);
  

  useEffect(() => {
    axios.get('https://localhost:7201/api/Products')
      .then(res => setProducts(res.data.slice(0, 10)));//slice(0, 15) lấy ra 15 sản phẩm đầu
    axios.get(`https://localhost:7201/api/Categories`)
      .then(res => {
       
        setCategories(res.data)
      });
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
    console.log(item);
    console.log(User);
    axios.post(`https://localhost:7201/api/Carts/addToCart/${User}?ProductId=${item.id}`)
        .then(res => {
          console.log(res.data);
            if (res.status === 200) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Thêm vào giỏ hàng",
                    showConfirmButton: false,
                    timer: 1000
                });
            }
        })
        .catch(error => console.error(error));
};

  //chuyển đổi tiền
  function convertToVND(price) { 
    const exchangeRate = 1000;
    const priceInVND = price * exchangeRate;
    return priceInVND.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  } 
 
  return (<>
<div className="container-fluid pt-5">
  <div className="row px-xl-5 pb-3">
    <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
      <div className="d-flex align-items-center bg-light mb-4" style={{padding: 30}}>
        <h1 className="fa fa-check text-primary m-0 mr-3" />
        <h5 className="font-weight-semi-bold m-0">Quality Product</h5>
      </div>
    </div>
    <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
      <div className="d-flex align-items-center bg-light mb-4" style={{padding: 30}}>
        <h1 className="fa fa-truck text-primary m-0 mr-2"></h1>  
        <h5 className="font-weight-semi-bold m-0">Free Shipping</h5>
      </div>
    </div>
    <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
      <div className="d-flex align-items-center bg-light mb-4" style={{padding: 30}}>
        <h1 className="fa fa-exchange text-primary m-0 mr-3" />
        <h5 className="font-weight-semi-bold m-0">14-Day Return</h5>
      </div>
    </div>
    <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
      <div className="d-flex align-items-center bg-light mb-4" style={{padding: 30}}>
        <h1 className="fa fa-phone text-primary m-0 mr-3" />
        <h5 className="font-weight-semi-bold m-0">24/7 Support</h5>
      </div>
    </div>
  </div>
</div>

<div className="container-fluid pt-5">
      <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Categories</span></h2>
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
  <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Featured Products</span></h2>
  <div className="row px-xl-5">
    {
      products.map((item,index)=>{
        return (<div key={index} className="col-lg-3 col-md-4 col-sm-6 pb-1">
          <div className="product-item bg-light mb-4">
            <div className="product-img position-relative overflow-hidden">
              <img className="img-fluid w-100" src={`https://localhost:7201${item.avatar}`} alt='' />
              <div className="product-action">
                <a onClick={()=>addToCart(item)} className="btn btn-outline-dark btn-square"  ><i className="fa fa-shopping-cart" /></a>
                <a className="btn btn-outline-dark btn-square" href=""><i className="fa fa-heart" /></a> 
                <Link  className="btn btn-outline-dark btn-square" to={`/chi-tiet-san-pham/${item.id}`}><i className="fa fa-search" /></Link>  
              </div>
            </div>
            <div className="text-center py-4">
              <Link
                className="h6 text-decoration-none text-truncate"
                to={`/chi-tiet-san-pham/${item.id}`}
              >
                {item.productName.length > 40 ? `${item.productName.slice(0, 40)}` : item.productName}
              </Link>

              <div className="d-flex align-items-center justify-content-center mt-2">
                <h5>{convertToVND(item.salePrice)}</h5><h6 className="text-muted ml-2"><del>{convertToVND(item.price)}</del></h6>
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
        <div className="col-md-6">
          <div className="product-offer mb-30" style={{ height: 300 }}>
            <img className="img-fluid" src="https://us.v-cdn.net/cdn-cgi/image/fit=scale-down,width=1600/https://us.v-cdn.net/6036147/uploads/G7NETX2PGYWO/ai-powered-customer-service-enhancing-the-user-experience.jpg" alt='' />
            <div className="offer-text">
              <h6 className="text-white text-uppercase">Save 20%</h6>
              <h3 className="text-white mb-3">Special Offer</h3>
              <a href='' className="btn btn-primary">Shop Now</a>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="product-offer mb-30" style={{ height: 300 }}>
            <img className="img-fluid" src="https://static-ecapac.acer.com/media/wysiwyg/vn-2023-laptop_gaming-532x332.jpg" alt='' />
            <div className="offer-text">
              <h6 className="text-white text-uppercase">Save 20%</h6>
              <h3 className="text-white mb-3">Special Offer</h3>
              <a href='' className="btn btn-primary">Shop Now</a>
            </div>
          </div>
        </div>
      </div>
    </div>

<div className="container-fluid pt-5 pb-3">
  <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Recent Products</span></h2>
  <div className="row px-xl-5">
  {
      products.map((item,index)=>{
        return (<div key={index} className="col-lg-3 col-md-4 col-sm-6 pb-1">
          <div className="product-item bg-light mb-4">
            <div className="product-img position-relative overflow-hidden">
              <img className="img-fluid w-100" src={`https://localhost:7201${item.avatar}`} alt='' />
              <div className="product-action">
                <a onClick={()=>addToCart(item)} className="btn btn-outline-dark btn-square"  ><i className="fa fa-shopping-cart" /></a>
                <a className="btn btn-outline-dark btn-square" href=""><i className="fa fa-heart" /></a> 
                <Link  className="btn btn-outline-dark btn-square" to={`/chi-tiet-san-pham/${item.id}`}><i className="fa fa-search" /></Link>  
              </div>
            </div>
            <div className="text-center py-4">
              <Link
                className="h6 text-decoration-none text-truncate"
                to={`/chi-tiet-san-pham/${item.id}`}
              >
                {item.productName.length > 40 ? `${item.productName.slice(0, 40)}` : item.productName}
              </Link>

              <div className="d-flex align-items-center justify-content-center mt-2">
                <h5>{convertToVND(item.salePrice)}</h5><h6 className="text-muted ml-2"><del>{convertToVND(item.price)}</del></h6>
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

 
  </>);
}

export default Home;