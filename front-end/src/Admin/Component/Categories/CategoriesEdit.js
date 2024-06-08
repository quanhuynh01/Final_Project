import { Navigate, useParams } from "react-router";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

const CategoriesEdit = () => {
    const {id} = useParams();
    const [Categories, setCategories] = useState({
        nameCategory: "",
        description: "",
        show: false,
        imageCateFile: null
    });
 
    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setCategories(prev => ({ ...prev, [name]: value }));
    } 
    const handleImageChange = (e) => {
        setCategories(prev => ({ ...prev, imageCateFile: e.target.files[0] }));
    }
    const handleCheck = (e) => {
        const { name, checked } = e.target;
        setCategories((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    }; 
 
    useEffect(() => {
        axios.get(`https://localhost:7201/api/Categories/${id}`)
        .then(res =>setCategories(res.data)); 
    }, []); 
    const handleSubmit =(e)=>{
        e.preventDefault();
        var formdata= new FormData();
        Object.entries(Categories).forEach(([key, value]) => {
            formdata.append(key, value);
        });
        axios.put(`https://localhost:7201/api/Categories/${id}`, formdata, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((res) => {
               // console.log(res);
                if (res.status === 200) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Chỉnh sửa thành công !",
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
            <div id="right-panel" className="right-panel" style={{ width: '86%' }}>
                <HeaderAdmin />
                <div className="breadcrumbs">
                    <div className="col-sm-4">
                        <div className="page-header float-left">
                            <div className="page-title">
                                <h1>Chỉnh sửa danh mục <b className="text-primary"> </b></h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className="page-header float-right">
                            <div className="page-title">
                                <ol className="breadcrumb text-right">
                                    <li className="breadcrumb-item active">Chỉnh sửa danh mục</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content mt-3  ">
                    <div className="animated fadeIn">
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Tên thương hiệu</Form.Label>
                            <Form.Control
                                name="nameCategory"
                                value={Categories.nameCategory || ""}
                                onChange={handleChange}
                                type="text"
                                placeholder="Nhập tên thương hiệu"
                            />
                            </Form.Group>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Ảnh thương hiệu</Form.Label>
                                <Form.Control name="imageCateFile" onChange={handleImageChange} type="file" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Mô tả</Form.Label>
                                <Form.Control name="description" value={Categories.description ==null ? " ":Categories.description} onChange={handleChange} as="textarea" rows={3} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Check // prettier-ignore
                                    type="switch"
                                    id="custom-switch"
                                    label="Trạng thái"
                                    name="show"
                                    checked={Categories.show}
                                    onChange={handleCheck}
                                />
                            </Form.Group>
                            <Button type="button"onClick={handleSubmit} className="btn btn-outline-primary"><i className="fa fa-save"></i> Lưu thay đổi</Button>
                            
                        </Form>  
                    </div>
                     
                </div> {/* .content */}
            </div>
    </> );
}
 
export default CategoriesEdit;