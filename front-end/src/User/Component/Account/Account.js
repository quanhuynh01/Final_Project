import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import './Account.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { FormControl, Modal, Table } from "react-bootstrap";
import FormCheckLabel from "react-bootstrap/esm/FormCheckLabel";

const Account = () => {
    const [Id, setId] = useState(null);
    const navigate = useNavigate();
    
    const [User, setUser] = useState({
        userName: "",
        fullName: "",
        phoneNumber: "",
        email: "",
        lastLogin: "",
        address: ""
    });
    const [lsOrder, setlsOrder] = useState([]);
    const [lsOrderDetail, setlsOrderDetail] = useState([]);
    //modal xem chi tiết đơn hàng
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        console.log(id);
        axios.get(`https://localhost:7201/orderDetailByOderId/${id}`).then(res =>{
            setShow(true);
            setlsOrderDetail(res.data.data);
            console.log(res.data);
        });
        
    } 

    useEffect(() => {
        const jwt = localStorage.getItem('token'); // Lấy mã JWT từ localStorage 
        if (jwt) {
            const decodedJwt = jwtDecode(jwt); //  sử dụng thư viện jwtDecode để giải mã JWT
            const userId = decodedJwt["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            setId(userId);
            if (userId) {
                axios.get(`https://localhost:7201/api/Users/${userId}`)
                    .then(res => {
                        setUser({
                            id: res.data.id || "",
                            fullName: res.data.fullName || "",
                            phoneNumber: res.data.phoneNumber || "",
                            userName: res.data.userName || "",
                            email: res.data.email || "",
                            lastLogin: res.data.lastLogin || "",
                            address: res.data.address || "",
                        });
                        // console.log(res.data.address);
                    })
                    .catch(error => console.error("Error fetching user data:", error));
                axios.get(`https://localhost:7201/getOrderByUserId/${userId}`).then(res => setlsOrder(res.data.data));
            }
        }
        else {
            navigate("/login");
        }
    }, []);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`https://localhost:7201/api/Users/editUser/${Id}?fullName=${User.fullName}&userName=${User.userName}&email=${User.email}&&address=${User.address}`).then(res => {
            if (res.status === 200) {
                setUser(res.data);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Thay đổi thông tin thành công",
                    showConfirmButton: false,
                    timer: 1000
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1000); // Thời gian đợi tương ứng với thời gian của thông báo Swal
            }
        })
            .catch(error => console.error("Error fetching user data:", error));
    }
    //hàm lấy ngày và giờ  
    const formatDateTime = (dateTimeStr) => {
        const date = new Date(dateTimeStr);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();
        return `${formattedDate} - ${formattedTime}`;
    };
    const convertToVND = (price) => {
        const priceInVND = price * 1000;
        return priceInVND.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };
    const getStatusClass = (status) => {
        switch (status) {
            case 1:
                return 'text-danger';
            case 2:
                return 'text-warning';
            case 3:
                return 'text-success';
            default:
                return '';
        }
    };

    //khách hàng hủy đơn
    const handleCancelOrder = (id) => {
        axios.get(`https://localhost:7201/cancelOrder/${id}`).then(res => {
            if (res.status === 200) {
                alert("Hủy đơn thành công");
            }
        })
    }
    const handleChangePassWord=(e)=>{
        e.preventDefault();

    }
    //console.log(lsOrder); 
    return (
        <>
            <Header />
            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="col-12">
                        <nav className="breadcrumb bg-light mb-30">
                            <a className="breadcrumb-item text-dark" href="/">Trang chủ</a>
                            <span className="breadcrumb-item active">Tài khoản</span>
                        </nav>
                    </div>
                </div>
            </div>
            <section className="account-box mt-4">
                <div className=" p-4" style={{ width: "80%", margin: "auto" }}>
                    <div className="mail-wrapper d-flex" style={{ height: "400px" }}>
                        <div className="mail-nav card p-2" id="mail-nav" style={{ width: "300px" }}>
                            <div>
                                <ul className="menu nav flex-column">
                                    <li className="nav-item">
                                        <a href="#profile-tab" className="nav-link active" data-toggle="tab">
                                            <i className="anticon anticon-inbox" />
                                            <span className="text-black">Thông tin tài khoản</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#orders-tab" className="nav-link" data-toggle="tab">
                                            <i className="anticon anticon-mail" />
                                            <span>Xem đơn hàng</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#password-tab" className="nav-link" data-toggle="tab">
                                            <i className="anticon anticon-star" />
                                            <span>Thay đổi mật khẩu</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            {/* <Button className="btn btn-outline-danger">Đăng xuất</Button> */}
                        </div>

                        <div className="tab-content card p-2" style={{ width: '100%' }}>
                            <div id="profile-tab" className="tab-pane active show">
                                <div className="ac-ct-info">
                                    <div className="box-cus-info-2021 p-3">
                                        <h4 className="text-center mb-2">Thông tin chung</h4>
                                        <Form>
                                            <Form.Group className="mb-3 col-6" >
                                                <Form.Label>Họ và tên </Form.Label>
                                                <Form.Control
                                                    name="fullName"
                                                    value={User.fullName}
                                                    onChange={handleInputChange}
                                                    type="text"
                                                    placeholder="Tài khoản"
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3 col-6" >
                                                <Form.Label>Số điện thoại</Form.Label>
                                                <Form.Control
                                                    name="phoneNumber"
                                                    value={User.phoneNumber}
                                                    onChange={handleInputChange}
                                                    type="number"
                                                    placeholder="Số điện thoại"
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3 col-6" >
                                                <Form.Label>Tài khoản</Form.Label>
                                                <Form.Control
                                                    name="userName"
                                                    value={User.userName}
                                                    onChange={handleInputChange}
                                                    type="text"
                                                    placeholder="Tài khoản"
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3 col-6" >
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    name="email"
                                                    value={User.email}
                                                    onChange={handleInputChange}
                                                    type="email"
                                                    placeholder="Email"
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3 col-6" >
                                                <Form.Label>Địa chỉ</Form.Label>
                                                <Form.Control
                                                    name="address"
                                                    value={User.address}
                                                    onChange={handleInputChange}
                                                    type="text"
                                                    placeholder="Địa chỉ"
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3 col-6" >
                                                <Form.Label>Lần đăng nhập cuối cùng</Form.Label>
                                                <Form.Control
                                                    readOnly
                                                    name="text"
                                                    value={User.lastLogin}
                                                />
                                            </Form.Group>
                                        </Form>
                                    </div>
                                    <Button onClick={handleSubmit} variant="success" type="button">
                                        <i className="fa fa-check"></i> Chỉnh sửa
                                    </Button>
                                </div>

                            </div>

                            <div id="orders-tab" className="tab-pane">
                                <div className="ac-ct-info">
                                    <div className="box-cus-info-2021">
                                        <div className="title-ac-2021"> <h2 className="text-center">Đơn hàng của bạn</h2></div>
                                        <div className="box-cus-info-2021">
                                            <div className="table-responsive" style={{ padding: 12 }}>
                                                {
                                                    lsOrder.length > 0 ? (<>
                                                        <table className="table">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col"><b>Mã đơn hàng</b></th>
                                                                    <th scope="col"><b>Ngày mua</b></th>
                                                                    <th scope="col"><b>Tổng tiền</b></th>
                                                                    <th scope="col"><b>Thanh toán</b></th>
                                                                    <th scope="col"><b>Trạng thái</b></th>
                                                                    <th></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    lsOrder.map((item, index) => {
                                                                        return (<tr key={index}>
                                                                            <td>{item.code}</td>
                                                                            <td>{formatDateTime(item.dateShip)}</td>
                                                                            <td>{convertToVND(item.totalMoney)}</td>
                                                                            <td>
                                                                                {item.paid ? <p className='text-success'>Đã thanh toán</p> : <p className='text-danger'>Chưa thanh toán</p>}
                                                                            </td>
                                                                            <td className={getStatusClass(item.deliveryStatus)}>{item.deliveryStatus.status}</td>
                                                                            <td>
                                                                                {
                                                                                    item.deliveryStatus.id === 3 ? (
                                                                                        null
                                                                                    ) : (
                                                                                        <button onClick={() => handleShow(item.id)} className="btn btn-success"><i className="fa fa-eye text-white"></i>
                                                                                        </button>)
                                                                                }

                                                                                {
                                                                                    item.deliveryStatus.id === 1 ? (
                                                                                        <Button className="ml-2" variant="danger" onClick={() => handleCancelOrder(item.id)}>
                                                                                            Hủy đơn
                                                                                        </Button>
                                                                                    ) : null
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                        )
                                                                    })
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </>) : (<>
                                                        <Link className="text-primary d-flex justify-content-center" to={"/"}>Mua sắm ngay</Link>
                                                    </>)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="password-tab" className="tab-pane">
                                <h5 className="text-center">Thay đổi mật khẩu</h5>
                                <Form className="mt-5">
                                    <Form.Group className="col-6">
                                        <FormCheckLabel>Mật khẩu cũ</FormCheckLabel>
                                        <FormControl type="password" placeholder="Nhập mật khẩu cũ" />
                                    </Form.Group>
                                    <Form.Group className="col-6">
                                        <FormCheckLabel>Mật khẩu mới</FormCheckLabel>
                                        <FormControl  type="password" placeholder="Nhập mật khẩu mới" />
                                    </Form.Group>
                                    <Form.Group className="col-6 mt-5">
                                        <Button onClick={(e)=>handleChangePassWord(e)} className="btn btn-success"><i className="fa fa-check"></i>Thay đổi</Button>
                                    </Form.Group> 
                                </Form>
                                {/* Nội dung của tab Mật khẩu */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />



            {/* Modal */}
            <Modal  show={show} onHide={handleClose}size="lg">
                <Modal.Header >
                    <Modal.Title>Chi tiết đơn hàng của bạn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên sản phẩm</th>
                                <th>Ảnh</th>
                                <th>Giá</th>
                                <th>Số lượng</th>
                                <th>Tổng tiền</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {
                                lsOrderDetail.map((item, index) => {
                                    return (
                                        <tr className="" key={index}>
                                            <td>{index +1}</td>
                                            <td><Link className="text-primary" to={`/chi-tiet-san-pham/${item.product.id}`}>{item.product.productName}</Link></td>
                                            <td className=" "><img className="w-50 " src={`https://localhost:7201${item.product.avatar}`}/></td>
                                            <td>{convertToVND(item.product.price)}</td>
                                            <td>{item.amount}</td>
                                            <td>{convertToVND(item.totalMoney)} </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Account;
