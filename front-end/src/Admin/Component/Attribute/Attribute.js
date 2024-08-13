import { useEffect, useState } from "react";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import { Button, Form, Modal, Table } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import Select from 'react-select';
import $ from 'jquery'
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
const Attribute = () => {
    const [Attribute, setAttribute] = useState([]);
  
    const [lsAttributeValue, setlsAttributeValue] = useState([]);    
    const [AttributeCreate, setAttributeCreate] = useState({});
    const [AttributeValue, setAttributeValue] = useState({AttributeId:null});
 
    const [loading, setLoading] = useState(true);
    const [Categories , setCategories] = useState([]);//view Categories
    const [CategoriesPost , setCategoriesPost] = useState([]);

    useEffect(() => {
        axios.get(`https://localhost:7201/api/Attributes`)
            .then( res=>{
                setLoading(false)
                setAttribute(res.data);
            });
        axios.get(`https://localhost:7201/api/Categories`).then(res=>{
        setCategories(res.data);
       })
    }, []);
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

        //Xem giá trị thuộc tính
        const [ShowAttributeValue, setShowAttributeValue] = useState(false);

        const handleCloseAttributeValue = () => setShowAttributeValue(false);
        const handleShowAttributeValue = (id) =>
            {
                setShowAttributeValue(true);
                axios.get(`https://localhost:7201/api/Attributevalues/lsAttributeValue/${id}`)
                .then(res=>{
                    if(res.status ===200)
                    {
                        setlsAttributeValue(res.data.data);
                    }
                }).catch(ex=>{
                    console.log(ex);
                })
                ;
            }


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
 
    const categoryOptions = Categories.map(item => ({
        value: item.id,
        label: item.nameCategory
    }));
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
              setShowAttr(false)
        }); 
    }
     // Xử lý chọn nhiều danh mục
     const handleMultiSelectChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setCategoriesPost(selectedValues);
         
    };

    const handleDelete = (id)=>{
        axios.delete(`https://localhost:7201/api/Attributes/${id}`).then(res =>{
            if(res.status ==204)
            {
                alert("Xóa thuộc tính thành công");  
                setAttribute(prev => prev.filter(attr => attr.id !== id));
            }
        }).catch(ex=>{
            console.log(ex);
        })
    }
   const btn = (row)=>{
    return(<>
        <button onClick={() => handleShowAttr(row.id)} className="btn btn-outline-success"><i className="fa fa-plus"></i> Thêm giá trị</button>
        <button onClick={()=>handleShowAttributeValue(row.id)} className=" ml-2 btn btn btn-outline-info ">Xem danh sách giá trị </button>
        <Link type="button"  className="btn btn-outline-warning ml-2" to= {`edit/${row.id}`} ><i className="fa fa-edit"></i> Chỉnh sửa</Link>
        <button onClick={()=>handleDelete(row.id)} className=" ml-2 btn btn btn-outline-danger ">Xóa</button>
    </>)
   } 
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
                                    {/* <table className="table table-striped">
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
                                                      <a href={`/admin/attributes/attributevalues/${item.id}`} className=" ml-2 btn btn-outline-primary"><i className="fa fa-eye"></i> Xem giá trị thuộc tính</a>  
                                                     <Button onClick={()=>handleShowAttributeValue(item.id)} className=" ml-2 btn  ">Xem danh sách giá trị </Button>
                                                    
                                                     </td>
                                                    <td> <a type="button"  className="btn btn-outline-warning" href= {`attributes/chinh-sua-thuoc-tinh/${item.id}`} ><i className="fa fa-edit"></i> Chỉnh sửa</a>
                                                    <button onClick={()=>handleDelete(item.id) } className="btn btn-outline-danger ml-2"><i className="fa fa-trash"></i> Xoá</button> 
                                                   
                                                    </td>
                                                </tr>
                                            ))
                                            }
                                        </tbody>
                                    </table> */}
                                    <DataTable
                                        value={Attribute.filter(a=>!a.Active)}
                                        loading={loading}
                                        paginator
                                        rows={10}
                                        rowsPerPageOptions={[10, 25, 50]}
                                        className="p-datatable-customers"
                                    >
                                        <Column  field="id" header="###" sortable />
                                        <Column  field="nameAttribute" header="Tên thuộc tính" sortable />
                                        <Column body={btn} header="Chức năng" />
                                    </DataTable>
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
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Chọn danh mục sản phẩm</Form.Label>
                        <Select
                            name="CateId"
                            options={categoryOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={handleMultiSelectChange}
                            placeholder="Chọn danh mục..."
                            isMulti
                            value={categoryOptions.filter(option => CategoriesPost.includes(option.value))}
                        />

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
{/* xem giá trị thuộc tính */}
<Modal show={ShowAttributeValue} onHide={handleCloseAttributeValue}>
    <Modal.Header>
        <Modal.Title>Danh sách giá trị theo thuộc tính</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    {lsAttributeValue && lsAttributeValue.length > 0 ? (
        <Table hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Tên thuộc tính</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {lsAttributeValue.map((item, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.nameValue}</td>
                        <td><Button className="btn">Xóa</Button></td>
                    </tr>
                ))}
            </tbody>
        </Table>
    ) : (
        <p>Không có dữ liệu</p>
    )}
</Modal.Body>

    <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseAttributeValue}>
            Close
        </Button>
    </Modal.Footer>
</Modal>

    </> );
}
 
export default Attribute;