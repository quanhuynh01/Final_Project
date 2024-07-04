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
    const [brands, setBrands] = useState([]);
    const [NameCate, setNameCate] = useState(null);
    const [selectedBrands, setSelectedBrands] = useState([]); // State để lưu trữ hãng được chọn
    const [FilteredProducts, setFilteredProducts] = useState([]); // Lưu trữ sản phẩm được lọc
    const [Attribute, setAttribute] = useState([]); // view danh sách thuộc tính cho người dùng lọc

    const [selectedValues, setSelectedValues] = useState([]);//  thuộc tính người dùng chọn
    useEffect(() => {
        axios.get(`https://localhost:7201/danh-muc/${id}`)
            .then(res => {
                 //console.log(res.data.data);
                setProducts(res.data.data);
                setNameCate(res.data.nameCategories);
                setAttribute(res.data.attributeValue);
            });
        axios.get(`https://localhost:7201/api/Brands`)
            .then(res => setBrands(res.data)); 
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
        } 
        else {
            setFilteredProducts(Products); // Nếu không có hãng nào được chọn, hiển thị tất cả sản phẩm
        }
    }, [selectedBrands, Products]);
 
    //lọc sản phẩm theo thuộc tính
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
   // console.log(Products);
    const filteredProducts = Products.filter(product => {
        return selectedValues.every(selectedId => {
            const a = product.attributes.map(attr =>  
                attr.attributeValue.idvalue === selectedId
             )
            
        });
    });
    
    console.log(filteredProducts);
   // console.log(selectedValues);
    // const addToCart = (item) => {  
    // }


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
                        {Attribute.map((attributeItem, index) => (
                            <div key={index}>
                                <label>{attributeItem.nameAttribute}</label>
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
                                    <Button variant="primary"><i className="fa fa-shopping-cart"></i></Button>
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
