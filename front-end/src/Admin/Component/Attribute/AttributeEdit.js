import { useNavigate, useParams } from "react-router";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import { Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import Select from 'react-select';
import { jwtDecode } from "jwt-decode";
const AttributeEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [attribute, setattribute] = useState({nameAttribute:""});
    const [categories, setcategories] = useState([]);
    const [Catepost, setCatepost] = useState([]); 

    const [User, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token'); 
        if (token != null) {
          const decode = jwtDecode(token);
          setUser(decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
        };

        axios.get(`https://localhost:7201/api/Attributes/${id}`).then(res => {
            setattribute(res.data);
        }).catch(ex => console.log(ex));
        axios.get(`https://localhost:7201/api/Categories`).then(res => setcategories(res.data)).catch(ex => console.log(ex));


    }, []);
     
    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setattribute(pre => ({ ...pre, [name]: value }));
    }
    const categoryOptions = categories.map(item => ({
        value: item.id,
        label: item.nameCategory
    }));
    //xử lý chọn nhiều danh mục
    const handleMultiSelectChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setCatepost(selectedValues);
    } 
    const handleSubmit = (e)=>{
        e.preventDefault();
        if(attribute.nameAttribute !=="")
        {
            const formData = new FormData();
            Object.entries(attribute).forEach(([key, value]) => {
                formData.append(key, value);
            });
            Catepost.forEach((id) => {
                formData.append("CateId[]", id);
            });
            formData.append("User",User);
            axios.put(`https://localhost:7201/api/Attributes/${id}`,formData).then(res =>{
                if(res.status ===200)
                {
                    alert("Thay đổi thành công ");
                    navigate("/admin/attributes");
                }
            });
        }
        else{
            alert("Vui lòng nhập tên thuộc tính");
        }
       

    }
    console.log(attribute);
    return (<>
        <SidebarAdmin />
        <div id="right-panel" className="right-panel" style={{ width: '86%' }}>
            <HeaderAdmin />
            <div className="breadcrumbs">
                <div className="col-sm-4">
                    <div className="page-header float-left">
                        <div className="page-title">
                            <h1>Chỉnh sửa thuộc tính <b className="text-primary"> </b></h1>
                        </div>
                    </div>
                </div>
                <div className="col-sm-8">
                    <div className="page-header float-right">
                        <div className="page-title">
                            <ol className="breadcrumb text-right">
                                <li className="breadcrumb-item active">Chỉnh sửa thuộc tính</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content mt-3  ">
                <div className="animated fadeIn">
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Tên giá trị</Form.Label>
                            <Form.Control
                                name="nameAttribute"
                                value={attribute.nameAttribute || ""}
                                onChange={handleChange}
                                type="text"
                                placeholder="Nhập tên thương hiệu"
                            />
                        </Form.Group>
                        {/* <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Danh mục</Form.Label>
                            <Select
                                isMulti
                                name="CateId"
                                options={categoryOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={handleMultiSelectChange}
                                placeholder="Chọn danh mục..."

                            />
                        </Form.Group> */}
                        {/* <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Mô tả</Form.Label>
                                <Form.Control name="description" value={Categories.description ==null ? " ":Categories.description} onChange={handleChange} as="textarea" rows={3} />
                            </Form.Group> */}
                        {/* <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Check // prettier-ignore
                                    type="switch"
                                    id="custom-switch"
                                    label="Trạng thái"
                                    name="show"
                                    checked={Categories.show}
                                    onChange={handleCheck}
                                />
                            </Form.Group> */}
                        <Button onClick={(e)=>handleSubmit(e)} type="button" className="btn btn-outline-primary"><i className="fa fa-save"></i> Lưu thay đổi</Button>
                    </Form>
                </div>

            </div>
        </div>

    </>);
}

export default AttributeEdit;