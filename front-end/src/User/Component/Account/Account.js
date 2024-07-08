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
import Navbar from "../Navbar/Navbar";

const Account = () => {
    const [Id, setId] = useState(null);
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);


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

        axios.get(`https://localhost:7201/orderDetailByOderId/${id}`).then(res => {
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
    const handleTrahang = (id) => {
        axios.get(`https://localhost:7201/trahang/${id}`).then(res => {
            if (res.status === 200) {
                alert("Gửi yêu cầu thành công, người bán sẽ liên hệ với bạn sao ít phút nữa ");
            }
        })
    }


    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu mới không khớp');
            return;
        }

        try {
            const response = await axios.post(`https://localhost:7201/api/Users/ChangePass/${User.userName}`, {
                currentPassword,
                newPassword
            });

            if (response.data.status === 200) {
                setSuccess(response.data.message);
                setError(null);
                Swal.fire({
                    icon: 'success',
                    title: 'Thay đổi mật khẩu thành công',
                    text: response.data.message,
                });
            } else {
                setError(response.data.message);
                setSuccess(null);
                Swal.fire({
                    icon: 'error',
                    title: 'Thay đổi mật khẩu thất bại',
                    text: response.data.message,
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi thay đổi mật khẩu');
            setSuccess(null);
            Swal.fire({
                icon: 'error',
                title: 'Thay đổi mật khẩu thất bại',
                text: err.response?.data?.message || 'Lỗi khi thay đổi mật khẩu',
            });
        }
    };
    return (
        <>
            <Header />
            <Navbar/>
            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="col-12">
                        <nav className="breadcrumb bg-light mb-30">
                            <Link to={'/'} className="breadcrumb-item text-dark" >Home</Link>
                            <span className="breadcrumb-item active">Account</span>
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
                                            <span className="text-black">
                                                Account information</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#orders-tab" className="nav-link" data-toggle="tab">
                                            <i className="anticon anticon-mail" />
                                            <span>My order</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#password-tab" className="nav-link" data-toggle="tab">
                                            <i className="anticon anticon-star" />
                                            <span>Change Password</span>
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
                                        <h4 className="text-center mb-2">
                                            General information</h4>
                                        <Form>
                                            <Form.Group className="mb-3 col-6" >
                                                <Form.Label>Full name</Form.Label>
                                                <Form.Control
                                                    name="fullName"
                                                    value={User.fullName}
                                                    onChange={handleInputChange}
                                                    type="text"
                                                    placeholder="Full name"
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3 col-6" >
                                                <Form.Label>Phone number</Form.Label>
                                                <Form.Control
                                                    name="phoneNumber"
                                                    value={User.phoneNumber}
                                                    onChange={handleInputChange}
                                                    type="number"
                                                    placeholder="Phone number"
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3 col-6" >
                                                <Form.Label>Accout name</Form.Label>
                                                <Form.Control
                                                    name="userName"
                                                    value={User.userName}
                                                    onChange={handleInputChange}
                                                    type="text"
                                                    placeholder="Accout name"
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
                                                <Form.Label>Address</Form.Label>
                                                <Form.Control
                                                    name="address"
                                                    value={User.address}
                                                    onChange={handleInputChange}
                                                    type="text"
                                                    placeholder="Address"
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3 col-6" >
                                                <Form.Label>Last login</Form.Label>
                                                <Form.Control
                                                    readOnly
                                                    name="text"
                                                    value={User.lastLogin}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3 col-6" >
                                                <Button onClick={handleSubmit} variant="success" type="button">
                                                    <i className="fa fa-check"></i> Change
                                                </Button>
                                            </Form.Group>

                                        </Form>

                                    </div>
                                </div>

                            </div>

                            <div id="orders-tab" className="tab-pane">
                                <div className="ac-ct-info">
                                    <div className="box-cus-info-2021">
                                        <div className="title-ac-2021"> <h2 className="text-center">My order</h2></div>
                                        <div className="box-cus-info-2021">
                                            <div className="table-responsive" style={{ padding: 12 }}>
                                                <div>
                                                    {lsOrder.length > 0 ? (
                                                        <div style={{ maxHeight: "315px", overflowY: "scroll" }}>
                                                            <table className="table">
                                                                <thead>
                                                                    <tr>
                                                                        <th scope="col"><b>Order code</b></th>
                                                                        <th scope="col"><b>Purchase date</b></th>
                                                                        <th scope="col"><b>Total Price</b></th>
                                                                        <th scope="col"><b>Pay</b></th>
                                                                        <th scope="col"><b>Status</b></th>
                                                                        <th></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {lsOrder.map((item, index) => (
                                                                        <tr key={index}>
                                                                            <td>{item.code}</td>
                                                                            <td>{formatDateTime(item.dateShip)}</td>
                                                                            <td>{convertToVND(item.totalMoney)}</td>
                                                                            <td>
                                                                                {item.paid ? <p className="text-success">Completely payment</p> : <p className="text-danger">Unpaid</p>}
                                                                            </td>
                                                                            <td className={getStatusClass(item.deliveryStatus)}>{item.deliveryStatus.status}</td>
                                                                            <td>
                                                                                <button onClick={() => handleShow(item.id)} className="btn btn-success">
                                                                                    <i className="fa fa-eye text-white"></i>
                                                                                </button>
                                                                                {!item.paid && (item.deliveryStatus.id === 1 || item.deliveryStatus.id === 2) && (
                                                                                    <Button className="ml-2" variant="danger" onClick={() => handleCancelOrder(item.id)}>
                                                                                        Cancel order
                                                                                    </Button>
                                                                                )}
                                                                                {item.deliveryStatus.id === 8 && (
                                                                                    <Button className="ml-2" variant="info" onClick={() => handleTrahang(item.id)}>
                                                                                        Returns
                                                                                    </Button>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    ))}

                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ) : (
                                                        <Link className="text-primary d-flex justify-content-center" to={"/"}>Shopping now</Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="password-tab" className="tab-pane">
                                <h5 className="text-center">Change Password</h5>
                                <Form className="mt-5" onSubmit={handleChangePassword}>
                                    <Form.Group className="col-6">
                                        <FormCheckLabel>Old password</FormCheckLabel>
                                        <FormControl
                                            type="password"
                                            placeholder="Old password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="col-6">
                                        <FormCheckLabel>New password</FormCheckLabel>
                                        <FormControl
                                            type="password"
                                            placeholder="New password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="col-6">
                                        <FormCheckLabel>
                                        Confirm new password</FormCheckLabel>
                                        <FormControl
                                            type="password"
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="col-6 mt-5">
                                    <Button type="submit" className="btn btn-success">
                                            <i className="fa fa-check"></i> Edit
                                        </Button>
                                    </Form.Group> 
                                </Form>
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                                {success && <p style={{ color: 'green' }}>{success}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />



            {/* Modal */}
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header >
                    <Modal.Title>Detail</Modal.Title>
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
                                            <td>{index + 1}</td>
                                            <td><Link className="text-primary" to={`/chi-tiet-san-pham/${item.product.id}`}>{item.product.productName}</Link></td>
                                            <td className=" "><img className="w-50 " src={`https://localhost:7201${item.product.avatar}`} /></td>
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
