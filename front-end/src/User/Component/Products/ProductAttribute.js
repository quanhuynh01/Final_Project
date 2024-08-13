import { useNavigate, useParams } from "react-router";
import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";
import { Button, Card, Modal } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const ProductAttribute = () => {
    const { id ,catid} = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [NameValue, setNameValue] = useState(null);
    const [User, setUser] = useState(null);
    const [show, setShowLogin] = useState(false);
    const handleCloseLogin = () => setShowLogin(false);
    const handleShowLogin = () => setShowLogin(true);
    // Convert price to VND
    function convertToVND(price) {
        const priceInVND = price * 1000;
        return priceInVND.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    useEffect(() => {
        let token = localStorage.getItem('token');
        if (token != null) {
            const decode = jwtDecode(token);
            const userId = decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            setUser(userId);
        }
    }, []);

    useEffect(() => {
        if (id) {
            axios.get(`https://localhost:7201/AttributeId/${id}/${catid}`)
                .then(res => {
                    //   console.log("API response:", res.data); // Kiểm tra dữ liệu trả về từ API
                    setProducts(res.data);

                })
                .catch(error => {
                    navigate("/not-found");
                    console.error('Error fetching product attributes:', error);
                });
        }
    }, [id]);
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
                .catch(error => {
                    navigate("/not-found");
                    console.error(error);
                });
        } else {
            handleShowLogin(true);
        }
    };
    return (
        <>
            <Header />
            <Navbar />
            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="col-12">
                        <nav className="breadcrumb bg-light mb-30">
                            <Link to={`/`} className="breadcrumb-item text-dark"  >Home</Link>
                            <span className="breadcrumb-item active">Filter</span>
                        </nav>
                    </div>
                </div>
            </div>
            <div className=" " style={{ width: "90%", margin: "auto" }} s>
                <div className="d-flex">
                    {products.length > 0 ? (
                        products.map((item, index) => (
                            <div key={index}>
                                <Card className='card-item' style={{ width: '17.5rem', margin: '10px' }}>
                                    <Card.Img variant="top" src={`https://localhost:7201${item.product.avatar}`} alt='' />
                                    <Card.Body style={{ position: "relative" }}>
                                        <Link key={item.product.id} to={`/chi-tiet-san-pham/${item.product.id}`}>
                                            <div className='d-flex' style={{ justifyContent: "space-between" }}>
                                                <Card.Text>Mã SP:{item.product.sku}</Card.Text>
                                                <Card.Text className={item.product.stock > 0 ? 'text-success' : 'text-danger'}>
                                                    {item.product.stock > 0 ? <><i className='fa fa-check'></i>Còn hàng</> : "Hết hàng"}
                                                </Card.Text>
                                            </div>
                                            <Card.Title style={{ height: '3rem', overflow: "hidden" }}>
                                                {item.product.productName}
                                            </Card.Title>
                                            <Card.Text>Giá: {convertToVND(item.product.price)}</Card.Text>
                                        </Link>
                                    </Card.Body>
                                    <div style={{ display: "flex", justifyContent: "flex-end", position: "absolute", bottom: "10px", right: "20px" }}>
                                        <Button onClick={()=>addToCart(item)} variant="primary"><i className="fa fa-shopping-cart"></i></Button>
                                    </div>
                                </Card>
                            </div>
                        ))
                    ) : (
                        <p>No products available for this attribute.</p>
                    )}
                </div>

            </div>
            <Footer />


            <Modal show={show} onHide={handleCloseLogin} centered>
                <div className='row justify-content-center mt-4'>
                    <h1 className='text-danger'>QT Member</h1>
                </div>
                <Modal.Body>
                    <div className='row justify-content-center'>
                        <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:80/q:90/plain/https://cellphones.com.vn/media/wysiwyg/chibi2.png" height={80} alt="cps-smember-icon" />
                    </div>
                    <div className='mt-3'>
                        <h6 style={{ textAlign: 'center' }}>Vui lòng đăng nhập tài khoản QT Member để xem ưu đãi và thanh toán dễ dàng hơn.</h6>
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
        </>
    );
}

export default ProductAttribute;
