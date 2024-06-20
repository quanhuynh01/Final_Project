import { useEffect, useState } from 'react';
import './Home.css'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Card, Tab, Tabs } from 'react-bootstrap';
import Swal from 'sweetalert2'
import { jwtDecode } from 'jwt-decode';
import Share from '../Share/Share';

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
  const addToCart = (Product) => {  
    //xử lý nếu đã có sản phẩm thì update số lượng 
    let cart = JSON.parse(localStorage.getItem('cart')) || []; //Tạo cart luôn là 1 mảng hợp lệ để lưu vào localStorage 
    if (Product) { 
      cart.push(Product);
      localStorage.setItem('cart', JSON.stringify(cart));
    }
   
    // const formdata = new FormData();
    // Object.entries(item).forEach(([key, value]) => {
    //   formdata.append(key, value);
    // });
    // formdata.append("idUser", User);
    // axios.post(`https://localhost:7201/api/Products/addToCart`, formdata).then(res => console.log(res));
  };

  //chuyển đổi tiền
  function convertToVND(price) { 
    const exchangeRate = 23000;
    const priceInVND = price * exchangeRate;
    return priceInVND.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }




  return (<>
    <main id="main" className='mt-5'>
      {/* ======= About Section ======= */}
      <div id="about" className="about-area area-padding">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <div className="section-headline text-center">
                <h2>Về dịch vụ chúng tôi</h2>
              </div>
            </div>
          </div>
          <div className="row mt-4" style={{ alignItems: 'center' }}>
            {/* single-well start*/}
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="well-left">
                <div className="single-well">
                  <a href="#">
                    <img src="https://i.ytimg.com/vi/7q4PJr48Dxo/maxresdefault.jpg" alt='' />
                  </a>
                </div>
              </div>
            </div>
            {/* single-well end*/}
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="well-middle">
                <div className="single-well">
                  <a href="#">
                    <h4 className="sec-head">Hệ thống thương mại điện tử</h4>
                  </a>
                  <p>
                    Novazone công ty chuyên cung cấp các sản phẩm và dịch vụ công nghệ
                  </p>
                  <ul>
                    <li className='li-item'>
                      <i className="fa fa-check text-primary" /> Bảo hành 1 đổi 1
                    </li>
                    <li className='li-item'>
                      <i className="fa fa-check text-primary" /> Giao hàng tận nơi
                    </li>
                    <li className='li-item'>
                      <i className="fa fa-check text-primary" /> Giao hàng miễn phí trong nội thành Hồ Chí Minh
                    </li>
                    <li className='li-item'>
                      <i className="fa fa-check text-primary" /> Bảo hành tận nơi
                    </li>
                    <li className='li-item'>
                      <i className="fa fa-check text-primary" /> Giá rẻ bất ngờ
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* End col*/}
          </div>
        </div>
      </div>{/* End About Section */}
    </main>
    {/* Danh mục sản phẩm */}
    <div className='mt-4 mb-4'>
        <h2 className='text-center'>Danh mục sản phẩm</h2>
        <div className='d-flex justify-content-center mt-3 category-container'>
          {
            Categories.filter(s => s.show === true).map((item, index) => (
              <Link key={index} to={`danh-muc/${item.id}`}>
                <div className='cate-item mr-2'>
                  <div className='' style={{ alignItems: "center" }} >
                    <div className='img-cate d-flex justify-content-center p-1'>
                      <img className="category-image" style={{ height: "70px", width: "70px" }} src={`https://localhost:7201/${item.iconCate}`} alt='' />
                    </div>
                    <div className='name-cate  d-flex justify-content-center p-1'>
                      <h5>{item.nameCategory}</h5>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          }
        </div>
      </div>

    {/* Tab sản phẩm */}
    <Tabs
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
      </Tab> */}

    </Tabs>
    {/* Danh sách hãng */}
    <section className='mt-5'>
      <div>
        <h2 className='text-center mb-5'>Đối tác của chúng tôi</h2>
      </div>
    </section>
    <Share />

  </>);
}

export default Home;