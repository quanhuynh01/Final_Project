import { useEffect, useState } from "react";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import { Button, Form, Modal } from "react-bootstrap"; 
import axios from "axios";
import Select from 'react-select';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css"; // Import theme CSS
import "primereact/resources/primereact.min.css"; // Import PrimeReact CSS
import { Link } from "react-router-dom";

const Brand = () => {
    //modal bootstrap
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [loading, setLoading] = useState(true);
    const [Brand, setBrand] = useState({   
    active: true,  imageFile: null
});//state lưu trữ thêm thương hiệu
const [Categories , setCategories] = useState([]);//view Categories
const [CategoriesPost , setCategoriesPost] = useState([]);
useEffect(() => { 
    axios.get(`https://localhost:7201/api/Categories`).then(res=>{
    setCategories(res.data);
   })
}, []);
const categoryOptions = Categories.map(item => ({
    value: item.id,
    label: item.nameCategory
}));
     // Xử lý chọn nhiều danh mục
     const handleMultiSelectChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setCategoriesPost(selectedValues);
         
    };

 

    const [lsBrand, setlsBrand] = useState([]);
 
    //xử lý thêm xóa sửa dữ liệu
    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setBrand(prev => ({ ...prev, [name]: value }));
    }
    const handleCheck = (e) => {
        let name = e.target.name;
        let value = e.target.checked
        setBrand(prev => ({ ...prev, [name]: value }));
    }
    const handleImageChange = (e) => {
        setBrand(prev => ({ ...prev, imageFile: e.target.files[0] }));
    }
    const handleSubmit = (e) => {
        if (Brand.BrandName == null || Brand.imageFile == null ) {
            alert('Bạn chưa nhập đủ thông tin');
            return;
        }
        else {
            e.preventDefault();
            console.log(Brand);
            const formData = new FormData();  
            Object.entries(Brand).forEach(([key, value]) => {
                console.log(key,value);
                formData.append(key, value);

            });
            CategoriesPost.forEach((id) => {
                formData.append("CateId[]", id);
            }); 

            axios.post(`https://localhost:7201/api/Brands`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((res) => {
                    console.log(res);
                    if (res.status === 201) {
                        alert("Thêm thương hiệu thành công");
                        window.location.reload();
                    }
                })
                .catch(() => {
                    alert("Thêm thất bại!!!")
                })
        }

    }

    const handleDelete = (id) => {
        // Xác nhận trước khi xóa
        if (window.confirm("Bạn có chắc chắn muốn xóa thương hiệu này không?")) {
            axios.delete(`https://localhost:7201/api/Brands/${id}`)
                .then(res => {
                    if (res.status === 204) {
                        alert('Xóa thương hiệu thành công');
                        window.location.reload();
                    }
                });
        }
    } 
    //load dữ liệu xem
    useEffect(() => {
        axios.get(`https://localhost:7201/api/Brands`)
            .then((res) => {
                setlsBrand(res.data);   
                setLoading(false);
              }) ;
           
    }, []);

    const imageBrand = (row) =>{
        return(<div>
            <img className="w-25" src={`https://localhost:7201/${row.imageBrand}`} alt={`${row.brandName}`} />
        </div>)
    }
    const Funct=(row)=>{
        return(<div>
             <Link type="button"  className="btn btn-outline-warning" to= {`http://localhost:3000/admin/brand/chinh-sua-thuong-hieu/${row.id}`} ><i className="fa fa-edit"></i> Chỉnh sửa</Link>
             <button onClick={()=>handleDelete(row.id) } className="btn btn-outline-danger ml-2"><i className="fa fa-trash"></i> Xoá</button>  
        </div>)
    }
    console.log(lsBrand);
    
    return (<>
        <SidebarAdmin />
        <div id="right-panel" className="right-panel"> 
            <HeaderAdmin />
            <div className="breadcrumbs">
                <div className="col-sm-4">
                    <div className="page-header float-left">
                        <div className="page-title">
                            <h1>Danh mục thương hiệu</h1>
                        </div>
                    </div>
                </div>

                <div className="col-sm-8">
                    <div className="page-header float-right">
                        <div className="page-title">
                            <ol className="breadcrumb text-right">
                                <li className="breadcrumb-item active">Danh mục thương hiệu</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content" ><button onClick={handleShow} className="btn btn-outline-success" type="button"><i className="fa fa-plus"></i> Tạo mới thương hiệu</button></div>
            <div className="content mt-3  ">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <strong className="card-title">Danh sách thương hiệu</strong>
                                </div>
                                <div className="card-body">
                                    {/* <table className="table table-striped data-table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Tên thương hiệu</th>
                                                <th scope="col">Ảnh</th>
                                                <th scope="col">Mô tả</th>
                                                <th scope="col">Trạng thái</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lsBrand.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.brandName}</td>
                                                    <td className="col-4"><img className="w-25 h-25" src={`https://localhost:7201${item.imageBrand}`} alt={item.brandName} /></td>
                                                    <td>{item.description}</td>
                                                    <td style={{ color: item.active ? 'green' : 'red' }}>{item.active ? 'Hoạt động' : 'Không hoạt động'}</td>
                                                    <td> <a type="button"  className="btn btn-outline-warning" href= {`http://localhost:3000/admin/brand/chinh-sua-thuong-hieu/${item.id}`} ><i className="fa fa-edit"></i> Chỉnh sửa</a>
                                                    <button onClick={()=>handleDelete(item.id) } className="btn btn-outline-danger ml-2"><i className="fa fa-trash"></i> Xoá</button> </td>
                                                </tr>
                                            ))
                                            }
                                        </tbody>
                                        
 
                                    </table>  */}
                                    <DataTable
                                        value={lsBrand.filter(a=>a.active)}
                                        loading={loading}
                                        paginator
                                        rows={10}
                                        rowsPerPageOptions={[10, 25, 50]}
                                        className="p-datatable-customers"
                                    >
                                        <Column field="id" header="###" sortable />
                                        <Column field="brandName" header="Tên thương hiệu" sortable />
                                        <Column   header="Ảnh thương hiệu " sortable body={imageBrand} />
                                        <Column   header="Chức năng " body={Funct} /> 
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
                        <Form.Label>Tên thương hiệu</Form.Label>
                        <Form.Control name="BrandName" onChange={(e) => handleChange(e)} type="email" placeholder="Nhập tên thương hiệu" />
                    </Form.Group>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Ảnh thương hiệu</Form.Label>
                        <Form.Control name="imageFile" onChange={handleImageChange} type="file" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control name="Description" onChange={(e) => handleChange(e)} as="textarea" rows={3} />
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
                <Button variant="primary" onClick={(e) => handleSubmit(e)}>
                Thêm mới
                </Button>
            </Modal.Footer>
        </Modal> 

    </>);
}

export default Brand;