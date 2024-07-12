import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Table, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import Footer from "../Footer/Footer";

const WistList = () => {
    const [IdUser, setIdUser] = useState(null);
    const [LsWistList, setLsWistList] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        const jwt = localStorage.getItem('token'); // Lấy mã JWT từ localStorage
        if (jwt) {
            const decodedJwt = jwtDecode(jwt); // sử dụng thư viện jwtDecode để giải mã JWT
            const userId = decodedJwt["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            setIdUser(userId);
            axios.get(`https://localhost:7201/api/WistLists/wistListUser/${userId}`).then(res => {
                setLsWistList(res.data);
            });
        }
    }, []);


    const handleSelectProduct = (productId) => {
        const isSelected = selectedProducts.includes(productId);
        if (isSelected) {
            setSelectedProducts(selectedProducts.filter(id => id !== productId));
        } else {
            setSelectedProducts([...selectedProducts, productId]);
        }
    };

    const addToCart = (item) => {
        if (item !== null && IdUser !== null) {
            axios.post(`https://localhost:7201/api/Carts/addToCart/${IdUser}?ProductId=${item.id}`)
                .then(res => {
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
        }
    };

    function convertToVND(price) {
        const priceInVND = price * 1000;
        return priceInVND.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    const handleDeleteSelected = () => {
        if (selectedProducts.length === 0) {
            return;
        }
        // Gọi API để xóa các sản phẩm đã chọn
        axios.delete(`https://localhost:7201/api/WistLists/deleteProducts/${IdUser}`, {
            data: { productIds: selectedProducts }
        })
            .then(res => {
                // Xóa thành công, cập nhật lại danh sách sản phẩm yêu thích
                setLsWistList(prevList => prevList.filter(item => !selectedProducts.includes(item.product.id)));
                setSelectedProducts([]);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Đã xóa các sản phẩm đã chọn",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch(error => {
                console.error("Error deleting products:", error);
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Xảy ra lỗi khi xóa sản phẩm",
                    showConfirmButton: false,
                    timer: 1500
                });
            });
    };

    return (
        <>
            <Header />
            <Navbar />
            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="col-12">
                        <nav className="breadcrumb bg-light mb-30">
                            <Link to={`/`} className="breadcrumb-item text-dark">Trang chủ</Link>
                            <span className="breadcrumb-item active">Sản phẩm yêu thích</span>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="container">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={selectedProducts.length === LsWistList.length && LsWistList.length > 0}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            const productIds = LsWistList.map(item => item.product.id);
                                            setSelectedProducts(productIds);
                                        } else {
                                            setSelectedProducts([]);
                                        }
                                    }}
                                />
                            </th>
                            <th>Hình ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>SKU</th>
                            <th>Trạng thái</th>
                            <th>Giá</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {LsWistList.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.includes(item.product.id)}
                                        onChange={() => handleSelectProduct(item.product.id)}
                                    />
                                </td>
                                <td><img src={`https://localhost:7201${item.product.avatar}`} alt={item.product.productName} style={{ width: "50px", height: "50px" }} /></td>
                                <td><Link to={`/chi-tiet-san-pham/${item.product.id}`}>{item.product.productName}</Link></td>
                                <td>{item.product.sku}</td>
                                <td className={item.product.stock > 0 ? 'text-success' : 'text-danger'}>
                                    {item.product.stock > 0 ? 'In stock' : 'Out of stock'}
                                </td>
                                <td>{convertToVND(item.product.salePrice)}</td>
                                <td>
                                    <Button onClick={() => addToCart(item.product)} variant="primary"><i className="fa fa-shopping-cart"></i> Add to Cart</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="7">
                                {selectedProducts.length > 0 && (
                                    <>
                                        <Button onClick={handleDeleteSelected} variant="danger">Xóa các sản phẩm đã chọn</Button>
                                        {/* Nút mua sản phẩm */}
                                        <Button variant="success" className="ml-2">Mua các sản phẩm đã chọn</Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    </tfoot>

                </Table>
            </div>
            <Footer />
        </>
    );
};

export default WistList;
