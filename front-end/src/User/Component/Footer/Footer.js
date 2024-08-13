import { useState } from 'react';
import './Footer.css'
import { Link } from 'react-router-dom';
const Footer =()=>{
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 100) {
        setShowBackToTop(true);
    } else {
        setShowBackToTop(false);
    }
};

const scrollToTop = () => {
    const scrollStep = -window.scrollY / (500 / 15); // 500: thời gian di chuyển (milliseconds)
    const scrollInterval = setInterval(() => {
        if (window.scrollY !== 0) {
            window.scrollBy(0, scrollStep);
        } else {
            clearInterval(scrollInterval);
        }
    }, 15);
};

window.addEventListener('scroll', handleScroll);
    return(<> 
<div>
  {/* Footer Start */}
  <div className="container-fluid bg-dark text-white mt-5 pt-5"  >
    <div className="row px-xl-5 pt-5">
      <div className="col-lg-4 col-md-12 mb-5 pr-3 pr-xl-5">
        <h5 className="text-white text-uppercase mb-4">DT Shop</h5>
        <p className="mb-4 text-white">Nơi bạn có thể trao gửi niềm tim</p>
        <p className="mb-2 text-white"><i className="fa fa-map-marker text-warning  mr-3" />65 Huỳnh Thúc Kháng, phường Bến Nghé, Quận 1, thành phố Hồ Chí Minh</p>
        <p className="mb-2 text-white"><i className="fa fa-envelope text-warning mr-3" />quanhuynh855@gmail.com</p>
        <p className="mb-0 text-white"><i className="fa fa-phone text-warning mr-3" />+84 984 855 261</p>
      </div>
      <div className="col-lg-8 col-md-12">
        <div className="row">
          <div className="col-md-6 mb-5">
            <h5 className="text-white text-uppercase mb-4">Liên kết nhanh</h5>
            <div className="d-flex flex-column justify-content-start">
              <Link className="text-white mb-2" to={`/`}><i className="fa fa-angle-right mr-2" />Trang chủ</Link>
              <Link className="text-white mb-2" to={`/shop.html`}><i className="fa fa-angle-right mr-2" />Sản phẩm</Link>
              <a className="text-white mb-2" href="#"><i className="fa fa-angle-right mr-2" />Về chúng tôi</a>
              <a className="text-white mb-2" href="#"><i className="fa fa-angle-right mr-2" />Liên hệ</a>
             
            </div>
          </div> 
          <div className="col-md-6 mb-5">
            <h5 className="text-white text-uppercase mb-4">Gửi phản hồi</h5>
            <p className='text-white'>Vui lòng nhập Email của bạn</p>
            <form action=''>
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Your Email Address" />
                <div className="input-group-append">
                  <button className="btn btn-warning">Sign Up</button>
                </div>
              </div>
            </form>
            <h6 className="text-white text-uppercase mt-4 mb-3">Follow Us</h6>
            <div className="d-flex">
              <a className="btn btn-warning btn-square mr-2" href="#"><i className="fa fa-twitter" /></a>
              <a className="btn btn-warning btn-square mr-2" href="#"><i className="fa fa-facebook-f" /></a>
              <a className="btn btn-warning btn-square mr-2" href="#"><i className="fa fa-linkedin" /></a>
              <a className="btn btn-warning btn-square" href="#"><i className="fa fa-instagram" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="row border-top mx-xl-5 py-4" style={{borderColor: 'rgba(256, 256, 256, .1) !important'}}>
      <div className="col-md-6 px-xl-0">
        <p className="mb-md-0 text-center text-md-left text-white">
          © <a className="text-warning" href="#">Domain</a>. All Rights Reserved. Designed
          by
          <a className="text-warning" href="/">HTML Codex</a>
        </p>
      </div>
      <div className="col-md-6 px-xl-0 text-center text-md-right">
        <img className="img-fluid" src="img/payments.png" alt='' />
      </div>
    </div>
  </div>
  {/* Footer End */}
  {/* Back to Top */}
  <button style={{display:"block"}}  onClick={scrollToTop}className="btn btn-warning back-to-top"><i className="fa fa-angle-double-up" /></button>
</div>

    </>)
}
export default Footer;