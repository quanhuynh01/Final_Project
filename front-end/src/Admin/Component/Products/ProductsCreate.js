import { Button, Form, FormLabel, InputGroup } from "react-bootstrap";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Select from 'react-select';
import $ from 'jquery'
import Swal from "sweetalert2";

const ProductsCreate = () => {
    const navigate = useNavigate();
    const [Brand, setBrand] = useState([]);
    const [Categories, setCategories] = useState([]);//hiển thị danh mục
    const [Catepost, setCatepost] = useState([]);//sản phẩm theo danh mục
    const [Attribute, setAttribute] = useState([]);//View thuộc tính của sản phẩm
    const [Attributepost, setAttributepost] = useState([]);//lưu thuộc tính của sản phẩm

    useEffect(() => {
        axios.get(`https://localhost:7201/api/Brands`).then(res => setBrand(res.data));
        axios.get(`https://localhost:7201/api/Categories`).then(res => setCategories(res.data));
        axios.get(`https://localhost:7201/api/Attributes`).then(res => setAttribute(res.data));
    }, []);

    const [Products, setProducts] = useState({ avatarFiles: [], Active: false, BestSeller: false });
    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setProducts(prev => ({ ...prev, [name]: value }));
    }
    const handleSelected = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setProducts(prev => ({ ...prev, [name]: value }));
    }
    const handleCheck = (e) => {
        let name = e.target.name;
        let value = e.target.checked;
        setProducts(prev => ({ ...prev, [name]: value }));
    }

    const handleImage = (e) => {
        setProducts(prev => ({ ...prev, AvatarFile: Array.from(e.target.files) }));
    }

    const categoryOptions = Categories.map(item => ({
        value: item.id,
        label: item.nameCategory
    }));
    const AttributeOptions = Attribute.map(item => (
        {
            value: item.id,
            label: item.nameAttribute + ":  " + item.value
        }
    ));
    
    //xử lý chọn nhiều danh mục
    const handleMultiSelectChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : []; 
        setCatepost(selectedValues);
    }
    
    //xử lý chọn thuộc tính
    const handleAttribute = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setAttributepost(selectedValues);
    }
    console.log(Attributepost);

    useEffect(() => {
    }, [Products])
    useEffect(() => {
    }, [Catepost]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(Products).forEach(([key, value]) => {
            formData.append(key, value);
        });


        // Thêm tất cả các tệp hình ảnh vào FormData
        Products.AvatarFile.forEach((file) => {
            formData.append("AvatarFiles", file);
        }); 
        Catepost.forEach((id) => {
            formData.append("CateId[]", id);
        }); 
        Attributepost.forEach((id) => {
            formData.append("AttrId[]", id);
        });  
        if (Products.BrandId !== undefined) { 
            Swal.fire({
                title: "Thêm sản phẩm",
                html: "Đang xử lý ...",
                timer:1000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading(); 
                } 
            }).then((result) => {
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {
                    console.log("I was closed by the timer");
                }
            });
            axios.post(`https://localhost:7201/api/Products`, formData)
                .then(res => {

                    if (res.status === 200) {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Thêm sản phẩm thành công",
                            showConfirmButton: false,
                            timer: 1000
                          });
                        navigate(`/admin/products/edit/${res.data.id}`);
                    }
                    else {
                        console.log('Lỗi server');
                    }
                });
        } else {
            alert('Vui lòng chọn hãng sản xuất');
        }
    }

    //console.log(Attributevalues);



    return (<>
        <SidebarAdmin />
        <div id="right-panel" className="right-panel" style={{ width: "86%" }}>
            <HeaderAdmin />
            <div className="breadcrumbs">
                <div className="col-sm-4">
                    <div className="page-header float-left">
                        <div className="page-title">
                            <h1>Thêm sản phẩm</h1>
                        </div>
                    </div>
                </div>

                <div className="col-sm-8">
                    <div className="page-header float-right">
                        <div className="page-title">
                            <ol className="breadcrumb text-right">
                                <li className="breadcrumb-item active">Thêm sản phẩm</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content mt-3  ">
                <div className="animated fadeIn">
                    <Form className="card p-3">
                        <Form.Group className="mb-3 row p-3" >
                            <div className="col-6">
                                <Form.Label>Tên sản phẩm</Form.Label>
                                <Form.Control onChange={handleChange} name="ProductName" type="text" placeholder="Nhập mã sản phẩm" />
                            </div>
                            <div className="col-6">
                                <Form.Label>Mã sản phẩm</Form.Label>
                                <Form.Control onChange={handleChange} name="SKU" type="text" placeholder="Nhập mã sản phẩm" />
                            </div>
                            <div className="col-6">
                                <Form.Label>Ảnh sản phẩm</Form.Label>
                                <Form.Control multiple onChange={handleImage} name="AvatarFile" type="file" />
                            </div>
                            <div className="col-6">
                                <Form.Label>Tồn kho</Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control onChange={handleChange} name="Stock" type="number" min={0} placeholder="Nhập tồn kho" />
                                </InputGroup>
                            </div>
                            <div className="col-6">
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
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3 row p-3" >
                            <div className="col-6">
                                <Form.Label>Giá bán</Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control onChange={handleChange} name="Price" type="number" min={0} placeholder="Nhập giá bán" />
                                    <InputGroup.Text >.000 VNĐ</InputGroup.Text>
                                </InputGroup>
                            </div>
                            <div className="col-6">
                                <Form.Label>Giá khuyến mãi</Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control onChange={handleChange} name="SalePrice" type="number" min={0} placeholder="Nhập khuyến mãi" />
                                    <InputGroup.Text>.000 VNĐ</InputGroup.Text>
                                </InputGroup>
                            </div>
                            <div className="col-6">
                                <Form.Label>Bảo hành</Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control onChange={handleChange} name="Warranty" type="number" min={0} placeholder="Nhập bảo hành" />
                                    <InputGroup.Text>Tháng</InputGroup.Text>
                                </InputGroup>
                            </div>
                            <div className="col-6">
                                <Form.Label>Loại bảo hành</Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control onChange={handleChange} name="WarrantyType" type="text" placeholder="Nhập loại bảo hành" />
                                    {/* <InputGroup.Text>Tháng</InputGroup.Text> */}
                                </InputGroup>
                            </div>
                            <div className="col-6">
                                <Form.Label>Hãng sản xuất</Form.Label>
                                <Form.Select name="BrandId" onChange={handleSelected} className="form-control" value={Products.BrandId}>
                                    <option disabled>Chọn hãng sản xuất</option>
                                    {
                                        Brand.map((item, index) => (
                                            <option key={index} value={item.id}>{item.brandName}</option>
                                        ))
                                    }
                                </Form.Select>

                            </div>
                            <div className=" col-6 row align-item-center">
                                <div className="col-6">
                                    <Form.Group className="mb-3" >
                                        <Form.Check onChange={handleCheck} name="BestSeller" type="checkbox" label="Bán chạy" />
                                    </Form.Group>
                                </div>
                                <div className="col-6">
                                    <Form.Group className="mb-3" >
                                        <Form.Check onChange={handleCheck} name="Active" type="checkbox" label="Trạng thái" />
                                    </Form.Group>
                                </div>

                            </div>

                        </Form.Group>
                        <hr></hr>
                        <Form.Group className="mb-3 row p-3" >
                            <div className="col-6">
                                <FormLabel>Chọn danh sách thuộc tính cho sản phẩm</FormLabel>
                                <div >
                                    <Select
                                        isMulti
                                        name="AttrId"
                                        options={AttributeOptions}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        onChange={handleAttribute}
                                        placeholder="Chọn thuộc tính..." 
                                    /> 
                                </div> 
                            </div>
                        </Form.Group>
                        <Button onClick={handleSubmit} className="col-1 btn btn-success" type="button">
                            <i className="fa fa-plus"></i>Tạo mới
                        </Button>
                    </Form>
                </div>
            </div> {/* .content */}
        </div>

    </>);
}

export default ProductsCreate;