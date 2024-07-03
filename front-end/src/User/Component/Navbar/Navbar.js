import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
  const [Categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`https://localhost:7201/api/Categories`)
      .then(res => setCategories(res.data));
  }, []);

  return (
    <div className="bg-dark">
      <div className="row px-xl-5 mb-30">
        <div className="col-lg-3 d-none d-lg-block" style={{ justifyContent: 'center' }}>
          <a className="btn d-flex align-items-center justify-content-between bg-warning w-100 collapsed" data-toggle="collapse" href="#navbar-vertical" style={{ height: "100%", padding: '0 30px' }} aria-expanded="false">
            <h6 className="text-dark m-0"><i className="fa fa-bars mr-2" />Categories</h6>
            <i className="fa fa-angle-down text-dark" />
          </a>
          <nav className="position-absolute navbar navbar-vertical navbar-light align-items-start p-0 bg-light collapse" id="navbar-vertical" style={{ width: 'calc(100% - 30px)', zIndex: 999 }}>
            <div className="navbar-nav w-100" style={{ paddingLeft: '8%' }}>
              {Categories.filter(category => category.show).map((item) => (
                <div key={item.id} className="nav-item dropdown dropright">
                  <a href="#" className="nav-link" data-toggle="dropdown" aria-expanded="false">{item.nameCategory} <i className="fa fa-angle-right float-right mt-1" /></a>
                  <div className="dropdown-menu position-absolute rounded-0 border-0 m-0">
                    <a href="#" className="dropdown-item">Laptop Gamming</a>
                    <a href="#" className="dropdown-item">Laptop văn phòng</a>
                    <a href="#" className="dropdown-item">Laptop đồ họa</a>
                  </div>
                </div>
              ))}
            </div>
          </nav>
        </div>
        <div className="col-lg-9 pt-10" style={{ padding: '10px' }}>
          <nav className="navbar-expand-lg bg-dark navbar-dark py-3 py-lg-0 px-0">
            <a href="#" className="text-decoration-none d-block d-lg-none">
              <span className="h1 text-uppercase text-warning bg-dark px-2">ĐQ</span>
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
                  to="/shop"
                  className={({ isActive }) => (isActive ? 'nav-item nav-link active' : 'nav-item nav-link')}
                >
                  Sản phẩm
                </NavLink>
                <NavLink
                  to="/detail"
                  className={({ isActive }) => (isActive ? 'nav-item nav-link active' : 'nav-item nav-link')}
                >
                  Giới thiệu
                </NavLink>
                <NavLink
                  to="/contact.html"
                  className={({ isActive }) => (isActive ? 'nav-item nav-link active' : 'nav-item nav-link')}
                >
                  Liên hệ
                </NavLink>
              </div>
              <div className="navbar-nav ml-auto py-0 d-none d-lg-block">
                <NavLink to="/cart" title="Cart" className="btn btn-warning">
                  <i className="fa fa-shopping-cart text-white pr-2" />
                  <span className="bg-light badge text-danger border border-secondary rounded-circle" style={{ paddingBottom: 2 }}>5</span>
                </NavLink>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
