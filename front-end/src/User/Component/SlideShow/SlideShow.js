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
{/* <div className="container-fluid mb-3">
  <div className="row px-xl-5">
    <div className="col-lg-8">
      <div id="header-carousel" className="carousel slide carousel-fade mb-30 mb-lg-0" data-ride="carousel">
        <ol className="carousel-indicators">
          <li data-target="#header-carousel" data-slide-to={0} className />
          <li data-target="#header-carousel" data-slide-to={1} className />
          <li data-target="#header-carousel" data-slide-to={2} className="active" />
        </ol>
        <div className="carousel-inner">
          <div className="carousel-item position-relative" style={{height: 430}}>
            <img className="position-absolute w-100 h-100" src={img1} style={{objectFit: 'cover'}} />
            <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
              <div className="p-3" style={{maxWidth: 700}}>
                <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">Men Fashion</h1>
                <p className="mx-md-5 px-5 animate__animated animate__bounceIn">Lorem rebum magna amet lorem magna erat diam stet. Sadips duo stet amet amet ndiam elitr ipsum diam</p>
                <a className="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp" href="#">Shop Now</a>
              </div>
            </div>
          </div>
          <div className="carousel-item position-relative" style={{height: 430}}>
            <img className="position-absolute w-100 h-100" src={img2} style={{objectFit: 'cover'}} />
            <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
              <div className="p-3" style={{maxWidth: 700}}>
                <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">Women Fashion</h1>
                <p className="mx-md-5 px-5 animate__animated animate__bounceIn">Lorem rebum magna amet lorem magna erat diam stet. Sadips duo stet amet amet ndiam elitr ipsum diam</p>
                <a className="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp" href="#">Shop Now</a>
              </div>
            </div>
          </div>
          <div className="carousel-item position-relative active" style={{height: 430}}>
            <img className="position-absolute w-100 h-100" src={img3} style={{objectFit: 'cover'}} />
            <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
              <div className="p-3" style={{maxWidth: 700}}>
                <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">Kids Fashion</h1>
                <p className="mx-md-5 px-5 animate__animated animate__bounceIn">Lorem rebum magna amet lorem magna erat diam stet. Sadips duo stet amet amet ndiam elitr ipsum diam</p>
                <a className="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp" href="#">Shop Now</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="col-lg-4">
      <div className="product-offer mb-30" style={{height: 200}}>
        <img className="img-fluid" src={offer1} alt='' />
        <div className="offer-text">
          <h6 className="text-white text-uppercase">Save 20%</h6>
          <h3 className="text-white mb-3">Special Offer</h3>
          <a href='' className="btn btn-primary">Shop Now</a>
        </div>
      </div>
      <div className="product-offer mb-30" style={{height: 200}}>
        <img className="img-fluid" src={offer2}  alt='' />
        <div className="offer-text">
          <h6 className="text-white text-uppercase">Save 20%</h6>
          <h3 className="text-white mb-3">Special Offer</h3>
          <a href='' className="btn btn-primary">Shop Now</a>
        </div>
      </div>
    </div>
  </div>
</div>  */}
 <Carousel fade>
      <Carousel.Item>
        <img
          style={{height:'850px'}}
          className="d-block w-100  "
          src="https://sunhitech.vn/images/slides/slide1.jpg"
          alt="First slide"
        />
        <Carousel.Caption>
          <h1>CÔNG TY TNHH NOVAZONE</h1>
          <p style={{color:'white'}}>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
         style={{height:'850px'}}
          className="d-block w-100"
          src="https://marvel-b1-cdn.bc0a.com/f00000000295886/www.oriontalent.com/military-job-seekers/data-center/images/data-center.jpg"
          alt="Second slide"
        />
        <Carousel.Caption>
        <h1>CÔNG TY TNHH NOVAZONE</h1>
          <p style={{color:'white'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
         style={{height:'850px'}}
          className="d-block w-100"
          src="https://www.lw.com/dfsmedia/1281ba27c7364299935b6ca4e198a70d/103547-50131/10to3-gettyimages-1316753843"
          alt="Third slide"
        />
        <Carousel.Caption>
        <h1>CÔNG TY TNHH NOVAZONE</h1>
          <p style={{color:'white'}}>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
    <Button className='playvideobutton'><i className='fa fa-play'></i></Button>
    </>);
}

export default SlideShow;