import React from "react";
import { useEffect, useState } from "react"; 
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import './Account.css';  
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { jwtDecode } from 'jwt-decode';
const Account = () => {
    const [Id, setId] = useState(null);
    useEffect(()=>{
        const jwt = localStorage.getItem('token'); // Lấy mã JWT từ localStorage hoặc nơi lưu trữ khác
        const decodedJwt = jwtDecode(jwt); // Giả sử sử dụng thư viện jwtDecode để giải mã JWT
        const userId = decodedJwt["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]; 
        setId(userId);
    },[])
    console.log(Id);
    return (
        <>
            <Header />
            <section className="account-box mt-4">
                
                <div className="container p-4">
                    <div className="mail-wrapper d-flex">
                        <div className="mail-nav card p-2" id="mail-nav" style={{ width: "300px" }}> 
                            <div className="" >
                                <ul className="menu nav flex-column">
                                    <li className="nav-item">
                                        <a href="#profile-tab" className="nav-link active" data-toggle="tab">
                                            <i className="anticon anticon-inbox" />
                                            <span>Thông tin tài khoản</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#orders-tab" className="nav-link" data-toggle="tab">
                                            <i className="anticon anticon-mail" />
                                            <span>Xem đơn hàng</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#addresses-tab" className="nav-link" data-toggle="tab">
                                            <i className="anticon anticon-file-done" />
                                            <span>Danh sách địa chỉ</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#password-tab" className="nav-link " data-toggle="tab">
                                            <i className="anticon anticon-star" />
                                            <span>Thay đổi mật khẩu</span>
                                        </a>
                                    </li>
                                </ul>
                            </div> 
                            <Button className="btn btn-outline-danger" >  Đăng xuất</Button>
                        </div>
       
                        <div className="tab-content card p-2" style={{ width: '100%' }}>
                            <div id="profile-tab" className="tab-pane active show">
                                <div className="ac-ct-info">
                                    <div className="box-cus-info-2021">
                                        <h4 className="text-center">Thông tin chung</h4>
                                        <Form>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label>Email address</Form.Label>
                                                <Form.Control type="email" placeholder="Enter email" />
                                                <Form.Text className="text-muted">
                                                    We'll never share your email with anyone else.
                                                </Form.Text>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control type="password" placeholder="Password" />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                                <Form.Check type="checkbox" label="Check me out" />
                                            </Form.Group>
                                            <Button variant="primary" type="submit">
                                                Submit
                                            </Button>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                            <div id="orders-tab" className="tab-pane">
                                <div className="ac-ct-info">
                                    <div className="box-cus-info-2021">
                                        <div className="title-ac-2021">Đơn hàng của bạn</div>
                                        <div className="box-cus-info-2021">
                                            <div className="table-responsive" style={{ padding: 12 }}>
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col"><b>Mã đơn hàng</b></th>
                                                            <th scope="col"><b>Ngày mua</b></th>
                                                            <th scope="col"><b>Tổng tiền</b></th>
                                                            <th scope="col"><b>Thanh toán</b></th>
                                                            <th scope="col"><b>Trạng thái</b></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="addresses-tab" className="tab-pane">
                            </div>
                            <div id="password-tab" className="tab-pane">
                            </div>
                        </div>
                    </div>
                </div>
                <input className="idcus" type="hidden" defaultValue={73} />
            </section>

            <Footer />
        </>
    );
}

export default Account;
