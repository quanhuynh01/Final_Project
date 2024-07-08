import { useEffect, useState } from "react";
import { Breadcrumb, Button, Form, FormControl, FormLabel, Table } from "react-bootstrap";
import Header from "../Header/Header";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import Swal from "sweetalert2";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

const Cart = () => {
    const navigate = useNavigate();
    const [IdUser, setIdUser] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(1);
    const [cart, setCart] = useState([]);
    const [updatingCart, setUpdatingCart] = useState(true);
    const [User, setUser] = useState({
        fullName: "",
        email: "",
        phoneNumber: ""
    });

    const [AddressShipping, setAddressShipping] = useState("");

    useEffect(() => {
        setUpdatingCart(false);
        const jwt = localStorage.getItem('token'); // Lấy mã JWT từ localStorage
        if (jwt) {
            const decodedJwt = jwtDecode(jwt); // sử dụng thư viện jwtDecode để giải mã JWT
            const userId = decodedJwt["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            setIdUser(userId);
            axios.get(`https://localhost:7201/api/Carts/getCart/${userId}`).then(res => setCart(res.data));
            axios.get(`https://localhost:7201/api/Users/${userId}`).then(res => setUser(res.data));
        }
    }, []); 
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
    function generateOrderCode() {
        const timestamp = new Date().getTime().toString();
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `ORD-${timestamp.slice(-6)}-${randomNum}`;
    }
    const handleSuccess = (e) => {
        e.preventDefault();
        if (paymentMethod === 1) {
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
                Code: generateOrderCode(),
                Carts: cart
            };
            axios.post('https://localhost:7201/api/Orders/addOrder', orderData)
                .then(response => {
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
                    console.error('There was an error placing the order!', error);
                });
        }
        if (paymentMethod === 2) {
            const PaymentInfor = {
                OrderType: "Thanh toán",
                Amount: calculateTotalPrice() * 100,
                OrderDescription: "Thanh toán VNPAY",
                Name: User.fullName
            }
            if (PaymentInfor !== null) { 
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
                    Code: generateOrderCode(),
                    Carts: cart
                };
                if(orderData.ShippingAdress !=="")
                { 
                    axios.post('https://localhost:7201/api/Orders/addOrder', orderData)
                    .then(response => {
                        console.log(response);
                        if (response.status === 200) {
                            localStorage.setItem("idOrder",response.data.idOrder);
                            axios.post(`https://localhost:7201/api/Pays`, PaymentInfor).then(res => {
                                console.log(res.data);
                                window.location.href = res.data;
                              }
                            );
                        }
                    })
                    .catch(error => {
                        console.error('There was an error placing the order!', error);
                    });

                }
                else{
                    alert("Nhập địa chỉ giao hàng");
                }
              
            }
        }

    };
    const handleDelete = (id) => {
        axios.delete(`https://localhost:7201/api/Carts/${id}`).then(res => {
            console.log(res);
            if (res.status === 200) {
                alert("Xóa sản phẩm ra khỏi giỏ hàng thành công");
                //window.location.reload();
                setCart(cart.filter(item => item.productId !== res.data)); // Cập nhật state giỏ hàng
            }
        }
        )
    }


    const handleQuantityChange = (productId, delta) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.productId === productId) {
                const newQuantity = item.quantity + delta;
                if (newQuantity > 0) {
                    return { ...item, quantity: newQuantity };
                }
            }
            return item;
        }));
    };

    const handlePlus = (productId) => {
        setUpdatingCart(true);
        handleQuantityChange(productId, 1);
    };

    const handleMinus = (productId) => {
        setUpdatingCart(true);
        handleQuantityChange(productId, -1);
    };
    const UpdateCart = (cart) => {
        axios.put(`https://localhost:7201/api/Carts/updateCart`, cart)
            .then(res => {
                if (res.status === 200) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Cập nhật giỏ hàng thành công",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    setUpdatingCart(false);
                }
            })
            .catch(error => {
                console.error('Error updating cart:', error);
            });
    };

    const DeleteCart = (item) => {
        Swal.fire({
            title: "Bạn đã chắc chắn xóa ",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete  "
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`https://localhost:7201/api/Carts/deleteCart`, item)
                    .then(res => {
                        if (res.status === 200) {
                            Swal.fire({
                                title: "Xoá giỏ hàng thành công!",
                                text: "Giỏ hàng của bạn đã được xóa.",
                                icon: "success"
                            });
                            window.location.reload();
                        }
                    })
                    .catch(error => {
                        console.error('Error deleting carts:', error);
                        // Xử lý khi xảy ra lỗi
                    });

            }
        });
    }

    const handlePaymentChange = (event) => {
        setPaymentMethod(parseInt(event.target.value)); // Cập nhật giá trị khi người dùng thay đổi lựa chọn
    };
    return (
        <>
            <Header />
            <Navbar />
            {/* Breadcrumb Start */}
            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="col-12">
                        <nav className="breadcrumb bg-light mb-30">
                            <Link to={`/`} className="breadcrumb-item text-dark" >Home</Link>
                            <span className="breadcrumb-item active">Cart</span>
                        </nav>
                    </div>
                </div>
            </div>
            {/* Breadcrumb End */}

            {cart.length === 0 ? (
                <h3 className="text-center mt-3">Your shopping cart is empty</h3>
            ) : (<>
                {/* Cart Start */}
                <div className="container-fluid ">
                    <div className="row ">
                        <div className="col-lg-7 table-responsive mb-5 card p-2">
                            <table className="table table-light table-borderless table-hover text-center mb-0">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Products</th>
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
                                                            <button className="btn btn-sm btn-warning btn-minus" onClick={() => handleMinus(item.productId)}>
                                                                <i className="fa fa-minus" />
                                                            </button>
                                                        </div>
                                                        <input type="text" readOnly className="form-control form-control-sm   border-0 text-center countid" value={item.quantity} />
                                                        <div className="input-group-btn">
                                                            <button className="btn btn-sm btn-warning btn-plus" onClick={() => handlePlus(item.productId)}>
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
                            <div className="d-flex" style={{ justifyContent: "flex-end" }}>
                                <Button className="mr-2" onClick={() => UpdateCart(cart)}> <i class="fa fa-refresh" ></i> Update Cart</Button>
                                <Button className="btn btn-danger" onClick={() => DeleteCart(cart)}> <i className="fa fa-trash" style={{ color: "#fff" }}> Delete all</i></Button>
                            </div>
                        </div>
                        <div className="col-lg-5 c">
                            <h5 className="section-title position-relative text-uppercase mb-3 "><span className="  pr-3">SHIPMENT DETAILS</span></h5>
                            <div className="bg-light p-30 mb-5">
                                <div className="border-bottom pb-2">
                                    <Form.Group className="card p-3">
                                        <div className="row">
                                            <div className="col-6 p-3">
                                                <Form.Label>
                                                Recipient's name</Form.Label>
                                                <Form.Control
                                                    name="fullName"
                                                    value={User.fullName}
                                                    type="text"
                                                    placeholder="Recipient's name"
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="col-6 p-3">
                                                <Form.Label>Recipient phone number</Form.Label>
                                                <Form.Control
                                                    name="phoneNumber"
                                                    value={User.phoneNumber}
                                                    type="number"
                                                    placeholder="Recipient phone number"
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="col-12 p-3" >
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    name="email"
                                                    value={User.email}
                                                    type="Email"
                                                    placeholder="Enter Email"
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="col-12 p-3">
                                                <Form.Label>Enter the shipping address</Form.Label>
                                                <Form.Control
                                                    name="addressShipping"
                                                    value={AddressShipping}
                                                    type="text"
                                                    placeholder="Enter the shipping address"
                                                    onChange={handleAddressChange}
                                                />
                                            </div>
                                        </div>
                                    </Form.Group>
                                </div>
                                <div className="pt-2">
                                    <div className="optionpay d-flex">
                                        <div className="item1 mr-3">
                                            <img className="w-25" style={{borderRadius:"10%"}} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSqVahqQY-QkSVILA-n-hjvL2iRPYFYF6gjw&s" alt="pay"/>
                                            <input name="payid" value={1} type="radio" checked={paymentMethod === 1} onChange={handlePaymentChange} />
                                            <label  className="ml-2">In Cash</label> 
                                        </div>
                                        <div className="item2 mr-3"> 
                                            <img className="w-25" style={{borderRadius:"10%"}} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8VNUYiwB1DuoiPYNKl6jXWIcQEOxbNkXM6w&s" alt="pay"/>
                                            <input name="payid" checked={paymentMethod === 2} onChange={handlePaymentChange} value={2} type="radio" />
                                            <label className="ml-2">By   VNPay</label>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between mt-2">
                                        <h5>Total Price</h5>
                                        <h5>{convertToVND(calculateTotalPrice())}</h5>
                                    </div>
                                    <button onClick={handleSuccess} type="button" className="   btn btn-block btn-warning font-weight-bold my-3 py-3 " disabled={updatingCart}>Submit order</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Cart End */}
            </>
            )}
            <Footer />
        </>
    );
};

export default Cart;
