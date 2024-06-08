import { useEffect, useState } from "react";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";

const Categories = () => {
    const [Categories, setCategories] = useState([]);
 
    useEffect(() => {
        axios.get('https://localhost:7201/api/Categories')
            .then(res => setCategories(res.data));
    }, []);


    const [CateCreate, setCateCreate] = useState({ Show: false });
    //handle
    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setCateCreate(prev => ({ ...prev, [name]: value }));
    }
    const handleCheck = (e) => {
        let name = e.target.name;
        let value = e.target.checked
        setCateCreate(prev => ({ ...prev, [name]: value }));
    }
    const handleImageChange = (e) => {
        setCateCreate(prev => ({ ...prev, ImageCateFile: e.target.files[0] }));
    }

    const handleSubmit =(e) =>{
        console.log(CateCreate);
        if (CateCreate.NameCategory == null ) {
            alert('Bạn chưa nhập đủ thông tin');
            return;
        }
        else {
            e.preventDefault();
            const formData = new FormData(); 
            Object.entries(CateCreate).forEach(([key, value]) => {
                console.log(key,value);
                formData.append(key, value);

            });
            axios.post(`https://localhost:7201/api/Categories`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((res) => {
                    console.log(res);
                    if (res.status === 201) {
                        alert( `Thêm danh mục ${res.data.nameCategory} thành công`); 
                        window.location.reload();
                    }
                })
                .catch(() => {
                    alert("Thêm thất bại!!!")
                })
        }

    }

 
    //modal bootstrap
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (<>
        <SidebarAdmin />
        <div id="right-panel" className="right-panel"  style={{ width: '86%' }}>
            {/* Header*/}
            <HeaderAdmin />
            {/* Header*/}
            <div className="breadcrumbs">
                <div className="col-sm-4">
                    <div className="page-header float-left">
                        <div className="page-title">
                            <h1>Danh mục sản phẩm</h1>
                        </div>
                    </div>
                </div>
                <div className="col-sm-8">
                    <div className="page-header float-right">
                        <div className="page-title">
                            <ol className="breadcrumb text-right">
                                <li className="breadcrumb-item active">Danh mục sản phẩm</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content" ><button onClick={handleShow} className="btn btn-outline-success" type="button"><i className="fa fa-plus"></i> Tạo mới danh mục</button></div>
            <div className="content mt-3  ">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <strong className="card-title">Danh sách thương hiệu</strong>
                                </div>
                                <div className="card-body">
                                    <table className="table table-striped">
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
                                            {Categories.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.nameCategory}</td>
                                                    <td className="col-4"><img className="w-25 h-25" src={`https://localhost:7201${item.iconCate}`} alt={item.brandName} /></td>
                                                    <td>{item.description}</td>
                                                    <td style={{ color: item.show ? 'green' : 'red' }}>{item.show ? 'Hiển thị' : 'Không hiển thị'}</td>
                                                    <td> <a type="button"  className="btn btn-outline-warning" href= {`/admin/categories/chinh-sua-danh-muc/${item.id}`} ><i className="fa fa-edit"></i> Chỉnh sửa</a>
                                                    {/* <button onClick={()=>handleDelete(item.id) } className="btn btn-outline-danger ml-2"><i className="fa fa-trash"></i> Xoá</button> */}</td> 
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
                <Modal.Title>Tạo mới danh mục sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Tên danh mục </Form.Label>
                        <Form.Control name="NameCategory" onChange={(e) => handleChange(e)} type="text" placeholder="Nhập tên danh mục" />
                    </Form.Group>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Ảnh hiển thị danh mục</Form.Label>
                        <Form.Control name="ImageCateFile" onChange={handleImageChange} type="file" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control name="Description" onChange={(e) => handleChange(e)} as="textarea" rows={3} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Check // prettier-ignore
                            type="switch"
                            id="custom-switch"
                            label="Hiển thị"
                            name="Show"
                            onChange={(e) => handleCheck(e)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="primary"  onClick={handleSubmit}>
                    Thêm mới
                </Button>
            </Modal.Footer>
        </Modal>
    </>);
}

export default Categories;