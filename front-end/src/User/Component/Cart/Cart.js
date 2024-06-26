import { useEffect, useState } from "react";
import { Breadcrumb, Button, Form, FormControl, FormLabel, Table } from "react-bootstrap";
import Header from "../Header/Header";
import { Link } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from 'jwt-decode';

const Cart = () => {
    const [IdUser, setIdUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [User, setUser] = useState({
        fullName: "",
        email: "",
        phoneNumber: ""
    });
    const [AddressShipping, setAddressShipping] = useState("");

    useEffect(() => {
        const jwt = localStorage.getItem('token'); // Lấy mã JWT từ localStorage
        if (jwt) {
            const decodedJwt = jwtDecode(jwt); // sử dụng thư viện jwtDecode để giải mã JWT
            const userId = decodedJwt["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            setIdUser(userId);
            axios.get(`https://localhost:7201/api/Carts/getCart/${userId}`).then(res => setCart(res.data));
            axios.get(`https://localhost:7201/api/Users/${userId}`).then(res => setUser(res.data));
        }
    }, []);
 
 
    const removeFromCart = (productId) => {
        const updatedCart = cart.filter(item => item.id !== productId);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const convertToVND = (price) => {
        const priceInVND = price * 1000;
        return priceInVND.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => {
            return total + item.product.salePrice * item.quantity;
        }, 0);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...User,
            [name]: value
        });
    };

    const handleAddressChange = (e) => {
        setAddressShipping(e.target.value);
    };

    const handleSuccess = (e) => {
        e.preventDefault();
        const orderData = {
            UserId: IdUser,
            User: User,
            ShippingAdress: AddressShipping,
            PhoneShip: User.phoneNumber,
            DateShip: new Date().toISOString(),
            TotalMoney: calculateTotalPrice(),
            OrderDetails: cart.map(item => ({
                ProductId: item.product.id,
                Amount: item.quantity,
                TotalMoney: (item.product.salePrice * item.quantity).toString() // Chuyển TotalMoney thành string
            })),
            Carts : cart
        };
        

        axios.post('https://localhost:7201/api/Orders/addOrder', orderData)
            .then(response => {
                //console.log(response.data);
                // Xử lý sau khi đặt hàng thành công (ví dụ: điều hướng đến trang xác nhận đơn hàng)
            })
            .catch(error => {
                alert(error.response.data.message)
                //console.error('There was an error placing the order!', error);
            });
    };

    
    return (
        <>
            <Header />
            <Breadcrumb>
                <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item active>Giỏ hàng</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-center mt-3 mb-4">Giỏ hàng của bạn</h1>
            <div className="row border bg-light" style={{ justifyContent: "center", width: "95%", margin: "auto" }}>
                 {cart.length === 0 ? (
                        <p> </p>
                    ) : (<>
                        <div className="col-6 ">
                    <h2 className="text-center mb-4 mt-5">Thông tin giao hàng</h2>
                    <Form.Group className="card p-5">
                        <div className="row">
                            <div className="col-6">
                                <Form.Label>Tên người nhận</Form.Label>
                                <Form.Control
                                    name="fullName"
                                    value={User.fullName}
                                    type="text"
                                    placeholder="Nhập tên người nhận"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-6">
                                <Form.Label>Số điện thoại người nhận</Form.Label>
                                <Form.Control
                                    name="phoneNumber"
                                    value={User.phoneNumber}
                                    type="text"
                                    placeholder="Nhập số điện thoại người nhận"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-12">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    name="email"
                                    value={User.email}
                                    type="Email"
                                    placeholder="Nhập Email"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-12">
                                <Form.Label>Nhập địa chỉ giao hàng</Form.Label>
                                <Form.Control
                                    name="addressShipping"
                                    value={AddressShipping}
                                    type="text"
                                    placeholder="Nhập địa chỉ giao hàng"
                                    onChange={handleAddressChange}
                                />
                            </div>
                        </div>
                    </Form.Group>
                </div>
                    </>  
                    )}
              
                <div className=" col-6">
                    <h2 className="mb-4 mt-5 text-center">Thông tin giỏ hàng</h2>
                    {cart.length === 0 ? (
                        <>
                         <p className="text-center">Giỏ hàng của bạn trống.</p>
                         <Link className="text-primary d-flex justify-content-center" to={"/"}>Mua hàng</Link>
                        </>
                       
                    ) : (
                        <Table striped bordered hover variant="light">
                            <thead>
                                <tr>
                                    <th>Mã sản phẩm</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Giá</th>
                                    <th>Số lượng</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.product.sku}</td>
                                        <td>
                                            <Link to={`/chi-tiet-san-pham/${item.product.id}`}>
                                                <div className="d-flex">
                                                    <img style={{ width: "75px", height: "70px" }} src={`https://localhost:7201${item.product.avatar}`} alt="Avatar" />
                                                    <p className="ml-2">{item.product.productName}</p>
                                                </div>
                                            </Link>
                                        </td>
                                        <td>{convertToVND(item.product.salePrice)}</td>
                                        <td>{item.quantity}</td>
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
                    
                    {cart.length === 0 ? (
                        <p> </p>
                    ) : (<>
                     <Form className="">
                        <div className="row">
                            <FormLabel className="col-2">Mã giảm giá</FormLabel>
                            <FormControl className="col-8" placeholder="Nhập mã giảm giá"></FormControl>
                            <Button className="col-2">Áp mã</Button>
                        </div>
                    </Form>
                    <h5 className="mt-2">Tổng giá: {convertToVND(calculateTotalPrice())}</h5>
                    </>  
                    )}
                    
                </div>
                {cart.length === 0 ? (
                        <p> </p>
                    ) : (<>
                     <div className="p-3">
                    <Button type="submit" onClick={handleSuccess}>Đặt hàng</Button>
                </div>
                    </>  
                    )}
               
            </div>

                    

        </>
    );
};

export default Cart;
