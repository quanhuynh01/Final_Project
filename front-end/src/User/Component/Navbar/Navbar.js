import axios from "axios";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import './Navbar.css';
import { jwtDecode } from 'jwt-decode';
const Navbar = () => {
  const [Categories, setCategories] = useState([]);
  const [Attributes, setAttributes] = useState({});
  const [currentHoveredId, setCurrentHoveredId] = useState(null);
  const [showMoreHoveredId, setShowMoreHoveredId] = useState(null);
  const [IdUser, setIdUser] = useState(null);
  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {

    axios.get(`https://localhost:7201/api/Categories`)
      .then(res => {
        setCategories(res.data);
      });

  }, []);

  const handleMouseEnter = (event, id) => {
    setCurrentHoveredId(id);
    if (event.currentTarget && event.currentTarget.querySelector) {
      event.currentTarget.querySelector('.dropdown-menu').classList.add('show');
      if (!Attributes[id]) {
        axios.get(`https://localhost:7201/api/Attributevalues/lsAttributeAndValue/${id}`).then(res => {
          setAttributes(prevAttributes => ({
            ...prevAttributes, [id]: res.data
          }));
        });
      }
    }
  };

  const handleMouseLeave = (event) => {
    setCurrentHoveredId(null);
    setShowMoreHoveredId(null);
    event.currentTarget.querySelector('.dropdown-menu').classList.remove('show');
  };

  const handleShowMoreMouseEnter = (event, id) => {
    setShowMoreHoveredId(id);
    if (event.currentTarget && event.currentTarget.querySelector) {
      event.currentTarget.querySelector('.dropdown-menu-more').classList.add('show');
    }
  }; 
  const handleShowMoreMouseLeave = (event) => {
    setShowMoreHoveredId(null);
    event.currentTarget.querySelector('.dropdown-menu-more').classList.remove('show');
  }; 
  const truncateString = (str, num) => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  };

  const handleMouseEnterCart = () => {
    const jwt = localStorage.getItem('token'); // Lấy mã JWT từ localStorage
    if (jwt) {
      const decodedJwt = jwtDecode(jwt); // sử dụng thư viện jwtDecode để giải mã JWT
      const userId = decodedJwt["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      setIdUser(userId);
      axios.get(`https://localhost:7201/api/Carts/getCart/${userId}`).then(res => setCartItems(res.data));
    }
    setCartVisible(true);

  };

  const handleMouseLeaveCart = () => {
    setCartVisible(false);
  };
  const convertToVND = (price) => {
    const priceInVND = price * 1000;
    return priceInVND.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };
  console.log(Attributes);

  return (
    <div className="container-fluid bg-dark">
      <div className="row px-xl-5 mb-30">
        <div className="col-lg-3 d-none d-lg-block" style={{ justifyContent: 'center' }}>
          <a className="btn d-flex align-items-center justify-content-between bg-warning w-100 collapsed" data-toggle="collapse" href="#navbar-vertical" style={{ height: "100%", padding: '0 30px' }} aria-expanded="false">
            <h6 className="text-dark m-0"><i className="fa fa-bars mr-2" />Danh mục</h6>
            <i className="fa fa-angle-down text-dark" />
          </a>
          <nav className="position-absolute navbar navbar-vertical navbar-light align-items-start p-0 bg-light collapse " id="navbar-vertical" style={{ width: 'calc(100% - 30px)', zIndex: 999 }}>
            <div className="navbar-nav" style={{ paddingLeft: '8%',width:"900px" }}>
              {Categories.filter(category => category.show).map((item) => (
                <div key={item.id} className="nav-item dropdown dropright" onMouseEnter={(event) => handleMouseEnter(event, item.id)} onMouseLeave={handleMouseLeave}>
                  <Link to={`/danh-muc/${item.id}`} className="nav-link">
                    {item.nameCategory} <i className="fa fa-angle-right float-right mt-1" />
                  </Link>
                  <div className={`dropdown-menu position-absolute rounded-0 border-0 m-0 dropmenu ${currentHoveredId === item.id ? 'show' : ''}`}>
                    <div className="row nav-item-cate">
                      {(Attributes[item.id] || []).slice(0,11).filter(a=>a.active === false).map(attr => (
                        <div key={attr.id} className="col-3">
                          <div className="">
                            <div className="title text-danger">
                              {attr.nameAttribute}
                            </div>
                            <div className="">
                              {attr.values.slice(0, 5).map(value => (
                                <Link key={value.id} to={`/filteValue/${value.id}`} className="dropdown-item">
                                  {truncateString(value.nameValue, 13)}
                                </Link>
                              ))}
                             
                              {attr.values.length > 5 && (
                                <div className="dropdown-item dropright" onMouseEnter={(event) => handleShowMoreMouseEnter(event, attr.id)} onMouseLeave={handleShowMoreMouseLeave}>
                                  <a >Xem thêm ...</a>
                                  <div className={`dropdown-menu dropdown-menu-more position-absolute rounded-0 border-0 m-0 ${showMoreHoveredId === attr.id ? 'show' : ''}`}>
                                    {attr.values.slice(5).map(value => (
                                      <Link key={value.id} to={`/filteValue/${value.id}`} className="dropdown-item">
                                        {truncateString(value.nameValue, 13)}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </nav>
        </div>
        <div className="col-lg-9 pt-10" style={{ padding: '10px' }}>
          <nav className="navbar-expand-lg bg-dark navbar-dark py-3 py-lg-0 px-0">
            <a href="#" className="text-decoration-none d-block d-lg-none">
              <span className="h1 text-uppercase text-warning bg-dark px-2">QT</span>
              <span className="h1 text-uppercase text-light bg-warning px-2 ml-n1">Shop</span>
            </a>
            <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
              <div className="navbar-nav mr-auto py-0 d-flex">
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? 'nav-item nav-link active' : 'nav-item nav-link')}
                >
                  Trang chủ
                </NavLink>
                <NavLink
                  to="/shop.html"
                  className={({ isActive }) => (isActive ? 'nav-item nav-link active' : 'nav-item nav-link')}
                >
                  Sản phẩm
                </NavLink>
                <NavLink
                  to="/detail"
                  className={({ isActive }) => (isActive ? 'nav-item nav-link active' : 'nav-item nav-link')}
                >
                  Về chúng tôi
                </NavLink>
                <NavLink
                  to="/contact.html"
                  className={({ isActive }) => (isActive ? 'nav-item nav-link active' : 'nav-item nav-link')}
                >
                  Liên hệ
                </NavLink>
              </div>

              <div className="navbar-nav ml-auto py-0 d-none d-lg-flex ">
                <NavLink to="/wishList" title="Wish List" className="btn btn-warning position-relative mr-2">
                  <i className="fa fa-heart text-white " />
                </NavLink>
                <div className="position-relative" onMouseEnter={handleMouseEnterCart} onMouseLeave={handleMouseLeaveCart}>
                  <NavLink to="/cart" title="Cart" className="btn btn-warning position-relative">
                    <i className="fa fa-shopping-cart text-white " />
                  </NavLink>
                  <div className={`header-cart-hover loaded ${cartVisible ? 'visible' : ''}`} id="miniCart">
                    <div className="cart-items-holder p-2">
                      {cartItems.length > 0 ? (
                        cartItems.map((item, index) => (
                          <Link key={index} to={`/chi-tiet-san-pham/${item.product.id}`}>
                            <div className="p-2 card " > 
                              <div className="d-flex">
                                <img className="w-25" src={`https://localhost:7201/${item.product.avatar}`} alt="" />
                                <p>{truncateString(item.product.productName, 50)}</p>
                              </div>
                              <p className="m-0 d-flex justify-content-between">
                                <b>x {item.quantity}</b>
                                <b className="red">{convertToVND(item.quantity * item.product.price)}</b>
                              </p>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="cart-empty">
                          <p style={{ fontSize: 16, color: '#000' }}>No product in your shopping cart</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
