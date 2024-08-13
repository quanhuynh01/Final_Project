import { Navigate, useNavigate, useParams } from "react-router";
import Header from "../Header/Header";
// import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useEffect, useState } from "react";
import axios from "axios";
import './ProductsDetail.css'
import { Button, Modal, Table } from "react-bootstrap";
import { jwtDecode } from 'jwt-decode';
import Swal from "sweetalert2";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";

import { Carousel } from 'primereact/carousel';

const ProductsDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams(); 
    useEffect(() => {
        if (isNaN(id)) {
            navigate("/not-found");
        }
    }, [id, navigate]);


    const [productDetail, setproductDetail] = useState({ brand: { brandName: "" } });
    const [Image, setImage] = useState([]);
    const [Attribute, setAttribute] = useState([]);
    const [ViewReview, setViewReview] = useState([]);//danh sách đánh giá
    const [IdUser, setIdUser] = useState(null);
    const [Review, setReview] = useState({ rating: 0, UserId: "", Content: "", Name: "", Email: "" });
    const [productBrand, setproductBrand] = useState([]);
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
                
            }
        }).catch(e=>{
            navigate("/not-found");
        });
        axios.get(`https://localhost:7201/api/ProductThumbs/hinhsp/${id}`).then(res => {
            setImage(res.data);
            res.data.map(item => {
                if (item.isMain === true)
                    setavatar(item.image);
            })
        }).catch(ex=>{navigate("/not-found")});

        const jwt = localStorage.getItem('token');
        if (jwt) {
            const decodedJwt = jwtDecode(jwt);
            const userId = decodedJwt["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            setIdUser(userId);
            setReview(prev => ({ ...prev, UserId: userId }));
        }
        axios.get(`https://localhost:7201/api/Products/getProductBrand/${id}`).then(res=>{
            setproductBrand(res.data); 
        }).catch(ex=>{navigate("/not-found")});
    }, [id, navigate]);

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
                            title: "Thêm vào giỏ hàng thành công",
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
        if(Review.Name !=="" || Review.Email !=="" || Review.Content !=="" )
        {
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
                    if (res.data.status === 400) {
                        alert(res.data.message);
                    }
                    if (res.data.status === 200) {
                        alert("Đánh giá thành công");
                        window.location.reload();
                    }
    
                })
                .catch(error => console.error('There was an error!', error));
        }
        else{
            alert("You have not entered enough information");
        }
       
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

    const [showFullDescription, setShowFullDescription] = useState(false);
    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const MAX_LENGTH = 3000;   
    const description = productDetail.description || "";
    const isLongDescription = description.length > MAX_LENGTH;
    const shortDescription = isLongDescription ? description.slice(0, MAX_LENGTH) + "..." : description; 
 

    const responsiveOptions = [
        {
            breakpoint: '1400px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '575px',
            numVisible: 1,
            numScroll: 1
        }
    ];
    const productTemplate = (product) => { 
        // Giới hạn tên sản phẩm chỉ 10 ký tự
        const truncatedName = product.productName.length > 10 
            ? product.productName.substring(0,50) + '...'
            : product.productName;
     
        return ( 
                <div className="product-item bg-light mb-4">
                    <div className="product-img position-relative overflow-hidden d-flex justify-content-center">
                        <img className="img-fluid w-50 " src={`https://localhost:7201${product.avatar}`} alt='' />
                        <div className="product-action">
                            <a onClick={() => addToCart(product)} className="btn btn-outline-dark btn-square"  ><i className="fa fa-shopping-cart" /></a>
                            {/* <a onClick={() => addWistList(product.id)} className="btn btn-outline-dark btn-square" ><i className="fa fa-heart" /></a> */}
                            <Link className="btn btn-outline-dark btn-square" to={`/chi-tiet-san-pham/${product.id}`}><i className="fa fa-search" /></Link>
                        </div>
                    </div>
                    <div className="text-center py-4">
                        <Link
                            className="h6 text-decoration-none "
                            to={`/chi-tiet-san-pham/${product.id}`}
                        >
                           {truncatedName}
                        </Link>

                        <div className="d-flex align-items-center justify-content-center mt-2">
                            {product.price <= 0 ? (
                                <h5>Liên hệ</h5>
                            ) : (
                                product.salePrice !== product.price  && product.salePrice !==0? (
                                    <>
                                    <h5>{convertToVND(product.salePrice)}</h5>
                                    <h6 className="text-muted ml-2"><del>{convertToVND(product.price)}</del></h6>
                                    </> 
                                ) : (
                                    <>
                                         <h5>{convertToVND(product.price)}</h5>
                                    </>
                                )
                            )}
                        </div>
                        <div className="d-flex align-items-center justify-content-center mb-1">
                            <small className="fa fa-star text-primary mr-1" />
                            <small className="fa fa-star text-primary mr-1" />
                            <small className="fa fa-star text-primary mr-1" />
                            <small className="fa fa-star text-primary mr-1" />
                            <small className="fa fa-star text-primary mr-1" />
                            <small>(99)</small>
                        </div>
                    </div>
                </div>
           
        );
    }; 
    console.log(productDetail); 
    return (
        <>
            <Header />
            <Navbar />
            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="col-12">
                        <nav className="breadcrumb bg-light mb-30">
                            <Link to={`/`} className="breadcrumb-item text-dark">Trang chủ</Link>
                            <span className="breadcrumb-item active">Chi tiết sản phẩm {productDetail.productName}</span>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="container-fluid pb-5">
                <div className="row px-xl-5">
                    <div className="col-lg-5 mb-30">
                        <div className="d-flex justify-content-center" style={{ height: "700px" }}>
                
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
                        <div className="h-75  bg-light p-30 p-5">
                            <h3>{productDetail.productName}</h3>
                            <div className="d-flex mb-3"> 
                                <div className=" mr-2">
                                     <h6 className="text-warning"> {productDetail.start} <small className="fa fa-star" /></h6> 
                                </div>
                                <div  className=" mr-2">
                                    <h6>Thương hiệu: <b className="text-info">{productDetail.brand.brandName}</b> </h6> 
                                </div>
                                <div  className=" mr-2">
                                    <h6>Bảo hành: <b className="text-info">{productDetail.warranty}</b> tháng</h6>
                                </div>
                                <div  className=" mr-2">
                                    <h6>Loại bảo hành: <b className="text-info">{productDetail.waWarrantyType}</b></h6>
                                </div>
                            </div>
                            <div>
                                {productDetail.salePrice !== productDetail.price && productDetail.salePrice !==0? (
                                    <>
                                        <h5 className="font-weight-semi-bold"><del>{convertToVND(productDetail.price)}</del></h5>
                                        <h3 className="font-weight-semi-bold mb-4 text-danger">{convertToVND(productDetail.salePrice)}</h3>
                                    </>
                                ) : (
                                    productDetail.price  === 0 ? ( <h3 className="text-danger"><b >Liên hệ</b></h3>):(  <h3 className="font-weight-semi-bold mb-4 text-danger">{convertToVND(productDetail.price)}</h3>)
                                  
                                )}
                            </div>

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
                                <button onClick={() => BuyNow(productDetail)} className="btn btn-outline-warning px-3 mr-3"><i className="	fa fa-credit-card" /> Mua ngay</button>
                                <button onClick={() => addToCart(productDetail)} className="btn btn-warning px-3 text-white"><i className="fa fa-shopping-cart mr-1" /> Thêm vào giỏ hàng</button>
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
                                            <p className="text" style={{ whiteSpace: 'pre-line' }}>✦ Ưu đãi lớn khi mua kèm <a href="/danhmuc/software">Microsoft Office</a> chính hãng do <b>DT Shop</b> phân phối</p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="d-flex pt-2">
                                <strong className="text-dark mr-2">Chia sẻ:</strong>
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
                                <a className="nav-item nav-link text-dark active" data-toggle="tab" href="#tab-pane-1">Mô tả sản phẩm</a>
                                <a className="nav-item nav-link text-dark" data-toggle="tab" href="#tab-pane-2">Thông số kỹ thuật</a>
                                <a className="nav-item nav-link text-dark" data-toggle="tab" href="#tab-pane-3">Đánh giá ({ViewReview.length})</a>
                            </div>
                            <div className="tab-content">
                                <div className="tab-pane fade show active p-3" id="tab-pane-1">
                                    <div className="text-center" dangerouslySetInnerHTML={{ __html: description ? (showFullDescription ? description : shortDescription) : "Đang cập nhật" }}></div>
                                    {isLongDescription && (
                                        <div className="text-center">
                                            <button className="btn btn-primary mt-3" onClick={toggleDescription}>
                                                {showFullDescription ? 'Thu gọn' : 'Xem thêm'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="tab-pane fade" id="tab-pane-2">
                                    <h4 className="mb-3 text-center">Thông số kỹ thuật</h4>
                                    <Table className="">
                                        <tbody className="">
                                            <tr>
                                                <td>Hãng</td> 
                                                <td>{productDetail.brand.brandName}</td> 
                                            </tr>
                                            <tr>
                                                <td>Mã SP</td> 
                                                <td>{productDetail.sku}</td> 
                                            </tr>
                                            {Attribute && Attribute.length > 0 ? (
                                                Attribute.map((attr, index) => (
                                                    <tr key={index}>
                                                        <td>{attr.nameAttribute}</td>
                                                        <td>
                                                            {attr.values.map((value, valueIndex) => (
                                                                <span key={valueIndex}>{value.attributeValue}{valueIndex < attr.values.length - 1 ? ', ' : ''}</span>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="2" className="text-center">No data available</td>
                                                </tr>
                                            )}
                                            {/* {Attribute.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.nameAttribute}</td>
                                                    <td>{item.attributeValue}</td>
                                                </tr>
                                            ))} */}
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
                                                <p>Rất tiết chưa có đánh giá nào cho sản phẩm này</p>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <h4 className="mb-4">Để lại đánh giá</h4>
                                            <small> Địa chỉ email của bạn sẽ không được công bố. Các trường bắt buộc được đánh dấu *</small>
                                            <div className="d-flex my-3">
                                                <p className="mb-0 mr-2">Số sao *:</p>
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
                                                    <label htmlFor="message">Đánh giá của bạn *</label>
                                                    <textarea id="message" name="Content" cols={30} rows={5} className="form-control" defaultValue={""} onChange={handleChangeReview} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="name">Tên của bạn *</label>
                                                    <input type="text" className="form-control" id="name" name="Name" onChange={handleChangeReview} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="email">Email *</label>
                                                    <input type="email" className="form-control" id="email" name="Email" onChange={handleChangeReview} />
                                                </div>
                                                <div className="form-group mb-0">
                                                    <button type="button" defaultValue="Leave Your Review" className="btn btn-primary px-3" onClick={handleSubmitReview}>Gửi đánh giá </button>
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
            <div className="container-fluid pb-5">
                <div className="row px-xl-5">
                    <div className="col">
                        <div className="bg-light p-30">
                            <h4 className="text-center mb-5">Danh sách các sản phẩm cùng thương hiệu <b>{productDetail.brand.brandName}</b> </h4>
                            <Carousel value={productBrand} numVisible={3} numScroll={3} responsiveOptions={responsiveOptions} className="custom-carousel" 
                            autoplayInterval={3000} itemTemplate={productTemplate} />
                        </div>
                    </div>
                </div> 
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
            {/* Shop Detail End */}
            <Footer />
        </>
    );
};

export default ProductsDetail;
