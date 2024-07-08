import { useNavigate, useParams } from "react-router";
import Header from "../Header/Header";
// import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useEffect, useState } from "react";
import axios from "axios";
import './ProductsDetail.css'
import { Button, Modal, Tab, Table, Tabs } from "react-bootstrap";
import { jwtDecode } from 'jwt-decode';
import Swal from "sweetalert2";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";


const ProductsDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [productDetail, setproductDetail] = useState({ brand: { brandName: "" } });
    const [Image, setImage] = useState([]);
    const [Attribute, setAttribute] = useState([]);
    const [ViewReview, setViewReview] = useState([]);//danh sách đánh giá
    const [IdUser, setIdUser] = useState(null);
    const [Review, setReview] = useState({ rating: 0, UserId: "", Content: "", Name: "", Email: "" });

    const [show, setShowLogin] = useState(false);
    const handleCloseLogin = () => setShowLogin(false);
    const handleShowLogin = () => setShowLogin(true);


    const [avatar, setavatar] = useState("");
    useEffect(() => {
        axios.get(`https://localhost:7201/api/Products/${id}`).then(res => {

            if (res.status === 200) {
                setAttribute(res.data.productDetails.attributes);
                setproductDetail(res.data.productDetails);
                setViewReview(res.data.reviews);
                setavatar(res.data.productDetails.avatar);
            }
        });
        axios.get(`https://localhost:7201/api/ProductThumbs/hinhsp/${id}`).then(res => setImage(res.data));

        const jwt = localStorage.getItem('token');
        if (jwt) {
            const decodedJwt = jwtDecode(jwt);
            const userId = decodedJwt["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            setIdUser(userId);
            setReview(prev => ({ ...prev, UserId: userId }));
        }
    }, [id]);

    const handleImageClickImage = (imageUrl) => {
        setavatar(imageUrl);
    };

    const addToCart = (item) => {
        if (IdUser != null) {
            axios.post(`https://localhost:7201/api/Carts/addToCart/${IdUser}?ProductId=${item.id}`)
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
        else {
            handleShowLogin(true);
        }
    };

    const convertToVND = (price) => {
        const priceInVND = price * 1000;
        return priceInVND.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };
    const BuyNow = (item) => {
        if (IdUser != null) {
            axios.post(`https://localhost:7201/api/Carts/addToCart/${IdUser}?ProductId=${item.id}`)
                .then(res => {
                    if (res.status === 200) {
                        navigate(`/cart`)
                    }
                })
                .catch(error => console.error(error));
        }
        else {
            handleShowLogin(true);
        }
    };
    const handleChangeReview = (e) => {
        var name = e.target.name;
        var value = e.target.value;
        setReview(prev => ({ ...prev, [name]: value }));
    };

    const handleRatingClick = (rating) => {
        setReview(prev => ({ ...prev, rating }));
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        const { UserId, rating, Content, Name, Email, ProductId } = Review;
        axios.post(`https://localhost:7201/api/Reviews/addReview`, null, {
            params: {
                UserId: Review.UserId,
                ProductId: id, // Id của sản phẩm cần đánh giá
                Content: Review.Content,
                Name: Review.Name,
                Email: Review.Email,
                Rating: Review.rating
            }
        })
            .then(res => {
                console.log(res);
                if (res.data.status === 400) {
                    alert(res.data.message);
                }
                if (res.data.status === 200) {
                    alert("Đánh giá thành công");
                    window.location.reload();
                }

            })
            .catch(error => console.error('There was an error!', error));
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;

        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(<i key={`full-${i}`} className="fa fa-star" />);
        }

        if (halfStar) {
            stars.push(<i key="half" className="fa fa-star-half-alt" />);
        }

        for (let i = stars.length; i < 5; i++) {
            stars.push(<i key={`empty-${i}`} className="fa fa-star-o" />);
        }

        return stars;
    };
    //hàm lấy ngày và giờ  
    const formatDateTime = (dateTimeStr) => {
        const date = new Date(dateTimeStr);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();
        return `${formattedDate} - ${formattedTime}`;
    };

    console.log(avatar);
    return (
        <>
            <Header />
            <Navbar />
            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="col-12">
                        <nav className="breadcrumb bg-light mb-30">
                            <Link to={`/`} className="breadcrumb-item text-dark"  >Home</Link>
                            <span className="breadcrumb-item active">Detail</span>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="container-fluid pb-5">
                <div className="row px-xl-5">
                    <div className="col-lg-5 mb-30">
                        <div className="d-flex justify-content-center" style={{ height: "600px" }}>
                            <img className="w-100 h-100" src={`https://localhost:7201${avatar}`} alt="" />
                        </div>
                        <div>
                            {
                                Image.length > 0 ? (
                                    <div className="d-flex mt-3 justify-content-center  " style={{ flexWrap: "wrap" }}>
                                        {Image.map((img, index) => (
                                            <div key={index} className="mr-2">
                                                <img
                                                    src={`https://localhost:7201${img.image}`}
                                                    alt=""
                                                    className="img-thumbnail"
                                                    style={{ width: "100px", cursor: "pointer" }}
                                                    onClick={() => handleImageClickImage(img.image)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : null
                            }
                        </div>

                    </div>
                    <div className="col-lg-7 h-auto mb-30">
                        <div className="h-100 bg-light p-30 p-5">
                            <h3>{productDetail.productName}</h3>
                            <div className="d-flex mb-3">
                                <div className="text-warning mr-2">
                                    <small className="fa fa-star" />
                                    <small className="fa fa-star" />
                                    <small className="fa fa-star" />
                                    <small className="fa fa-star-half-alt" />
                                    <small className="fa fa-star" />
                                </div>
                                <small className="pt-1">(99 Reviews)</small>
                            </div>
                            <h5 className="font-weight-semi-bold"><del>{convertToVND(productDetail.price)}</del></h5>
                            <h3 className="font-weight-semi-bold mb-4 text-danger">{convertToVND(productDetail.salePrice)}</h3>
                            <div className="d-flex align-items-center mb-4 pt-2">
                                {/* <div className="input-group quantity mr-3" style={{ width: 130 }}>
                                    <div className="input-group-btn">
                                        <button className="btn btn-warning btn-minus">
                                            <i className="fa fa-minus" />
                                        </button>
                                    </div>
                                    <input type="text" className="form-control border-0 text-center" defaultValue={1} />
                                    <div className="input-group-btn">
                                        <button className="btn btn-warning btn-plus">
                                            <i className="fa fa-plus" />
                                        </button>
                                    </div>
                                </div> */}
                                <button onClick={() => BuyNow(productDetail)} className="btn btn-outline-warning px-3 mr-3"><i className="	fa fa-credit-card" />Buy Now</button>
                                <button onClick={() => addToCart(productDetail)} className="btn btn-warning px-3 text-white"><i className="fa fa-shopping-cart mr-1" />Add To Cart</button>
                            </div>
                            <div className="square-trade d-flex align-items-center">
                                <div className="square-trade d-flex align-items-center">
                                    <div className="square-trade-content" style={{ color: '#222', fontSize: 13 }}>
                                        <div className="ribbon ribbon-top-left"><span className="text-white"><i className="anticon  anticon-gift" />Quà tặng và ưu đãi kèm theo</span></div>
                                        <p className="lien-he-gia-tot"><i className="anticon  anticon-phone anticon-flip-horizontal" style={{ color: '#243a76' }} /> Cam kết giá tốt nhất thị trường, liên hệ ngay để có giá tốt nhất!</p>
                                        <div style={{ marginLeft: 12 }}>
                                            <p className="text" style={{ whiteSpace: 'pre-line' }}>🎁 <font> <font color="Crimson"><b>KHUYẾN MẠI KHÁC:</b></font></font></p>
                                            <p className="text" style={{ whiteSpace: 'pre-line' }}>✦ <a href="/page/chinh-sach-giao-hang">Giao hàng miễn phí nội thành tại TPHCM</a></p>
                                            <p className="text" style={{ whiteSpace: 'pre-line' }}>✦ Học sinh - sinh viên giảm thêm đến 200K</p>
                                            <p className="text" style={{ whiteSpace: 'pre-line' }}>✦ Ưu đãi lớn khi mua kèm <a href="/danhmuc/software">Microsoft Office</a> chính hãng do <b>NOVAZONE</b> phân phối</p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="d-flex pt-2">
                                <strong className="text-dark mr-2">Share:</strong>
                                <div className="d-inline-flex">
                                    <a className="text-dark px-2" href="">
                                        <i className="fa fa-facebook-f" />
                                    </a>
                                    <a className="text-dark px-2" href="">
                                        <i className="fa fa-twitter" />
                                    </a>
                                    <a className="text-dark px-2" href="">
                                        <i className="fa fa-linkedin" />
                                    </a>
                                    <a className="text-dark px-2" href="">
                                        <i className="fa fa-pinterest" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row px-xl-5">
                    <div className="col">
                        <div className="bg-light p-30">
                            <div className="nav nav-tabs mb-4">
                                <a className="nav-item nav-link text-dark active" data-toggle="tab" href="#tab-pane-1">Description</a>
                                <a className="nav-item nav-link text-dark" data-toggle="tab" href="#tab-pane-2">Specifications</a>
                                <a className="nav-item nav-link text-dark" data-toggle="tab" href="#tab-pane-3">Reviews ({ViewReview.length})</a>
                            </div>
                            <div className="tab-content">
                                <div className="tab-pane fade show active p-3" id="tab-pane-1">
                                    <h4 className="mb-3">Mô tả sản phẩm</h4>
                                    <p>Eos no lorem eirmod diam diam, eos elitr et gubergren diam sea. Consetetur vero aliquyam invidunt duo dolores et duo sit. Vero diam ea vero et dolore rebum, dolor rebum eirmod consetetur invidunt sed sed et, lorem duo et eos elitr, sadipscing kasd ipsum rebum diam. Dolore diam stet rebum sed tempor kasd eirmod. Takimata kasd ipsum accusam sadipscing, eos dolores sit no ut diam consetetur duo justo est, sit sanctus diam tempor aliquyam eirmod nonumy rebum dolor accusam, ipsum kasd eos consetetur at sit rebum, diam kasd invidunt tempor lorem, ipsum lorem elitr sanctus eirmod takimata dolor ea invidunt.</p>
                                    <p>Dolore magna est eirmod sanctus dolor, amet diam et eirmod et ipsum. Amet dolore tempor consetetur sed lorem dolor sit lorem tempor. Gubergren amet amet labore sadipscing clita clita diam clita. Sea amet et sed ipsum lorem elitr et, amet et labore voluptua sit rebum. Ea erat sed et diam takimata sed justo. Magna takimata justo et amet magna et.</p>
                                </div>
                                <div className="tab-pane fade" id="tab-pane-2">
                                    <h4 className="mb-3 text-center">Specifications</h4>
                                    <Table className="">
                                        <tbody className="">
                                            {Attribute.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.nameAttribute}</td>
                                                    <td>{item.attributeValue}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                                <div className="tab-pane fade" id="tab-pane-3">
                                    <div className="row">
                                        <div className="col-md-6 ">
                                            {Array.isArray(ViewReview) && ViewReview.length > 0 ? (
                                                <div>
                                                    <h4 className="mb-4 ml-2 text-info">Đánh giá ({ViewReview.length} đánh giá)</h4>
                                                    {
                                                        ViewReview.map((item, index) => {
                                                            return (
                                                                <div key={index} className="media mb-4">
                                                                    <div className="media-body ml-2">
                                                                        <h6>{item.name}<small> - <i>{formatDateTime(item.dateComment)}</i></small></h6>
                                                                        <div className="text-warning mb-2">
                                                                            {renderStars(item.rating)}
                                                                        </div>
                                                                        <p>{item.content}</p>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            ) : (
                                                <p>Không có đánh giá nào</p>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <h4 className="mb-4">Leave a review</h4>
                                            <small>Your email address will not be published. Required fields are marked *</small>
                                            <div className="d-flex my-3">
                                                <p className="mb-0 mr-2">Your Rating *:</p>
                                                <div className="text-warning">
                                                    {Array.from({ length: 5 }, (_, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => handleRatingClick(index + 1)}
                                                            className={`btn btn-sm ${Review.rating >= index + 1 ? 'text-warning btn-warning' : ' text-secondary btn-light'}`}
                                                            style={{ border: 'none', background: 'none', padding: 0, fontSize: '1.5rem' }}
                                                        >
                                                            {Review.rating >= index + 1 ? '★' : '☆'}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <form>
                                                <div className="form-group">
                                                    <label htmlFor="message">Your Review *</label>
                                                    <textarea id="message" name="Content" cols={30} rows={5} className="form-control" defaultValue={""} onChange={handleChangeReview} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="name">Your Name *</label>
                                                    <input type="text" className="form-control" id="name" name="Name" onChange={handleChangeReview} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="email">Your Email *</label>
                                                    <input type="email" className="form-control" id="email" name="Email" onChange={handleChangeReview} />
                                                </div>
                                                <div className="form-group mb-0">
                                                    <button type="button" defaultValue="Leave Your Review" className="btn btn-primary px-3" onClick={handleSubmitReview}>Leave Your Review</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
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
            {/* Shop Detail End */}
            <Footer />
        </>
    );
};

export default ProductsDetail;
