import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
 
import { Button } from 'react-bootstrap';
 import './SlideShow.css'
import { Link } from 'react-router-dom';
const SlideShow = () => {
    // const [index, setIndex] = useState(0);

    // const handleSelect = (selectedIndex) => {
    //   setIndex(selectedIndex);
    // };
    return (<>
<div className="container-fluid mb-3">
  <div className="row px-xl-5">
    <div className="col-lg-8">
      <div id="header-carousel" className="carousel slide carousel-fade mb-20 mb-lg-0" data-ride="carousel">
        <ol className="carousel-indicators">
          <li data-target="#header-carousel" data-slide-to={0} className='' />
          <li data-target="#header-carousel" data-slide-to={1} className='' />
          <li data-target="#header-carousel" data-slide-to={2} className="active" />
        </ol>
        <div className="carousel-inner">
          <div className="carousel-item position-relative" style={{height: 470}}>
            <img className="position-absolute w-100 h-100" src="https://www.asus.com/WebsitesBanner/VN/banners/oe3yqdecfprdkdbh/oe3yqdecfprdkdbh-0_0_desktop_0_1X.jpg" style={{objectFit: 'cover'}} />
            <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
              <div className="p-3" style={{maxWidth: 700}}>
                <h6 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">Sắm Ngay Phụ Kiện</h6>
                <p className="mx-md-5 px-5 animate__animated animate__bounceIn text-white">Tặng kèm chuột không dây cho đơn hàng phụ kiện từ 500.000 đồng trở lên.</p>
                <Link className="btn btn-outline-warning py-2 px-4 mt-3 animate__animated animate__fadeInUp" to="/shop.html">Xem ngay</Link>
              </div>
            </div>
          </div>
          <div className="carousel-item position-relative" style={{height: 470}}>
            <img className="position-absolute w-100 h-100" src="https://www.gigabyte.com/Images/Assets/Pages/PressRoom/News/AboutInfo-About.webp" style={{objectFit: 'cover'}} />
            <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
              <div className="p-3" style={{maxWidth: 700}}>
                <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">Ưu đãi nhập học</h1>
                  <p className="mx-md-5 px-5 animate__animated animate__bounceIn  text-white">Giảm giá đặc biệt 20% cho tất cả phụ kiện PC và laptop khi mua hàng trực tuyến</p>
                  <Link className="btn btn-outline-warning py-2 px-4 mt-3 animate__animated animate__fadeInUp" to="/shop.html">Xem ngay</Link>
              </div>
            </div>
          </div>
          <div className="carousel-item position-relative active" style={{height: 470}}>
            <img className="position-absolute w-100 h-100" src="https://i.dell.com/is/image/DellContent/content/dam/uwaem/production-design-assets/en/pssi-templates/images/product-cat/prod-cat-relate-003.jpg?wid=1600&fit=constrain" style={{objectFit: 'cover'}} />
            <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
              <div className="p-3" style={{maxWidth: 700}}>
                <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">Phụ Kiện Đỉnh Cao</h1>
                <p className="mx-md-5 px-5 animate__animated animate__bounceIn text-white ">Mua 1 tặng 1 cho các dòng cáp kết nối trong thời gian khuyến mãi, Miễn phí vận chuyển toàn quốc cho các đơn hàng trên 1.000.000 đồng</p>
                <Link className="btn btn-outline-warning py-2 px-4 mt-3 animate__animated animate__fadeInUp" to="/shop.html">Xem ngay</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="col-lg-4">
      <div className="product-offer mb-30" style={{height: 220}}>
        <img className="img-fluid" src="https://images.acer.com/is/image/acer/AI_PC_Banner-1:Primary-Hero-XL" alt='' />
        <div className="offer-text">
          <h6 className="text-white text-uppercase">Khuyến mãi 10%</h6>
          <h3 className="text-white mb-3">Chương trình nhập học</h3>
          <Link to="/shop.html" className="btn btn-primary">Xem ngay</Link>
        </div>
      </div>
      <div className="product-offer mb-30" style={{height: 220}}>
        <img className="img-fluid" src="https://static.gigabyte.com/StaticFile/Image/Global/40505512b7117629a096580e60df226d/Article/166/webp/480" alt='' />
        <div className="offer-text">
          <h6 className="text-white text-uppercase">Khuyến mãi 15%</h6>
          <h3 className="text-white mb-3">Phụ kiện văn phòng</h3>
          <Link to="/shop.html" className="btn btn-primary">Xem ngay</Link>
        </div>
      </div>
    </div>
  </div>
</div>

    </>);
}

export default SlideShow;