import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import Header from "../Header/Header";
import { Breadcrumb, Button, Card, Form, Modal, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import {jwtDecode} from "jwt-decode";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import './ProductsCategories.css'
const ProductsCategories = () => {
    const { id } = useParams();
    const [Products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [NameCate, setNameCate] = useState(null);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [FilteredProducts, setFilteredProducts] = useState([]);
    const [Attribute, setAttribute] = useState([]);
    const [User, setUser] = useState(null);
    const [selectedValues, setSelectedValues] = useState([]);
    const [show, setShowLogin] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 10000000]); // Khoảng giá mặc định

    const handleCloseLogin = () => setShowLogin(false);
    const handleShowLogin = () => setShowLogin(true);

 

    useEffect(() => {
        axios.get(`https://localhost:7201/danh-muc/${id}`)
            .then(res => {
                setProducts(res.data.data);
                setNameCate(res.data.nameCategories);
                setAttribute(res.data.attributeValue);
            });
        axios.get(`https://localhost:7201/api/Brands`)
            .then(res => setBrands(res.data));
    }, [id]); 
    useEffect(() => {
        let token = localStorage.getItem('token');
        if (token != null) {
            const decode = jwtDecode(token);
            const userId = decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            setUser(userId);
        }
    }, []);

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
        } else {
            handleShowLogin(true);
        }
    }; 
    function convertToVND(price) {
        const priceInVND = price * 1000;
        return priceInVND.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    const handleBrandChange = (e) => {
        const brandId = parseInt(e.target.value);
        if (e.target.checked) {
            setSelectedBrands([...selectedBrands, brandId]);
        } else {
            const updatedBrands = selectedBrands.filter(id => id !== brandId);
            setSelectedBrands(updatedBrands);
        }
    }; 
    useEffect(() => {
        filterProducts();
    }, [selectedBrands, selectedValues, priceRange, Products]);

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

    const handlePriceChange = (e) => { 
        setPriceRange([0, e.target.value]);
    };

    // hàm lọc dữ liệu
    const filterProducts = () => {
        let filteredProducts = Products; 
        if (selectedBrands.length > 0) {
            filteredProducts = filteredProducts.filter(item => selectedBrands.includes(item.product.brandId));
        } 
        if (selectedValues.length > 0) {
            filteredProducts = filteredProducts.filter(product => {
                return selectedValues.every(selectedId => {
                    return product.attributes.some(attr => attr.attributeValue.idvalue === parseInt(selectedId));
                });
            });
        } 
        filteredProducts = filteredProducts.filter(item => item.product.price <= priceRange[1]); 
        setFilteredProducts(filteredProducts);
    };

    //phân trang 
    const iteminPage =10; // số lượng phần tử mỗi trang
    const [currentPage, setcurrentPage] = useState(0);
    const offset = currentPage * iteminPage;
    const currentItem = FilteredProducts.slice(offset, offset + iteminPage);
    const pageCount = Math.ceil(FilteredProducts.length / iteminPage); 
    const handlePageclick = (e)=>{ 
        setcurrentPage(e.selected);
    } 
    return (
        <>
            <Header />
            <Navbar />
            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="col-12">
                        <nav className="breadcrumb bg-light mb-30">
                            <Link to={'/'} className="breadcrumb-item text-dark" >Trang chủ</Link>
                            <span className="breadcrumb-item active">{NameCate}</span>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="d-flex" style={{ width: "90%", margin: "auto" }}>
                <div className="left card p-4" style={{ width: "25%", marginTop: "10px" }}>
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
                        <input
                            type="range"
                            min="0"
                            max="50000000"
                            step="100000"
                            value={priceRange[1]}
                            onChange={handlePriceChange}
                        />
                        <p>Giá tối đa: {convertToVND(priceRange[1] / 1000)}</p>
                    </Form>
                    <h5 className="mt-2"><b>Thuộc tính</b></h5>
                    <Form>
                        {Attribute.map((attributeItem, index) => (
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
                <div className="right d-flex" style={{ width: "75%" ,flexWrap:"wrap"}}>
                    {currentItem.map((item, index) => ( 
                        <div key={index}>
                            <Card className='card-item' style={{ width: '17.5rem', margin: '10px' }}>
                                <Card.Img variant="top" src={`https://localhost:7201${item.product.avatar}`} alt='' />
                                <Card.Body style={{ position: "relative" }}>
                                    <Link key={item.product.id} to={`/chi-tiet-san-pham/${item.product.id}`}>
                                        <div className='d-flex' style={{ justifyContent: "space-between" }}>
                                            <Card.Text>SKU :{item.product.sku}</Card.Text>
                                            <Card.Text className={item.product.stock > 0 ? 'text-success' : 'text-danger'}>
                                                {item.product.stock > 0 ? <><i className='fa fa-check'></i>In stock</> : "Out stock"}
                                            </Card.Text>
                                        </div>
                                        <Card.Title style={{ height: '3rem', overflow: "hidden" }}>
                                            {item.product.productName}
                                        </Card.Title>
                                        <Card.Text>Price: {convertToVND(item.product.price)}</Card.Text>
                                    </Link>
                                </Card.Body>
                                <div style={{ display: "flex", justifyContent: "flex-end", position: "absolute", bottom: "10px", right: "20px" }}> 
                                    <Button onClick={() => addToCart(item.product)} variant="primary"><i className="fa fa-shopping-cart"></i></Button>
                                </div>
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
                onPageChange={handlePageclick}
                containerClassName={'pagination '}
                activeClassName={'active'}
            />
            <Modal show={show} onHide={handleCloseLogin} centered>
                <div className='row justify-content-center mt-4'>
                    <h1 className='text-danger'>QT Member</h1>
                </div>
                <Modal.Body>
                    <div className='row justify-content-center'>
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
