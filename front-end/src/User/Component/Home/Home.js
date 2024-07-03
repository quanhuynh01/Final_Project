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
      .then(res => setCategories(res.data));
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
                    <div className="overflow-hidden" style={{ width: 100, height: 100 }}>
                      <img className="img-fluid" src="img/cat-1.jpg" alt='' />
                    </div>
                    <div className="flex-fill pl-3">
                      <h6>{item.nameCategory}</h6>
                      <small className="text-body">100 Products</small>
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
                {/* {item.productName.length > 40 ? `${item.productName.slice(0, 40)}` : item.productName} */}
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
            <img className="img-fluid" src="img/offer-1.jpg" alt='' />
            <div className="offer-text">
              <h6 className="text-white text-uppercase">Save 20%</h6>
              <h3 className="text-white mb-3">Special Offer</h3>
              <a href='' className="btn btn-primary">Shop Now</a>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="product-offer mb-30" style={{ height: 300 }}>
            <img className="img-fluid" src="img/offer-2.jpg" alt='' />
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

{/* hãng */}
 
    {/* <Tabs
      defaultActiveKey="bestSeller"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="bestSeller" title={<h4>Sản phẩm bán chạy</h4>}>
        <div className='d-flex justify-content-center' style={{ flexWrap: "wrap", width: "80%", margin: "auto" }}>
          {products.filter(p => p.bestSeller === true).map((item) => (

            <Card key={item.id} className='card-item' style={{ width: '17.5rem', margin: '10px' }}>
              <Card.Img variant="top" src={`https://localhost:7201${item.avatar}`} alt='' />
              <Card.Body style={{ position: "relative" }}>
                <Link key={item.id} to={`chi-tiet-san-pham/${item.id}`}>
                  <div className='d-flex' style={{ justifyContent: "space-between" }}>
                    <Card.Text>Mã SP:{item.sku}</Card.Text>
                    <Card.Text className={item.stock > 0 ? 'text-success' : 'text-danger'}>
                      {item.stock > 0 ? <><i className='fa fa-check'></i> Còn hàng</> : "Hết hàng"}
                    </Card.Text>
                  </div>
                  <Card.Title style={{ height: '3rem', overflow: "hidden" }}>
                    {item.productName}
                  </Card.Title>
                  <Card.Text>Giá: {convertToVND(item.price)}</Card.Text>
                </Link>
              </Card.Body>
              <div style={{ display: "flex", justifyContent: "flex-end", position: "absolute", bottom: "10px", right: "20px" }}>
                <Button onClick={() => addToCart(item)} variant="primary"><i className="fa fa-shopping-cart"></i></Button>
              </div>
              <p className='best-seller'>Bán chạy</p>
            </Card>

          ))}
        </div>
      </Tab>


      {/* <Tab eventKey="New" title={<h4>Sản phẩm mới</h4>}>
        <div className='d-flex justify-content-center' style={{ flexWrap: "wrap", width: "80%", margin: "auto" }}>
          {[...Array(10)].map((_, i) => (
            <Card key={i} style={{ width: '17.5rem', margin: '10px' }}>
              <Card.Img variant="top" src="https://sunhitech.vn/images/products/laptop-asus-rog-zephyrus-g14-ga402nj-l4056w-amd-ryzen-7-7735hs-16gb-512gb-rtx-3050-14-inch-fhd-win-11-xam-1.jpg" />
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the
                  bulk of the card's content.
                </Card.Text>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button onClick={() => addToCart()} variant="primary"><i className="fa fa-shopping-cart"></i></Button>
                </div>
              </Card.Body>
              <p className='products-new'>Mới</p>
            </Card>
          ))}
        </div>
      </Tab>
      <Tab eventKey="NewDate" title={<h4>Sản phẩm Hot</h4>}>
        <div className='d-flex justify-content-center' style={{ flexWrap: "wrap", width: "80%", margin: "auto" }}>
          {[...Array(10)].map((_, i) => (
            <Card key={i} style={{ width: '17.5rem', margin: '10px' }}>
              <Card.Img variant="top" src="https://sunhitech.vn/images/products/laptop-asus-rog-zephyrus-g14-ga402nj-l4056w-amd-ryzen-7-7735hs-16gb-512gb-rtx-3050-14-inch-fhd-win-11-xam-1.jpg" />
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the
                  bulk of the card's content.
                </Card.Text>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button onClick={() => addToCart()} variant="primary"><i className="fa fa-shopping-cart"></i></Button>
                </div>
              </Card.Body>
              <p className='products-new'>Mới</p>
            </Card>
          ))}
        </div>
      </Tab> 
 
    </Tabs> 
    <section className='mt-5'>
      <div>
        <h2 className='text-center mb-5'>Đối tác của chúng tôi</h2>
      </div>  </section> */}
   
  </>);
}

export default Home;