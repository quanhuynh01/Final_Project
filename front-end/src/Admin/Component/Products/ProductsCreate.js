import { Button, Form, FormLabel, InputGroup, Modal, Tab, Tabs } from "react-bootstrap";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Select from 'react-select';
import Swal from "sweetalert2";

const ProductsCreate = () => {
    const navigate = useNavigate();
    const [Brand, setBrand] = useState([]);
    const [Categories, setCategories] = useState([]);//hiển thị danh mục
    const [Catepost, setCatepost] = useState([]);//sản phẩm theo danh mục
    const [Attribute, setAttribute] = useState([]);//View thuộc tính của sản phẩm 
    const [Attributevalues, setAttributevalues] = useState([]);

    const [AttributevaluesForProduct, setAttributevaluesForProduct] = useState([]);
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
        console.log(name, value);
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

    //xử lý chọn nhiều danh mục
    const handleMultiSelectChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setCatepost(selectedValues);
    }
    //xử lý tạo thuộc tính
    const [show, setShow] = useState(false); //modal
    const handleClose = () => setShow(false);
    const handleClickShowAttributeValue = (id) => {
        console.log(id);
        axios.get(`https://localhost:7201/api/Attributevalues/lsAttributeValue/${id}`).then(res => {
            if (res.data.data !== null) {
                setShow(true)
                setAttributevalues(res.data.data)
            }
        }
        );
    }
    //Xử lý phần thuộc tính sản phẩm
    const hanleClickSaveHandleAttributeValue = (id) => {
        console.log(id);
        setAttributevaluesForProduct(prev => { 
            if (!prev.some(attribute => attribute.AttributeValueId === id)) {
                // Thêm id mới vào mảng
                return [...prev, { AttributeValueId: id }];
            }
            else
            {
                alert("Thuộc tính đã tồn tại")
                return prev; // Không thêm nếu id đã tồn tại
            }
           
        });
    }
    
    console.log(AttributevaluesForProduct);

    useEffect(() => {
    }, [Products])
    useEffect(() => {
    }, [Catepost]);

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Check if BrandId is selected and at least one image file is uploaded
        if (Products.BrandId !== undefined && Array.isArray(Products.AvatarFile) && Products.AvatarFile.length > 0 && AttributevaluesForProduct.length > 0) {
            const formData = new FormData();
            Object.entries(Products).forEach(([key, value]) => {
                formData.append(key, value);
            });
    
            // Add all image files to FormData if they exist
            Products.AvatarFile.forEach((file) => {
                formData.append("AvatarFiles", file);
            });
    
            // Add all category IDs to FormData
            Catepost.forEach((id) => {
                formData.append("CateId[]", id);
            });
    
            // Add all attribute values to FormData
            AttributevaluesForProduct.forEach((id) => {
                formData.append("AttributevalueId[]", id.AttributeValueId);
            });
    
            // Log the FormData content for debugging
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
    
            Swal.fire({
                title: "Thêm sản phẩm",
                html: "Đang xử lý ...",
                timer: 1000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                }
            }).then((result) => {
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
                    } else {
                        console.log('Lỗi server');
                    }
                })
                .catch(error => {
                    console.log('Lỗi khi thêm sản phẩm:', error);
                });
        } else {
            // Kiểm tra các trường hợp cụ thể và hiển thị thông báo tương ứng
            if (Products.BrandId === undefined) {
                alert('Vui lòng chọn hãng sản xuất');
            } else if (!Array.isArray(Products.AvatarFile) || Products.AvatarFile.length <= 0) {
                alert('Vui lòng chọn hình ảnh cho sản phẩm');
            } else if (AttributevaluesForProduct.length <= 0) {
                alert('Vui lòng chọn thuộc tính cho sản phẩm');
            }
        }
    };
    
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

                    <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                        <Tab eventKey={1} title="Thông tin sản phẩm">
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
                                <Button onClick={handleSubmit} className="col-1 btn btn-success "  type="button">
                                    <i className="fa fa-plus text-white"> Tạo mới</i>
                                </Button>
                            </Form>
                        </Tab>
                        <Tab eventKey={2} title="Thuộc tính sản phẩm">
                            <Form className="card p-3">
                                <h4>Chọn danh sách thuộc tính cho sản phẩm</h4>
                                <Form.Group className="mb-3 row p-3">
                                    {
                                        Attribute.map((item, index) => {
                                            return (<div className="card p-2 col-6" key={index}>
                                                <Button className="btn " onClick={() => handleClickShowAttributeValue(item.id)} key={index} >{item.nameAttribute}</Button>
                                            </div>
                                            )
                                        })
                                    }
                                </Form.Group>
                            </Form>
                        </Tab> 
                    </Tabs> 
                </div>
            </div> {/* .content */}
        </div>
        {/* //modal hiển thị giá trị thuộc tính sản phẩm */}
        <Modal show={show} onHide={handleClose} size="md">
            <Modal.Header>
                <Modal.Title>Danh sách giá trị thuộc tính</Modal.Title> 
            </Modal.Header>
            <Modal.Body className="">
                <Form.Group className="col-12">
                    {Array.isArray(Attributevalues) && Attributevalues.map((item, index) => {
                        return ((
                            <div className="col-12 mb-3 d-flex justify-content-between align-items-center" key={index}>
                                <Form.Label className="mb-0 w-75"><h5>{item.nameValue}</h5></Form.Label>
                                <Button onClick={() => hanleClickSaveHandleAttributeValue(item.id)} className="w-25">Chọn</Button> 
                            </div>
                        ))
                    }
                    )}
                </Form.Group> 
                <div>
                <h5>Các giá trị thuộc tính đã chọn:</h5>
                <ul>
                    {AttributevaluesForProduct.map((attribute, index) => (
                        <li className="p-2" style={{color:"blue"}} key={index}>
                            {Attributevalues.find(item => item.id === attribute.AttributeValueId)?.nameValue}
                        </li>
                    ))}
                </ul>
            </div>
            </Modal.Body> 
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    </>);
}

export default ProductsCreate;