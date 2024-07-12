import axios from "axios";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css"; // Import theme CSS
import "primereact/resources/primereact.min.css"; // Import PrimeReact CSS
import { Button, Form, Modal, Tab, Tabs } from "react-bootstrap";
 
const User = () => {
    const [lsUser, setLsUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lsAdmin, setlsAdmin] = useState([]); 
    
    const [showAdmin, setShowAdmin] = useState(false);
    const handleCloseAdmin = () => setShowAdmin(false);
    const handleShowAdmin = () => setShowAdmin(true);

    const [accountAdmin, setaccountAdmin] = useState({});
    const [error, seterror] = useState(null);

    //hàm validate dữ liệu 
    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/; 
        return re.test(String(email).toLowerCase());
    };
    const validatePassword = (password) => {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return re.test(password);
    }; 
    useEffect(() => {
        axios.get(`https://localhost:7201/api/Users/list-user`)
            .then(res => {
                setLsUser(res.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the user list!", error);
            });
            axios.get(`https://localhost:7201/api/Users/list-admin`).then(res=>{
                setlsAdmin(res.data);
                setLoading(false);
            })
    }, []); 
    const Active = (rowdata) => {
        return (
            <div>
                {rowdata.active == true ? <p className="text-danger">Bị khóa</p> : <p className="text-success">Hoạt động</p>}
            </div>
        )
    }
    const Btn = (rowdata) => {
        return (
            <div>
                {rowdata.active == true ? <Button onClick={() => unBlock(rowdata.id)} className="btn btn-success"> <i className="fa fa-lock text-white"></i></Button> : <Button className="btn btn-warning" onClick={() => Block(rowdata.id)}><i className="text-white fa fa-unlock"></i></Button>}
            </div>
        )
    } 
    const unBlock = (id) => {
        console.log(id);
        axios.put(`https://localhost:7201/api/Users/Block/${id}`).then(res => {
            if (res.status === 200) {
                alert("Thay đổi trạng thái thành công");
                updateStatus(res.data.id, false); // cập nhật trạng thái trong state
            }
        }).catch(ex => {
            console.log(ex);
        })
    }
    const Block = (id) => {
        axios.put(`https://localhost:7201/api/Users/Unblock/${id}`).then(res => {
            if (res.status === 200) {
                alert("Thay đổi trạng thái thành công");
                updateStatus(res.data.id, true); // cập nhật trạng thái trong state

            }

        }).catch(ex => {
            console.log(ex);
        })
    } 
    const updateStatus = (id, newStatus) => {
        setLsUser(prevUsers => prevUsers.map(user => user.id === id ? { ...user, active: newStatus } : user)
        );
        setlsAdmin(prevUsers => prevUsers.map(user => user.id === id ? { ...user, active: newStatus } : user));
    }
 
  
    const handleChange=(e)=>{
        let name = e.target.name;
        let value = e.target.value;
        setaccountAdmin(prev => ({ ...prev, [name]: value }));
    }
    const handleAddAccoutAdmin =(e)=>{
        e.preventDefault();
        if(accountAdmin.Username !==undefined && accountAdmin.Email!==undefined  && accountAdmin.Password !==undefined)
        { 
            console.log(accountAdmin.Password);
            if (!validateEmail(accountAdmin.email) ===false || !validatePassword(accountAdmin.password) === false) {
                alert('Thông tin tài khoản chưa chính xác');
            } 
            
            else{
                console.log("done");
            }
        }
        else{
            
            alert("Vui lòng nhập đầy đủ thông tin");
        }
    }
    console.log(error);
     
    return (
        <>
            <SidebarAdmin />
            <div id="right-panel" className="right-panel" style={{ width: '86%' }}>
                <HeaderAdmin />
                <div className="breadcrumbs">
                    <div className="col-sm-4">
                        <div className="page-header float-left">
                            <div className="page-title">
                                <h1>Danh sách tài khoản</h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className="page-header float-right">
                            <div className="page-title">
                                <ol className="breadcrumb text-right">
                                    <li className="breadcrumb-item active">Danh sách tài khoản</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content mt-3">
                    <div className="animated fadeIn">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-header">
                                        <strong className="card-title">Danh sách tài khoản</strong>
                                    </div>
                                    <div className="card-body">
                                        <Tabs
                                            defaultActiveKey="home"
                                            id="uncontrolled-tab-example"
                                            className="mb-3"
                                        >
                                            <Tab eventKey="home" title="Danh sách tài khoản người dùng">
                                                <DataTable
                                                    value={lsUser}
                                                    loading={loading}
                                                    paginator
                                                    rows={10}
                                                    rowsPerPageOptions={[10, 25, 50]}
                                                    className="p-datatable-customers"
                                                >
                                                    <Column field="id" header="###" sortable />
                                                    <Column field="fullName" header="Tên người dùng" sortable />
                                                    <Column field="email" header="Email " sortable />
                                                    <Column field="phoneNumber" header="Số diện thoại " sortable />
                                                    <Column header="Trạng thái " body={Active} sortable />
                                                    <Column header="Chức năng " body={Btn} />
                                                </DataTable>
                                            </Tab>
                                            <Tab eventKey="profile" title="Danh sách tài khoản quản trị">
                                                <Button onClick={handleShowAdmin} className=" mb-2">Tạo tài khoản quản trị</Button>
                                                <DataTable
                                                    value={lsAdmin}
                                                    loading={loading}
                                                    paginator
                                                    rows={10}
                                                    rowsPerPageOptions={[10, 25, 50]}
                                                    className="p-datatable-customers"
                                                >
                                                    <Column field="id" header="###" sortable />
                                                    <Column field="userName" header="Tên tài khoản" sortable />
                                                    <Column field="lastLogin" header="Lần đăng nhập cuối cùng " sortable /> 
                                                    <Column header="Trạng thái " body={Active} sortable />
                                                    <Column header="Chức năng " body={Btn} />
                                                </DataTable>

                                            </Tab>
                                           
                                        </Tabs> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showAdmin} onHide={handleCloseAdmin}>
                <Modal.Header>
                    <Modal.Title>Tạo mới tài khoản quản trị</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Nhập tên tài khoản  </Form.Label>
                        <Form.Control onChange={handleChange} type="text" name="Username" placeholder="Nhập tên tài khoản" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Nhập mật khẩu  </Form.Label>
                        <Form.Control onChange={handleChange} name="Password" type="password" placeholder="Nhập mật khẩu" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Nhập Email </Form.Label>
                        <Form.Control onChange={handleChange} name="Email"  type="text" placeholder="Nhập Email" />
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAdmin}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={(e)=>handleAddAccoutAdmin(e)}>
                        Tạo mới
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
}

export default User;
