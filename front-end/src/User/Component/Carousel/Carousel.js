import React from 'react';
import './Carousel.css';

const Carousel = () => {
  return (
    <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
      <ol className="carousel-indicators">
        <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
      </ol>
      <div className="carousel-inner">
        <div className="carousel-item position-relative" style={{ height: '430px' }}>
          <img className="d-block w-50" src="/images/carousel-1.jpg" alt="First slide" />
          <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
            <div className="p-3" style={{ maxWidth: '70px' }}>
              <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">
                Men Fashion
              </h1>
              <p className=" animate__animated animate__bounceIn">
                Lorem rebum magna amet lorem magna erat diam stet. Sadips duo stet amet amet ndiam elitr ipsum diam
              </p>
              <a className="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp" href="#">
                Shop Now
              </a>
            </div>
          </div>
        </div>
        <div className="carousel-item position-relative active" style={{ height: '430px' }}>
          <img className="d-block w-100" src="/images/carousel-2.jpg" alt="Second slide" style={{ objectFit: 'cover' }} />
          <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
            <div className="p-3" style={{ maxWidth: '700px' }}>
              <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">
                Women Fashion
              </h1>
              <p className="mx-md-5 px-5 animate__animated animate__bounceIn">
                Lorem rebum magna amet lorem magna erat diam stet. Sadips duo stet amet amet ndiam elitr ipsum diam
              </p>
              <a className="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp" href="#">
                Shop Now
              </a>
            </div>
          </div>
        </div>
        <div className="carousel-item position-relative" style={{ height: '430px' }}>
          <img className="d-block w-50" src="/images/carousel-3.jpg" alt="Third slide" style={{ objectFit: 'cover' }} />
          <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
            <div className="p-3" style={{ maxWidth: '700px' }}>
              <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">
                Kids Fashion
              </h1>
              <p className="mx-md-5 px-5 animate__animated animate__bounceIn">
                Lorem rebum magna amet lorem magna erat diam stet. Sadips duo stet amet amet ndiam elitr ipsum diam
              </p>
              <a className="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp" href="#">
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
