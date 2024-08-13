import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Breadcrumb, Button, Card, Form, Modal } from "react-bootstrap";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import {jwtDecode} from "jwt-decode";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import './ProductsCategories.css';
import { PanelMenu } from "primereact/panelmenu";

const ProductsCategories = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [nameCate, setNameCate] = useState(null);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [user, setUser] = useState(null);
    const [selectedValues, setSelectedValues] = useState([]);
    const [showLogin, setShowLogin] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    const handleCloseLogin = () => setShowLogin(false);
    const handleShowLogin = () => setShowLogin(true);

    useEffect(() => {
        axios.get(`https://localhost:7201/danh-muc/${id}`)
            .then(res => {
                setProducts(res.data.data);
                setNameCate(res.data.nameCategories);
                setAttributes(res.data.attributeValue);
            }).catch(ex=>{navigate("/not-found")});
        axios.get(`https://localhost:7201/api/Brands`)
            .then(res => setBrands(res.data));
    }, [id]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            setUser(userId);
        }
    }, []);

    const addToCart = (item) => {
        if (item && user) {
            axios.post(`https://localhost:7201/api/Carts/addToCart/${user}?ProductId=${item.id}`)
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
        } else {
            handleShowLogin();
        }
    };

    const convertToVND = (price) => {
        const priceInVND = price * 1000;
        return priceInVND.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const handleBrandChange = (e) => {
        const brandId = parseInt(e.target.value);
        if (e.target.checked) {
            setSelectedBrands([...selectedBrands, brandId]);
        } else {
            const updatedBrands = selectedBrands.filter(id => id !== brandId);
            setSelectedBrands(updatedBrands);
        }
    };

    const handleValueChange = (e) => {
        const valueId = e.target.value;
        setSelectedValues((prevSelectedValues) => {
            if (e.target.checked) {
                return [...prevSelectedValues, valueId];
            } else {
                return prevSelectedValues.filter(id => id !== valueId);
            }
        });
    };

    const handleMinPriceChange = (e) => {
        setPriceRange([parseInt(e.target.value), priceRange[1]]);
    };

    const handleMaxPriceChange = (e) => {
        setPriceRange([priceRange[0], parseInt(e.target.value)]);
    };

    useEffect(() => {
        filterProducts();
    }, [selectedBrands, selectedValues, priceRange, products]);

    const filterProducts = () => {
        let filtered = products;
        console.log(filtered);
        if (selectedBrands.length > 0) {
            filtered = filtered.filter(item => item.product && selectedBrands.includes(item.product.brandId));
        }
        if (selectedValues.length > 0) {
            filtered = filtered.filter(product => product.product && selectedValues.every(selectedId => {
                return product.attributes.some(attr => attr.attributeValue.idvalue === parseInt(selectedId));
            }));
        }
        filtered = filtered.filter(item => item.product && item.product.price >= priceRange[0] && item.product.price <= priceRange[1]);
        setFilteredProducts(filtered);
    };

    const offset = currentPage * itemsPerPage;
    const currentItems = filteredProducts.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

    const handlePageClick = (e) => {
        setCurrentPage(e.selected);
    };

    //hãng
    const items = [
        {
            label: 'Lọc theo hãng',
            icon: 'pi pi-desktop',
            items: brands.map((item) => ({
                label: item.brandName,
                command: () => {
                    const updatedSelectedBrands = selectedBrands.includes(item.id)
                        ? selectedBrands.filter((id) => id !== item.id)
                        : [...selectedBrands, item.id];
                    setSelectedBrands(updatedSelectedBrands);
                },
            })),
        },
    ];
    return (
        <>
            <Header />
            <Navbar />
            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="col-12">
                        <nav className="breadcrumb bg-light mb-30">
                            <Link to={'/'} className="breadcrumb-item text-dark">Trang chủ</Link>
                            <span className="breadcrumb-item active">{nameCate}</span>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="d-flex" style={{ width: "90%", margin: "auto" }}>
                <div className="left card p-4" style={{ width: "25%", marginTop: "10px" }}>

                    {/* <PanelMenu model={items} className="w-full md:w-20rem" /> */}
                    <h5><b>Thương hiệu</b></h5>
                    <Form>
                        {brands.map((b, index) => (
                            <Form.Check
                                key={index}
                                type="checkbox"
                                label={b.brandName}
                                value={b.id}
                                onChange={handleBrandChange}
                                checked={selectedBrands.includes(b.id)}
                            />
                        ))}
                    </Form>
                    <h5 className="mt-2"><b>Giá</b></h5>
                    <Form>
                        <Form.Group>
                            <Form.Label>Giá tối thiểu</Form.Label>
                            <Form.Control
                                type="number"
                                value={priceRange[0]}
                                onChange={handleMinPriceChange}
                                min="0"
                                step="100"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Giá tối đa</Form.Label>
                            <Form.Control
                                type="number"
                                value={priceRange[1]}
                                onChange={handleMaxPriceChange}
                                      min="0"
                                max="10000000"
                                step="100"
                            />
                        </Form.Group>
                        <p>Khoảng giá: {convertToVND(priceRange[0])} - {convertToVND(priceRange[1] )}</p>
                    </Form>
                    <h5 className="mt-2"><b>Thuộc tính</b></h5>
                    <Form>
                        {attributes.map((attributeItem, index) => (
                            <div key={index}>
                                <label><b>{attributeItem.nameAttribute}</b></label>
                                {attributeItem.attributeValues.map((value, idx) => (
                                    <Form.Check
                                        key={idx}
                                        type="checkbox"
                                        label={value.nameValue}
                                        value={value.id}
                                        onChange={(e) => handleValueChange(e)}
                                    />
                                ))}
                            </div>
                        ))}
                    </Form>
                </div>
                <div className="right d-flex" style={{ width: "75%", flexWrap: "wrap" }}>
                    {currentItems.map((item, index) => (
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
                                        {
                                        item.product.salePrice !== item.product.price && item.product.salePrice !== null ? (
                                            <div className="d-flex text-danger"  >
                                                  Giá: { convertToVND(Math.ceil(item.product.price * (1 - item.product.salePrice / 100)))} <del className="text-dark">{convertToVND(item.product.price)}</del>
                                            </div>
                                        ) : (
                                                    item.product.price > 0 ? (
                                                        <Card.Text className='text-dark'> Giá:{convertToVND(item.product.price)}</Card.Text>
                                                    ) : (
                                                      <p className="text-danger">Liên hệ</p>
                                                    )

                                        )}
                                    </Link>
                                    <Button
                                        onClick={() => addToCart(item.product)}
                                        className='position-absolute'
                                        variant="outline-warning"
                                        style={{ bottom: '10px', right: '10px' }}
                                    >
                                        <i className='fa fa-shopping-cart'></i>
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
            <ReactPaginate
                previousLabel={'Trở về'}
                nextLabel={'Tiếp theo'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
            />
            <Modal show={showLogin} onHide={handleCloseLogin} centered>
                <div className='row justify-content-center mt-4'>
                    <h1 className='text-danger'>QT Member</h1>
                </div>
                <Modal.Body>
                    <div class='row justify-content-center'>
                        <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:80/q:90/plain/https://cellphones.com.vn/media/wysiwyg/chibi2.png" height={80} alt="cps-smember-icon" />
                    </div>
                    <div className='mt-3'>
                        <h6 style={{ textAlign: 'center' }}>Vui lòng đăng nhập tài khoản QT member để xem ưu đãi và thanh toán dễ dàng hơn.</h6>
                    </div>
                </Modal.Body>
                <div className='row justify-content-center p-2'>
                    <Link to={`/register`} className='m-2 btn btn-outline-primary'>
                        Đăng ký
                    </Link>
                    <Link to={`/login`} className='m-2 btn btn-warning'>
                        Đăng nhập
                    </Link>
                </div>
            </Modal>
            <Footer />
        </>
    );
};

export default ProductsCategories;
