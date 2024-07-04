import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
 
import { Button } from 'react-bootstrap';
 import './SlideShow.css'
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
          <li data-target="#header-carousel" data-slide-to={0} className />
          <li data-target="#header-carousel" data-slide-to={1} className />
          <li data-target="#header-carousel" data-slide-to={2} className="active" />
        </ol>
        <div className="carousel-inner">
          <div className="carousel-item position-relative" style={{height: 430}}>
            <img className="position-absolute w-100 h-100" src="https://www.asus.com/WebsitesBanner/VN/banners/oe3yqdecfprdkdbh/oe3yqdecfprdkdbh-0_0_desktop_0_1X.jpg" style={{objectFit: 'cover'}} />
            <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
              <div className="p-3" style={{maxWidth: 700}}>
                {/* <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">Men Fashion</h1>
                <p className="mx-md-5 px-5 animate__animated animate__bounceIn">Lorem rebum magna amet lorem magna erat diam stet. Sadips duo stet amet amet ndiam elitr ipsum diam</p>
                <a className="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp" href ="#">Shop Now</a> */}
              </div>
            </div>
          </div>
          <div className="carousel-item position-relative" style={{height: 430}}>
            <img className="position-absolute w-100 h-100" src="https://www.gigabyte.com/Images/Assets/Pages/PressRoom/News/AboutInfo-About.webp" style={{objectFit: 'cover'}} />
            <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
              <div className="p-3" style={{maxWidth: 700}}>
                {/* <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">Women Fashion</h1>
                  <p className="mx-md-5 px-5 animate__animated animate__bounceIn">Lorem rebum magna amet lorem magna erat diam stet. Sadips duo stet amet amet ndiam elitr ipsum diam</p>
                  <a className="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp" href ="#">Shop Now</a> */}
              </div>
            </div>
          </div>
          <div className="carousel-item position-relative active" style={{height: 430}}>
            <img className="position-absolute w-100 h-100" src="https://i.dell.com/is/image/DellContent/content/dam/uwaem/production-design-assets/en/pssi-templates/images/product-cat/prod-cat-relate-003.jpg?wid=1600&fit=constrain" style={{objectFit: 'cover'}} />
            <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
              <div className="p-3" style={{maxWidth: 700}}>
                {/* <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">Kids Fashion</h1>
                <p className="mx-md-5 px-5 animate__animated animate__bounceIn">Lorem rebum magna amet lorem magna erat diam stet. Sadips duo stet amet amet ndiam elitr ipsum diam</p>
                <a className="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp" href ="#">Shop Now</a> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="col-lg-4">
      <div className="product-offer mb-30" style={{height: 200}}>
        <img className="img-fluid" src="https://images.acer.com/is/image/acer/AI_PC_Banner-1:Primary-Hero-XL" alt='' />
        <div className="offer-text">
          <h6 className="text-white text-uppercase">Save 20%</h6>
          <h3 className="text-white mb-3">Special Offer</h3>
          <a href="" className="btn btn-primary">Shop Now</a>
        </div>
      </div>
      <div className="product-offer mb-30" style={{height: 200}}>
        <img className="img-fluid" src="https://static.gigabyte.com/StaticFile/Image/Global/40505512b7117629a096580e60df226d/Article/166/webp/480" alt='' />
        <div className="offer-text">
          <h6 className="text-white text-uppercase">Save 20%</h6>
          <h3 className="text-white mb-3">Special Offer</h3>
          <a href="" className="btn btn-primary">Shop Now</a>
        </div>
      </div>
    </div>
  </div>
</div>

    </>);
}

export default SlideShow;