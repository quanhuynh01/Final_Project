import { useParams } from "react-router";
import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";
import { Button, Card } from "react-bootstrap";

const ProductAttribute = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [NameValue, setNameValue] = useState(null);
    // Convert price to VND
    function convertToVND(price) {
        const priceInVND = price * 1000;
        return priceInVND.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    useEffect(() => {
        if (id) {
            axios.get(`https://localhost:7201/AttributeId/${id}`)
                .then(res => {
                    //   console.log("API response:", res.data); // Kiểm tra dữ liệu trả về từ API
                    setProducts(res.data);
                  
                })
                .catch(error => {
                    console.error('Error fetching product attributes:', error);
                });
        }
    }, [id]);  
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
            <div className=" "style={{ width: "90%", margin: "auto" }}s>
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
                                        <Button variant="primary"><i className="fa fa-shopping-cart"></i></Button>
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
        </>
    );
}

export default ProductAttribute;
