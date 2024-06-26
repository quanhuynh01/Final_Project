import { useEffect, useState } from "react";
import { Breadcrumb, Button, Form, FormControl, FormLabel, Table } from "react-bootstrap";
import Header from "../Header/Header";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import Swal from "sweetalert2";

const Cart = () => {
    const navigate = useNavigate();
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
            Carts: cart
        };


        axios.post('https://localhost:7201/api/Orders/addOrder', orderData)
            .then(response => {
                console.log(response.data);
                if (response.status === 200) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Đặt hành thành công",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    navigate("/tai-khoan#orders-tab");
                }
            })
            .catch(error => {
                alert(error.response.data.message)
                //console.error('There was an error placing the order!', error);
            });
    };
    const handleDelete = (id) => {
        axios.delete(`https://localhost:7201/api/Carts/${id}`).then(res => {
            console.log(res);
            if (res.status === 204) {
                alert("Xóa sản phẩm ra khỏi giỏ hàng thành công");
                window.location.reload();
            }
        }
        )
    }
    return (
        <>
            <Header />
            {/* Breadcrumb Start */}
            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="col-12">
                        <nav className="breadcrumb bg-light mb-30">
                            <a className="breadcrumb-item text-dark" href="/">Trang chủ</a>
                            <span className="breadcrumb-item active">Giỏ hàng</span>
                        </nav>
                    </div>
                </div>
            </div>
            {/* Breadcrumb End */}

            {cart.length === 0 ? (
                <h3 className="text-center mt-3">Giỏ hàng của bạn trống</h3>
            ) : (<>
                {/* Cart Start */}
                <div className="container-fluid ">
                    <div className="row ">
                        <div className="col-lg-7 table-responsive mb-5 card p-2">
                            <table className="table table-light table-borderless table-hover text-center mb-0">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Remove</th>
                                    </tr>
                                </thead>
                                <tbody className="align-middle">
                                    {
                                        cart.map((item, index) => {
                                            return (<tr key={index}><td className="align-middle"><img src={`https://localhost:7201/${item.product.avatar}`} alt={item.product.productName} style={{ width: 50 }} /> {item.product.productName}</td>
                                                <td className="align-middle">
                                                    <div className="input-group quantity mx-auto" style={{ width: 100 }}>
                                                        <div className="input-group-btn">
                                                            <button className="btn btn-sm btn-warning btn-minus">
                                                                <i className="fa fa-minus" />
                                                            </button>
                                                        </div>
                                                        <input type="text" readOnly className="form-control form-control-sm   border-0 text-center" value={item.quantity} />
                                                        <div className="input-group-btn">
                                                            <button className="btn btn-sm btn-warning btn-plus">
                                                                <i className="fa fa-plus" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="align-middle">{convertToVND(item.product.salePrice)} </td>
                                                <td className="align-middle"><button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-danger"><i className="fa fa-times" /></button></td>
                                            </tr>)
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="col-lg-5 c">
                            <h5 className="section-title position-relative text-uppercase mb-3 "><span className="  pr-3">Thông tin giao hàng</span></h5>
                            <div className="bg-light p-30 mb-5">
                                <div className="border-bottom pb-2">
                                    <Form.Group className="card p-3">
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
                                <div className="pt-2">
                                    <div className="d-flex justify-content-between mt-2">
                                        <h5>Tổng giá</h5>
                                        <h5>{convertToVND(calculateTotalPrice())}</h5>
                                    </div>
                                    <button onClick={handleSuccess} type="button" className="   btn btn-block btn-warning font-weight-bold my-3 py-3">Đặt hàng</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Cart End */}
            </>
            )}



        </>
    );
};

export default Cart;
