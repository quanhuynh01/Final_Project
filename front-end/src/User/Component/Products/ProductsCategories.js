import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import Header from "../Header/Header";
import { Breadcrumb, Button, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";

const ProductsCategories = () => {
    const { id } = useParams();
    const [Products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [NameCate, setNameCate] = useState(null);
    const [selectedBrands, setSelectedBrands] = useState([]); // State để lưu trữ hãng được chọn
    const [FilteredProducts, setFilteredProducts] = useState([]); // Lưu trữ sản phẩm được lọc
    const [Attribute, setAttribute] = useState([]); // Lưu trữ sản phẩm được lọc

    useEffect(() => {
        axios.get(`https://localhost:7201/danh-muc/${id}`)
            .then(res => {
                setProducts(res.data.data);
                setNameCate(res.data.nameCategories);
            });
        axios.get(`https://localhost:7201/api/Brands`)
            .then(res => setBrands(res.data));
        axios.get(`https://localhost:7201/api/Attributes`)
            .then(res => setAttribute(res.data));
        axios.get(`https://localhost:7201/api/Categories`)
            .then(res => setCategories(res.data));
    }, [id]);

    // Convert price to VND
    function convertToVND(price) {
        const priceInVND = price * 1000;
        return priceInVND.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    // Xử lý khi chọn hoặc bỏ chọn hãng
    const handleBrandChange = (e) => {
        const brandId = parseInt(e.target.value); // Lấy id hãng từ sự kiện
        if (e.target.checked) {
            setSelectedBrands([...selectedBrands, brandId]); // Thêm hãng vào danh sách được chọn
        } else {
            const updatedBrands = selectedBrands.filter(id => id !== brandId); // Xóa hãng khỏi danh sách được chọn
            setSelectedBrands(updatedBrands);
        }
    };

    // Lọc sản phẩm theo hãng
    useEffect(() => {
        if (selectedBrands.length > 0) {
            const filteredProducts = Products.filter(item => selectedBrands.includes(item.product.brandId));
            setFilteredProducts(filteredProducts);
        } else {
            setFilteredProducts(Products); // Nếu không có hãng nào được chọn, hiển thị tất cả sản phẩm
        }
    }, [selectedBrands, Products]);
 
    const addToCart = (item) => { 
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];   
        const existingItem = cartItems.find(product => product.sku === item.sku);
    
        if (existingItem) {
            // Nếu sản phẩm đã tồn tại, bạn có thể cập nhật số lượng hoặc thông tin khác của sản phẩm tại đây
            // Ví dụ: cập nhật số lượng
            existingItem.quantity += 1;
        } else {
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm vào mảng cartItems
            cartItems.push({ ...item, quantity: 1 }); // Thêm trường quantity vào để đếm số lượng sản phẩm trong giỏ hàng
        }
    
        // Lưu lại danh sách sản phẩm vào localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
        console.log( existingItem);
    }
    

    return (
        <>
            <Header />
            <Breadcrumb>
                <Breadcrumb.Item className="ml-5" href="/">Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item active>{NameCate}</Breadcrumb.Item>
            </Breadcrumb>
            <div className="d-flex" style={{ width: "90%", margin: "auto" }}>
                <div className="left card p-4" style={{ width: "25%", marginTop: "10px" }}>
                    <h5>Theo hãng</h5>
                    <Form>
                        {brands.map((b, index) => (
                            <Form.Check
                                key={index}
                                type="checkbox"
                                label={b.brandName}
                                value={b.id}
                                onChange={handleBrandChange}
                                checked={selectedBrands.includes(b.id)} // Đánh dấu hãng đã được chọn
                            />
                        ))}
                    </Form>
                    <h5>Theo thuộc tính</h5>
                    <Form>
                        {Attribute.map((a, index) => (
                            <Form.Check
                                key={index}
                                type="checkbox"
                                label={a.value}
                                value={a.id}
                            />
                        ))}
                    </Form>
                </div>
                <div className="right d-flex" style={{ width: "75%" }}>
                    {FilteredProducts.map((item, index) => (
                        <div key={index}>
                            <Card className='card-item' style={{ width: '17.5rem', margin: '10px' }}>
                                <Card.Img variant="top" src={`https://localhost:7201${item.product.avatar}`} alt='' />
                                <Card.Body style={{ position: "relative" }}>
                                    <Link key={item.product.id} to={`/chi-tiet-san-pham/${item.product.id}`}>
                                        <div className='d-flex' style={{ justifyContent: "space-between" }}>
                                            <Card.Text>Mã SP:{item.product.sku}</Card.Text>
                                            <Card.Text className={item.product.stock > 0 ? 'text-success' : 'text-danger'}>
                                                {item.product.stock > 0 ? <><i className='fa fa-check'></i> Còn hàng</> : "Hết hàng"}
                                            </Card.Text>
                                        </div>
                                        <Card.Title style={{ height: '3rem', overflow: "hidden" }}>
                                            {item.product.productName}
                                        </Card.Title>
                                        <Card.Text>Giá: {convertToVND(item.product.price)}</Card.Text>
                                    </Link>
                                </Card.Body>
                                <div style={{ display: "flex", justifyContent: "flex-end", position: "absolute", bottom: "10px", right: "20px" }}>
                                    <Button onClick={()=>addToCart(item.product)} variant="primary"><i className="fa fa-shopping-cart"></i></Button>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProductsCategories;
