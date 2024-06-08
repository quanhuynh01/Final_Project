import axios from "axios";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Swal from "sweetalert2";

const CustomerSupplier = () => {
    const [lsCus, setlsCus] = useState([]);
    const [CusSup, setCusSup] = useState({});
    useEffect(() => {
        axios.get(`https://localhost:7201/api/CustomerSuppliers`)
            .then(res =>{
                setlsCus(res.data);
            })
    }, []);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    //xử lý
    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setCusSup(prev => ({ ...prev, [name]: value }));
    }
    const handleCheck = (e) => {
        let name = e.target.name;
        let value = e.target.checked
        setCusSup(prev => ({ ...prev, [name]: value }));
    }
    const handleImageChange = (e) => {
        setCusSup(prev => ({ ...prev, imageFile: e.target.files[0] }));
    }

    const handleSubmit =(e)=>{
        e.preventDefault();
        const formData = new FormData();  
        Object.entries(CusSup).forEach(([key, value]) => { 
            formData.append(key, value);

        });
        axios.post(`https://localhost:7201/api/CustomerSuppliers`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((res) => {
                console.log(res);
                if (res.status === 201) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Thêm  thành công !",
                        showConfirmButton: false,
                        timer: 1500
                      });
  
                      setTimeout(() => {
                        window.location.reload();
                      }, 1300);
                   
                }
            })
            .catch(() => {
                alert("Thêm thất bại!!!")
            })
    } 
        
    return ( <>
            <SidebarAdmin />
        <div id="right-panel" className="right-panel"> 
            <HeaderAdmin />
            <div className="breadcrumbs">
                <div className="col-sm-4">
                    <div className="page-header float-left">
                        <div className="page-title">
                            <h1>Danh sách nhà cung cấp</h1>
                        </div>
                    </div>
                </div>

                <div className="col-sm-8">
                    <div className="page-header float-right">
                        <div className="page-title">
                            <ol className="breadcrumb text-right">
                                <li className="breadcrumb-item active">Danh sách nhà cung cấp</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content" ><button  onClick={handleShow}  className="btn btn-outline-success" type="button"><i className="fa fa-plus"></i> Tạo mới nhà cung cấp</button></div>
            <div className="content mt-3  ">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <strong className="card-title">Danh sách nhà cung cấp</strong>
                                </div>
                                <div className="card-body">
                                    <table className="table   ">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Tên nhà cung cấp</th>
                                                <th scope="col">Ảnh</th>
                                                <th scope="col">Số điện thoại</th>
                                                <th scope="col">Email</th>
                                                <th scope="col">Trạng thái</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lsCus.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.companyName}</td>
                                                    <td className="col-4"><img className="w-25 h-25" src={`https://localhost:7201${item.image}`} alt={item.companyName} /></td>
                                                    <td>{item.phone}</td>
                                                    <td>{item.email}</td>
                                                    <td style={{ color: item.active ? 'green' : 'red' }}>{item.active ? 'Hoạt động' : 'Không hoạt động'}</td>
                                                    <td> <a type="button"  className="btn btn-outline-warning" href= {`http://localhost:3000/admin/brand/chinh-sua-thuong-hieu/${item.id}`} ><i className="fa fa-edit"></i> Chỉnh sửa</a>
                                                    <button   className="btn btn-outline-danger ml-2"><i className="fa fa-trash"></i> Xoá</button> </td>
                                                </tr>
                                            ))
                                            }
                                        </tbody> 
                                    </table> 
                                   
                                </div>
                              
                            </div>
                        </div> 
                    </div>
                </div> 
            </div> {/* .content */}
        </div>  
        
        {/* Model create  */}
                   
        <Modal show={show} onHide={handleClose}>
            <Modal.Header  >
                <Modal.Title>Tạo mới thương hiệu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Tên thương hiệu</Form.Label>
                        <Form.Control name="CompanyName" onChange={(e) => handleChange(e)} type="text" required placeholder="Nhập tên nhà cung cấp" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Địa chỉ</Form.Label>
                        <Form.Control name="Address" onChange={(e) => handleChange(e)} type="text" required placeholder="Nhập địa chỉ" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control name="Phone" onChange={(e) => handleChange(e)} type="number" required placeholder="Nhập số điện thoại" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Email</Form.Label>
                        <Form.Control name="Email" onChange={(e) => handleChange(e)} type="email" required placeholder="Nhập Email" />
                    </Form.Group>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Ảnh thương hiệu</Form.Label>
                        <Form.Control name="imageFile" onChange={handleImageChange} type="file" />
                    </Form.Group> 
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Check // prettier-ignore
                            type="switch"
                            id="custom-switch"
                            label="Trạng thái"
                            name="Active"
                            onChange={(e) => handleCheck(e)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="primary" onClick={handleSubmit} >
                Thêm mới
                </Button>
            </Modal.Footer>
        </Modal>                                 

    </> );
}
 
export default CustomerSupplier;