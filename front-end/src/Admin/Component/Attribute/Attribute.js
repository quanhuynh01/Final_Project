import { useEffect, useState } from "react";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
 
const Attribute = () => {
    const [Attribute, setAttribute] = useState([]);
    useEffect(() => {
        axios.get(`https://localhost:7201/api/Attributes`)
            .then( res=>setAttribute(res.data));
       
    }, []);
 
    const [AttributeCreate, setAttributeCreate] = useState({});
    const [AttributeValue, setAttributeValue] = useState({AttributeId:null});
 
    const [CategoriesPost , setCategoriesPost] = useState([]);

        //modal bootstrap
        const [show, setShow] = useState(false);
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);

        //attribute value
        const [showAttr, setShowAttr] = useState(false);
        const handleCloseAttr = () => setShowAttr(false);
        const handleShowAttr = (id) =>{ 
            // console.log(id);
            setAttributeValue(prev => ({ ...prev,   AttributeId: id }))
            setShowAttr(true)
        };
        const handleChange = (e) => {
            let name = e.target.name;
            let value = e.target.value;
            setAttributeCreate(prev => ({ ...prev, [name]: value }));
        }

        const handleChangeAttr = (e) => {
            let name = e.target.name; 
            let value = e.target.value;
            setAttributeValue(prev => ({ ...prev, [name]: value }));
        }


    const handleDelete =(id)=>{

    }; 
    // const categoryOptions = Categories.map(item => ({
    //     value: item.id,
    //     label: item.nameCategory
    // }));
    const handleSubmit = (e) => { 
        e.preventDefault();
        const formData = new FormData();
        Object.entries(AttributeCreate).forEach(([key, value]) => { 
            formData.append(key, value); 
        });
        CategoriesPost.forEach((id) => {
            formData.append("CateId[]", id);
        }); 
        axios.post(`https://localhost:7201/api/Attributes`, formData, {
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
                        title: "Thêm thuộc tính thành công ",
                        showConfirmButton: false,
                        timer: 1500
                      });
                    // Chờ 1.5 giây trước khi chuyển hướng
                    setTimeout(() => {
                        window.location.reload();
                    }, 1300);
                }
            })
            .catch((e) => {
                console.log(e);
                alert("Thêm thất bại!!!")
            }) 
    }

    const handleCreateAttr = (e) => {
        e.preventDefault();
       // console.log(AttributeValue);
        axios.post(`https://localhost:7201/api/Attributevalues`,AttributeValue).then( (res) =>{
            Swal.fire({
                position: "center",
                icon: "success",
                title: `Thêm giá trị ${res.data.nameValue} thành công` ,
                showConfirmButton: false,
                timer: 1500
              }); 
            setTimeout(() => {
                window.location.reload();
            }, 1300); 
        }); 
    }
     // Xử lý chọn nhiều danh mục
     const handleMultiSelectChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setCategoriesPost(selectedValues);
        console.log(selectedValues);
    };


    return ( <>
     <SidebarAdmin />
        <div id="right-panel" className="right-panel"  style={{ width: '86%' }}>
            {/* Header*/}
            <HeaderAdmin />
            {/* Header*/}
            <div className="breadcrumbs">
                <div className="col-sm-4">
                    <div className="page-header float-left">
                        <div className="page-title">
                            <h1>Thuộc tính sản phẩm</h1>
                        </div>
                    </div>
                </div>
                <div className="col-sm-8">
                    <div className="page-header float-right">
                        <div className="page-title">
                            <ol className="breadcrumb text-right">
                                <li className="breadcrumb-item active">Thuộc tính sản phẩm</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
             <div className="content" ><button  onClick={handleShow}  className="btn btn-outline-success" type="button"><i className="fa fa-plus"></i> Tạo mới</button></div> 
            <div className="content mt-3  ">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <strong className="card-title">Danh sách thuộc tính</strong>
                                </div>
                                <div className="card-body">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Tên thuộc tính</th> 
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Attribute.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.nameAttribute}</td> 
                                                   <td><button onClick={() => handleShowAttr(item.id)} className="btn btn-outline-success"><i className="fa fa-plus"></i> Thêm giá trị</button>
                                                     <a href={`/admin/attributes/attributevalues/${item.id}`} className=" ml-2 btn btn-outline-primary"><i className="fa fa-eye"></i> Xem giá trị thuộc tính</a></td>
                                                    <td> <a type="button"  className="btn btn-outline-warning" href= {`attributes/chinh-sua-thuoc-tinh/${item.id}`} ><i className="fa fa-edit"></i> Chỉnh sửa</a>
                                                    <button onClick={()=>handleDelete(item.id) } className="btn btn-outline-danger ml-2"><i className="fa fa-trash"></i> Xoá</button> </td>
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


  {/* modal create*/}
  <Modal show={show} onHide={handleClose}>
            <Modal.Header  >
                <Modal.Title>Tạo mới thương hiệu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Tên thuộc tính</Form.Label>
                        <Form.Control name="NameAttribute" onChange={(e) => handleChange(e)} type="text" placeholder="Nhập tên thuộc tính" />
                    </Form.Group>  
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="primary" onClick={(e) => handleSubmit(e)}>
                Thêm mới
                </Button>
            </Modal.Footer>
        </Modal> 

{/* Create attributevalues */}
<Modal show={showAttr} onHide={handleCloseAttr}>
            <Modal.Header  >
                <Modal.Title>Tạo mới thương hiệu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Tên thuộc tính</Form.Label>
                        <Form.Control name="NameValue" onChange={handleChangeAttr}  type="text" placeholder="Nhập giá trị" />
                    </Form.Group> 
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseAttr}>
                    Đóng
                </Button>
                <Button variant="primary" onClick={handleCreateAttr}>
                Thêm mới
                </Button>
            </Modal.Footer>
        </Modal> 

    </> );
}
 
export default Attribute;