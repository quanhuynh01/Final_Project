import { useEffect, useState } from "react";
import { Breadcrumb, Button, Form, Table } from "react-bootstrap";
import Header from "../Header/Header";

const Cart = () => {
    const [cart, setCart] = useState([]);
    // Lấy giỏ hàng từ localStorage khi component được render
    useEffect(() => {
        const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(cartItems);
    }, []);

    // Hàm để đếm số lượng các sản phẩm có cùng id
    const countDuplicates = (productId) => {
        return cart.reduce((count, current) => {
            return current.id === productId ? count + 1 : count;
        }, 0);
    };

    // Xử lý để chỉ hiển thị mỗi sản phẩm một lần dựa trên id
    const uniqueCart = cart.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, []);

    // Hàm xử lý khi nhấn nút Xóa sản phẩm khỏi giỏ hàng
    const removeFromCart = (productId) => {
        const updatedCart = cart.filter(item => item.id !== productId);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Hàm chuyển đổi giá sản phẩm sang định dạng tiền tệ Việt Nam
    const convertToVND = (price) => {
        const priceInVND = price * 1000;
        return priceInVND.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    return (<>
        <Header />
        <Breadcrumb>
            <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
            <Breadcrumb.Item active>Giỏ hàng</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-center mt-3 mb-4">Giỏ hàng của bạn</h1>
        <div className="row border bg-light" style={{ justifyContent: "center", width: "95%", margin: "auto" }}>

            <div className="col-6 ">
                <h2 className="text-center mb-4 mt-5">Thông tin giao hàng</h2>
                <Form.Group className="card p-5">
                    <div className="row">
                        <div className="col-6">
                            <Form.Label>Tên người nhận</Form.Label>
                            <Form.Control type="text" placeholder="Nhập tên người nhận"></Form.Control>
                        </div>
                        <div className="col-6 ">
                            <Form.Label>Số điện thoại người nhận</Form.Label>
                            <Form.Control type="text" placeholder="Nhập số điện thoại người nhận"></Form.Control>
                        </div>
                        <div className="col-12">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="Email" placeholder="Nhập Email"></Form.Control>
                        </div>
                        <div className="col-12">
                            <Form.Label>Nhập địa chỉ giao hàng</Form.Label>
                            <Form.Control type="text" placeholder="Nhập địa chỉ giao hàng"></Form.Control>
                        </div>
                    </div>
                </Form.Group>
               
            </div>
            <div className=" col-6">
                <h2 className="mb-4 mt-5 text-center">Thông tin giỏ hàng</h2>
                {cart.length === 0 ? (
                    <p>Giỏ hàng của bạn trống.</p>
                ) : (
                    <Table striped bordered hover variant="light">
                        <thead>
                            <tr><th>Mã sản phẩm</th>
                                <th>Tên sản phẩm</th>
                                <th>Hình ảnh</th>
                                <th>Số lượng</th>
                                <th>Tổng giá </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {uniqueCart.map((item, index) => (
                                <tr key={index}><td>{item.sku}</td>
                                    <td>
                                        <div> {item.productName}</div>
                                        <div>Giá: {convertToVND(item.salePrice)}</div>
                                    </td>
                                    <td>
                                        <div>
                                            <img src={`https://localhost:7201/${item.avatar}`} alt="Avatar" />
                                        </div>
                                    </td>
                                    <td>
                                        <input
                                            className="w-100 form-control"
                                            readOnly
                                            value={countDuplicates(item.id)}
                                        />
                                    </td>
                                    <td>{convertToVND(item.salePrice * countDuplicates(item.id))}</td>

                                    <td>
                                        <button className="btn btn-danger" onClick={() => removeFromCart(item.id)}>
                                            <i className="fa fa-trash"></i> Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
            <div className="p-3">
                <Button type="submit">Đặt hàng</Button>
            </div>
        </div>
    </>
    );
};

export default Cart;
