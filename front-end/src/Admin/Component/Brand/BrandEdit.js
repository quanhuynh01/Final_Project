import {  useNavigate, useParams } from "react-router";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";

const BrandEdit = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const [brandData, setBrandData] = useState({
        brandName: "",
        description: "",
        active: false,
        imageFile: null
    });
    const [BrandName, setBrandName] = useState("");

    useEffect(() => {
        axios.get(`https://localhost:7201/api/Brands/${id}`)
            .then((res) => {
                setBrandData(res.data);
                setBrandName(res.data.brandName)
            });
    }, [id]);

    
    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setBrandData(prev => ({ ...prev, [name]: value }));
    } 
    const handleImageChange = (e) => {
        setBrandData(prev => ({ ...prev, imageFile: e.target.files[0] }));
    }
    const handleCheck = (e) => {
        const { name, checked } = e.target;
        setBrandData((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    };
 
    const handleSubmit = (e) => {
        //console.log(brandData);
        const formData = new FormData();
        // Thêm các trường dữ liệu vào FormData
        Object.entries(brandData).forEach(([key, value]) => {
            formData.append(key, value);
        });
         
        axios.put(`https://localhost:7201/api/Brands/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((res) => {
                //console.log(res);
                if (res.status === 201) {
                    alert(`Chỉnh sửa thương hiệu ${BrandName}  thành công`);
                    navigate('/admin/brand  ');
                }
            })
            .catch(() => {
                alert("Thêm thất bại!!!")
            })

    }
 

    return (
        <>
            <SidebarAdmin />
            <div id="right-panel" className="right-panel" style={{ width: '86%' }}>
                <HeaderAdmin />
                <div className="breadcrumbs">
                    <div className="col-sm-4">
                        <div className="page-header float-left">
                            <div className="page-title">
                                <h1>Chỉnh sửa thương hiệu <b className="text-primary">{BrandName}</b></h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className="page-header float-right">
                            <div className="page-title">
                                <ol className="breadcrumb text-right">
                                    <li className="breadcrumb-item active">Chỉnh sửa thương hiệu</li>
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
                                    name="brandName"
                                    value={brandData.brandName}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Nhập tên thương hiệu"
                                />
                            </Form.Group>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Ảnh thương hiệu</Form.Label>
                                <Form.Control name="imageFile" onChange={handleImageChange} type="file" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Mô tả</Form.Label>
                                <Form.Control name="description" value={brandData.description ==null ? " ":brandData.description} onChange={handleChange} as="textarea" rows={3} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Check // prettier-ignore
                                    type="switch"
                                    id="custom-switch"
                                    label="Trạng thái"
                                    name="active"
                                    checked={brandData.active}
                                    onChange={handleCheck}
                                />
                            </Form.Group>
                            <Button onClick={handleSubmit}  type="button" className="btn"><i className="fa fa-save"></i> Lưu thay đổi</Button>
                        </Form>
                    </div>
                </div> {/* .content */}
            </div>
        </>
    );
};

export default BrandEdit;
