import { useParams } from "react-router";
import Header from "../Header/Header";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useEffect, useState } from "react";
import axios from "axios";
import './ProductsDetail.css'
import { Button, Tab, Table, Tabs } from "react-bootstrap";
import { jwtDecode } from 'jwt-decode';
import Swal from "sweetalert2";
import Navbar from "../Navbar/Navbar";
const ProductsDetail = () => {
    const { id } = useParams();
    const [productDetail, setproductDetail] = useState({ brand: { brandName: "" } });
    const [Image, setImage] = useState([]);
    const [Attribute, setAttribute] = useState([]);
    const [IdUser, setIdUser] = useState(null);
    const [Review, setReview] = useState({}); 
    const [currentImage, setCurrentImage] = useState(`https://localhost:7201${productDetail.avatar}`);
    useEffect(() => {
        axios.get(`https://localhost:7201/api/Products/${id}`).then(res => {
            if (res.status == 200) {
                setAttribute(res.data.lstAttribute);
                setproductDetail(res.data.data.product);
                setCurrentImage(res.data.data.product.avatar);
            }

        })
        axios.get(`https://localhost:7201/api/ProductThumbs/hinhsp/${id}`).then(res => setImage(res.data));

        const jwt = localStorage.getItem('token'); // Lấy mã JWT từ localStorage 
        if (jwt) {
            const decodedJwt = jwtDecode(jwt); //  sử dụng thư viện jwtDecode để giải mã JWT
            const userId = decodedJwt["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            setIdUser(userId);
        }

    }, []);

    //xử lý click active hình ảnh
    const handleImageClick = (imageUrl) => {
        // console.log(imageUrl.image);
        setCurrentImage(imageUrl.image);
    };
    const addToCart = (item) => {
        axios.post(`https://localhost:7201/api/Carts/addToCart/${IdUser}?ProductId=${item.id}`)
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Thêm vào giỏ hàng",
                        showConfirmButton: false,
                        timer: 1000
                    });
                }
            })
            .catch(error => console.error(error));
    };
    function convertToVND(price) {
        const priceInVND = price * 1000;
        return priceInVND.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    const handleChangeReview =(e)=>{
        var name = e.target.name;
        var value = e.target.value;
        setReview(prev => ({ ...prev, [name]: value }));

    }
    const handleSubmitReview =(e) =>{ 
        e.preventDefault();
        console.log(Review);
    }
   
    return (<>
        <Header />
        <Navbar />
        {/* Breadcrumb Start */}
        <div className="container-fluid">
            <div className="row px-xl-5">
                <div className="col-12">
                    <nav className="breadcrumb bg-light mb-30">
                        <a className="breadcrumb-item text-dark" href="/">Trang chủ</a>
                        <span className="breadcrumb-item active">Chi tiết sản phẩm</span>
                    </nav>
                </div>
            </div>
        </div>
        {/* Breadcrumb End */}

        {/* <section className="detail container" >
            <div className="row">
                <div className="col-6 image-section" >
                    <div className="big-image-holder col-12 " id="js-big-img" style={{ height: "370px" }}>

                        <img src={`https://localhost:7201${currentImage}`} alt={`https://localhost:7201${currentImage}`} />

                    </div>
                    <div className="image-thumbnail-holder row pt-2">
                        {Image.map((image, index) => (
                            <div className="thumbnail col-3" key={index} onClick={() => handleImageClick(image)} >
                                <img src={`https://localhost:7201${image.image}`} alt={`Thumbnail ${index}`} className="img-thumbnail" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-6">
                    <h3>{productDetail.productName}</h3>
                    <div className="row ">
                        <p className="col-4">Mã sản phẩm: {productDetail.sku}</p>
                        <p className="col-4">Hãng sản xuất:  {productDetail.brand.brandName}</p>
                    </div>
                    <div className="p-price pt-4 ">
                        <h5 className="text-primary p-2">
                            <b>Giá:</b> <del className="text-secondary">{convertToVND(productDetail.price)}</del>
                        </h5>
                        <h4 className="text-primary p-2">
                            <b>Giá khuyến mãi:</b> <b className="text-danger">{convertToVND(productDetail.salePrice)}</b>
                        </h4>
                    </div>
                    <div className="p-3">
                        <h4>Chính sách giao hàng</h4>
                        <p className="pt-2"><i className="fa fa-gift text-danger"></i> Giao hàng tận nơi</p>
                        <p  ><i className="fa fa-gift text-danger"></i> Giao hàng tận nơi</p>
                        <p  ><i className="fa fa-gift text-danger"></i> Giao hàng tận nơi</p>
                        <p  ><i className="fa fa-gift text-danger"></i> Giao hàng tận nơi</p>
                        <p ><i className="fa fa-gift text-danger"></i> Giao hàng tận nơi</p>
                    </div>
                    <Button className="mr-5 btn btn-danger">Mua ngay</Button>
                    <Button onClick={() => addToCart(productDetail)} className="btn btn-outline-danger"> <i className="fa fa-shopping-cart"></i> Thêm vào giỏ</Button>
                </div>
            </div>
            <Tabs
                defaultActiveKey="home"
                id="fill-tab-example"
                className="mb-3 d-flex justify-content-center"
                fill
            >
                <Tab eventKey="home" title="Mô tả sản phẩm">
                  
                </Tab>
                <Tab eventKey="profile" title="Thông số kỹ thuật">
                    <Table striped bordered hover  >
                        <tbody>
                            {
                                Attribute.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.attribute.nameAttribute}</td>
                                            <td>{item.attribute.value}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Tab>

            </Tabs>

        </section> */}
        {/* Shop Detail Start */}
        <div className="container-fluid pb-5">
            <div className="row px-xl-5">
                <div className="col-lg-5 mb-30">
                    {/* Carousel hình ảnh */}
                </div>
                <div className="col-lg-7 h-auto mb-30  ">
                    <div className="h-100 bg-light p-30 p-5 ">
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
                        <h5 className="font-weight-semi-bold  "><del>{convertToVND(productDetail.price)}</del></h5>
                        <h3 className="font-weight-semi-bold mb-4 text-danger">{convertToVND(productDetail.salePrice)}</h3>
                        <div className="d-flex align-items-center mb-4 pt-2">
                            <div className="input-group quantity mr-3" style={{ width: 130 }}>
                                <div className="input-group-btn">
                                    <button className="btn btn-warning btn-minus">
                                        <i className="fa fa-minus" />
                                    </button>
                                </div>
                                <input type="text" className="form-control  border-0 text-center" defaultValue={1} />
                                <div className="input-group-btn">
                                    <button className="btn btn-warning  btn-plus">
                                        <i className="fa fa-plus" />
                                    </button>
                                </div>
                            </div>
                            <button onClick={() => addToCart(productDetail)} className="btn btn-warning px-3"><i className="fa fa-shopping-cart mr-1" />Thêm vào giỏ</button>
                        </div>
                        <div className="d-flex pt-2">
                            <strong className="text-dark mr-2">Chia sẽ:</strong>
                            <div className="d-inline-flex">
                                <a className="text-dark px-2" href="">
                                    <i className="fa  fa-facebook-f" />
                                </a>
                                <a className="text-dark px-2" href="">
                                    <i className="fa  fa-twitter" />
                                </a>
                                <a className="text-dark px-2" href="">
                                    <i className="fa fa-linkedin " />
                                </a>
                                <a className="text-dark px-2" href="">
                                    <i className="fa  fa-pinterest" />
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
                            <a className="nav-item nav-link text-dark active" data-toggle="tab" href="#tab-pane-1">Mô tả</a>
                            <a className="nav-item nav-link text-dark" data-toggle="tab" href="#tab-pane-2">Thông số kỹ thuật</a>
                            <a className="nav-item nav-link text-dark" data-toggle="tab" href="#tab-pane-3">Reviews (0)</a>
                        </div>
                        <div className="tab-content">
                            <div className="tab-pane fade show active" id="tab-pane-1">
                                <h4 className="mb-3">Product Description</h4>
                                <p>Eos no lorem eirmod diam diam, eos elitr et gubergren diam sea. Consetetur vero aliquyam invidunt duo dolores et duo sit. Vero diam ea vero et dolore rebum, dolor rebum eirmod consetetur invidunt sed sed et, lorem duo et eos elitr, sadipscing kasd ipsum rebum diam. Dolore diam stet rebum sed tempor kasd eirmod. Takimata kasd ipsum accusam sadipscing, eos dolores sit no ut diam consetetur duo justo est, sit sanctus diam tempor aliquyam eirmod nonumy rebum dolor accusam, ipsum kasd eos consetetur at sit rebum, diam kasd invidunt tempor lorem, ipsum lorem elitr sanctus eirmod takimata dolor ea invidunt.</p>
                                <p>Dolore magna est eirmod sanctus dolor, amet diam et eirmod et ipsum. Amet dolore tempor consetetur sed lorem dolor sit lorem tempor. Gubergren amet amet labore sadipscing clita clita diam clita. Sea amet et sed ipsum lorem elitr et, amet et labore voluptua sit rebum. Ea erat sed et diam takimata sed justo. Magna takimata justo et amet magna et.</p>
                            </div>
                            <div className="tab-pane fade" id="tab-pane-2">
                                <h4 className="mb-3">Thông số kỹ thuật</h4>
                                <Table striped bordered hover  >
                                    <tbody>
                                        {
                                            Attribute.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{item.attribute.nameAttribute}</td>
                                                        <td>{item.attribute.value}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </div>
                            <div className="tab-pane fade" id="tab-pane-3">
                                <div className="row">
                                    <div className="col-md-6 ">
                                        <h4 className="mb-4">1 review </h4>
                                        <div className="media mb-4">
                                            <img src="img/user.jpg" alt="Image" className="img-fluid mr-3 mt-1" style={{ width: 45 }} />
                                            <div className="media-body">
                                                <h6>John Doe<small> - <i>01 Jan 2045</i></small></h6>
                                                <div className="text-warning mb-2">
                                                    <i className="fa   fa-star" />
                                                    <i className="fa  fa-star" />
                                                    <i className="fa  fa-star" />
                                                    <i className="fa  fa-star-half-alt" />
                                                    <i className="fa  fa-star" />
                                                </div>
                                                <p>Diam amet duo labore stet elitr ea clita ipsum, tempor labore accusam ipsum et no at. Kasd diam tempor rebum magna dolores sed sed eirmod ipsum.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <h4 className="mb-4">Đánh giá</h4>
                                        <small>Email của bạn sẽ không được hiển thị công khai. Các trường bắt buộc được đánh dấu *</small>
                                        <div className="d-flex my-3">
                                            <div className="rating">
                                                <p className="mb-0 mr-2">Đánh giá của bạn *:</p>
                                                <div className="text-warning">
                                                    <input type="range" min={1} max={5} step={1} className="rating-input" id="rating-input" />
                                                    <div className="rating-stars">
                                                        <i className="fa fa-star" />
                                                        <i className="fa fa-star" />
                                                        <i className="fa fa-star" />
                                                        <i className="fa fa-star" />
                                                        <i className="fa fa-star" />
                                                    </div>
                                                </div>
                                                <p id="selected-rating" />
                                            </div>

                                        </div>
                                        <form>
                                            <div className="form-group">
                                                <label htmlFor="message">Nội dung *</label>
                                                <textarea onChange={handleChangeReview} name="content" id="message" cols={30} rows={5} className="form-control" defaultValue={""} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="name">Tên của bạn *</label>
                                                <input onChange={handleChangeReview} name="name" type="text" className="form-control" id="name" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email">Email *</label>
                                                <input onChange={handleChangeReview} name="email" type="email" className="form-control" id="email" />
                                            </div>
                                            <div className="form-group mb-0">
                                                <button onClick={(e)=>handleSubmitReview(e)} type="button" className="btn btn-primary px-3"  >Gửi</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* Shop Detail End */}
    </>);
}

export default ProductsDetail;