import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Card, Button, Modal } from "react-bootstrap";
import './ProductList.css'; // Đảm bảo import stylesheet của bạn tại đây
import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";

const ProductsList = () => {
    const [lsProduct, setLsProduct] = useState([]);
    const [show, setShowLogin] = useState(false); 
    const handleCloseLogin = () => setShowLogin(false);
    const handleShowLogin = () => setShowLogin(true);
    const [User, setUser] = useState(null);
    useEffect(() => {
        axios.get(`https://localhost:7201/lsProduct`).then(res => {
            console.log(res.data);
            setLsProduct(res.data);
        })
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
    if (item !== null && User !== null) {
      axios.post(`https://localhost:7201/api/Carts/addToCart/${User}?ProductId=${item.id}`)
        .then(res => { 
          if (res.status === 200) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Add to cart successfully",
              showConfirmButton: false,
              timer: 1000
            });
          }
        })
        .catch(error => console.error(error));
    }
    else{
      handleShowLogin(true);
    }

  };

    // Convert price to VND
    function convertToVND(price) {
        const priceInVND = price * 1000;
        return priceInVND.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    //phân trang 
    const iteminPage =3; // số lượng phần tử mỗi trang
    const [currentPage, setcurrentPage] = useState(0);
    const offset = currentPage * iteminPage;
    const currentItem = lsProduct.slice(offset, offset + iteminPage);
    const pageCount = Math.ceil(lsProduct.length / iteminPage); 
    const handlePageclick = (e)=>{ 
        setcurrentPage(e.selected);
    } 

    return (
        <>
        <Header/>
        <Navbar/>
            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="col-12">
                        <nav className="breadcrumb bg-light mb-30">
                            <Link to={`/`} className="breadcrumb-item text-dark">Trang chủ</Link>
                            <span className="breadcrumb-item active">Danh sách sản phẩm</span>
                        </nav>
                    </div>
                </div>
            </div>
            <div className=""style={{ width: "90%", margin: "auto" }}>
                {currentItem.length > 0 && currentItem !== null ? (
                    currentItem.map((item, index) => (
                        <div key={index}>
                            <div id="nz-div">
                                <Link className="danhmuc" to={`/danh-muc/${item.cateId}`}>
                                    <h5 className="tde">
                                        <span style={{ fontSize: 24 }}>{item.categoryName}</span>
                                    </h5>
                                </Link>
                            </div>
                            <div className="d-flex" style={{flexWrap:"wrap"}}>
                                {item.products.map((product, idx) => (
                                    <div className=" " key={idx}>
                                        <Card className='card-item' style={{ width: '20rem', margin: '10px' }}>
                                            <Card.Img variant="top" src={`https://localhost:7201${product.avatar}`} alt='' />
                                            <Card.Body style={{ position: "relative" }}>
                                                <Link key={product.id} to={`/chi-tiet-san-pham/${product.id}`}>
                                                    <div className='d-flex' style={{ justifyContent: "space-between" }}>
                                                        <Card.Text>Mã SP:{product.sku}</Card.Text>
                                                        <Card.Text className={product.stock > 0 ? 'text-success' : 'text-danger'}>
                                                            {product.stock > 0 ? <><i className='fa fa-check'></i>In stock</> : "Out stock"}
                                                        </Card.Text>
                                                    </div>
                                                    <Card.Title style={{ height: '3rem', overflow: "hidden" }}>
                                                        {product.productName}
                                                    </Card.Title>
                                                    <Card.Text>Giá: {convertToVND(product.price)}</Card.Text>
                                                </Link>
                                            </Card.Body>
                                            <div style={{ display: "flex", justifyContent: "flex-end", position: "absolute", bottom: "10px", right: "20px" }}>
                                                <Button onClick={()=>addToCart(product)} variant="primary"><i className="fa fa-shopping-cart"></i></Button>
                                            </div>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No data available</p>
                )}
                <ReactPaginate
                    previousLabel={'Trở về'}
                    nextLabel={'Tiếp theo'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageclick}
                    containerClassName={'pagination '}
                    activeClassName={'active'}
                />
            </div> 

 
            
            <Modal show={show} onHide={handleCloseLogin} centered>
                <div className='row justify-content-center mt-4'>
                    <h1 className='text-danger'>ShopMember</h1>
                </div>
                <Modal.Body>
                    <div className='row justify-content-center'>
                        <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:80/q:90/plain/https://cellphones.com.vn/media/wysiwyg/chibi2.png" height={80} alt="cps-smember-icon" />
                    </div>
                    <div className='mt-3'>
                        <h6 style={{ textAlign: 'center' }}>Vui lòng đăng nhập tài khoản Shopmember để xem ưu đãi và thanh toán dễ dàng hơn.</h6>
                    </div>
                </Modal.Body>
                <div className='row justify-content-center p-2'>
                    <Link to={`/register`} className='m-2 btn btn-outline-primary'    >
                        Đăng ký
                    </Link>
                    <Link to={`/login`} className='m-2 btn btn-warning'    >
                        Đăng nhập
                    </Link>
                </div>
    </Modal> 
            <Footer/>
        </>
        
    );
}

export default ProductsList;
