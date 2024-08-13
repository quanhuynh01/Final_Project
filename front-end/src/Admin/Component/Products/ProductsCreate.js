import { Button, Form, FormLabel, InputGroup, Modal, Tab, Tabs } from "react-bootstrap";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Select from 'react-select';
import Swal from "sweetalert2";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { jwtDecode } from "jwt-decode";
import { Editor } from "primereact/editor";
import { escapeSelector } from "jquery";

const ProductsCreate = () => {
    const navigate = useNavigate();
    const [Brand, setBrand] = useState([]);
    const [Categories, setCategories] = useState([]);//hiển thị danh mục
    const [Catepost, setCatepost] = useState([]);//sản phẩm theo danh mục
    const [Attribute, setAttribute] = useState([]);//View thuộc tính của sản phẩm 
    const [Attributevalues, setAttributevalues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [AttributevaluesForProduct, setAttributevaluesForProduct] = useState([]);

    const [text, setText] = useState('');
    const [User, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState(1);//state lưu trữ tab

  
    useEffect(() => {
        axios.get(`https://localhost:7201/api/Brands`).then(res => setBrand(res.data));
        axios.get(`https://localhost:7201/api/Categories`).then(res => setCategories(res.data));
        axios.get(`https://localhost:7201/api/Attributes`).then(res => {
            setAttribute(res.data);
            setLoading(false)
        });
 
        const token = localStorage.getItem('token');
        if (token != null) {
            const decode = jwtDecode(token);
            setUser(decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
        };

    }, []);


    useEffect(() => {
        console.log(activeTab);
        if (activeTab == 2) {
            console.log(Catepost);
            const formData = new FormData();
            // Thêm tất cả category IDs vào FormData
            Catepost.forEach((id) => {
                formData.append("CateId[]", id);
            });
            axios.post('https://localhost:7201/api/Attributes/GetAttributesByCategory', formData)
                .then(res => {
                    setAttribute(res.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Lỗi khi lấy thuộc tính:', error);
                });
        }
    }, [activeTab, Catepost]);
    


    const [Products, setProducts] = useState({
        ProductName: "",
        SKU: "",
        Warranty: 0,
        WarrantyType: "",
        Price: 0,
        Stock: 0,
        SalePrice: 0,
        BrandId: 0,
        Description:"",
        avatarFiles: [],
        Active: false,
        BestSeller: false
    });
    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setProducts(prev => ({ ...prev, [name]: value }));
    }

    const handleEditorChange = (e) => {
        const htmlValue = e.htmlValue;
        setText(htmlValue);
        setProducts((prevState) => ({
            ...prevState,
            Description: htmlValue,
        }));
    };
    


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

    //xử lý chọn nhiều danh mục
    const handleMultiSelectChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setCatepost(selectedValues);
    }
    //xử lý tạo thuộc tính
    const [show, setShow] = useState(false); //modal
    const handleClose = () => setShow(false);
    const handleClickShowAttributeValue = (id) => {
       
        axios.get(`https://localhost:7201/api/Attributevalues/lsAttributeValue/${id}`).then(res => {
            console.log(res.data);
            if (res.data.success === true) {
                setShow(true)
                setAttributevalues(res.data.data)
            }
            else{
                alert("Thuộc tính chưa có dữ liệu");
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
            else {
                alert("Thuộc tính đã tồn tại")
                return prev; // Không thêm nếu id đã tồn tại
            }

        });
    }

    const handlePaste = (e) => {
        e.preventDefault();
        alert('Bạn không được dán vào trường dữ liệu này');
    };

    useEffect(() => {
    }, [Products])
    useEffect(() => {
    }, [Catepost]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
     
        console.log(Products);
        if (Products.ProductName === "") {
            Swal.fire({
                icon: 'warning',
                title: 'Thông báo',
                text: 'Vui lòng nhập tên sản phẩm',
            });
            return;
        }
        if (Products.SKU === "") {
            Swal.fire({
                icon: 'warning',
                title: 'Thông báo',
                text: 'Vui lòng nhập mã sản phẩm',
            });
            return;
        }
        // Kiểm tra AvatarFile
        if (!Array.isArray(Products.AvatarFile) || Products.AvatarFile.length <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Thông báo',
                text: 'Vui lòng chọn hình ảnh cho sản phẩm',
            });
            return;
        }
        // Kiểm tra AttributevaluesForProduct
        if (AttributevaluesForProduct.length <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Thông báo',
                text: 'Vui lòng chọn thuộc tính cho sản phẩm',
            });
            return;
        }
        // Kiểm tra BrandId
        if (Products.BrandId <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Thông báo',
                text: 'Vui lòng chọn hãng sản xuất',
            });
            return;
        }
        if (Products.Warranty === "") {
            Swal.fire({
                icon: 'warning',
                title: 'Thông báo',
                text: 'Vui lòng nhập bảo hành',
            });
            return;
        }
        if (Products.WarrantyType === "") {
            Swal.fire({
                icon: 'warning',
                title: 'Thông báo',
                text: 'Vui lòng nhập loại bảo hành',
            });
            return;
        }
        if (Products.Price < 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Thông báo',
                text: 'Giá sản phẩm không được nhỏ hơn 0',
            });
            return;
        }
        if (Products.Warranty < 0 || Products.Warranty ===0) {
            Swal.fire({
                icon: 'warning',
                title: 'Thông báo',
                text: 'Thông tin bảo hành không hợp lệ',
            });
            return;
        }
        if (Products.Stock < 0 || Products.Warranty ===0) {
            Swal.fire({
                icon: 'warning',
                title: 'Thông báo',
                text: 'Thông tin tồn kho không hợp lệ',
            });
            return;
        }
        if(Catepost.length <=0 )
        {
            Swal.fire({
                icon: 'warning',
                title: 'Thông báo',
                text: 'Vui lòng chọn danh mục sản phẩm',
            });
            return;
        }
        // Tạo FormData
        const formData = new FormData();
        Object.entries(Products).forEach(([key, value]) => {
            formData.append(key, value);
        });
        Products.AvatarFile.forEach((file) => {
            formData.append("AvatarFiles", file);
        });
        
        // Thêm tất cả category IDs vào FormData
        Catepost.forEach((id) => {
            formData.append("CateId[]", id);
        });

        // Thêm tất cả attribute values vào FormData
        AttributevaluesForProduct.forEach((id) => {
            formData.append("AttributevalueId[]", id.AttributeValueId);
        });
        formData.append("User",User); 
        // Hiển thị Swal khi đang xử lý
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
     //   Gửi yêu cầu axios
        axios.post(`https://localhost:7201/api/Products`, formData)
            .then(res => {
                if (res.status === 200) {
                    if(res.data.status ===true)
                    {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Thêm sản phẩm thành công",
                            showConfirmButton: false,
                            timer: 1000
                        });
                        navigate(`/admin/products/edit/${res.data.id}`);
                    }
                    else{
                        alert(res.data.message);
                    }
                    
                } else {
                    console.log('Lỗi server');
                }
            })
            .catch(error => {
                console.log('Lỗi khi thêm sản phẩm:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Lỗi khi thêm sản phẩm: ' + error.message,
                });
            });
    };

    const handleClick = ()=>{
            console.log(Catepost);
    }

    const idView = (rowData, { rowIndex }) => {
        return (
            <div>
                {rowIndex + 1}
            </div>
        );
    };
    


    const btnViewAttribute = (row)=>{
        return(<div>
                <Button className="btn btn-primary w-50" onClick={() => handleClickShowAttributeValue(row.id)}  >{row.nameAttribute}</Button>
        </div>)
    }
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

                    <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} id="uncontrolled-tab-example">
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
                                        <Form.Control accept="image/*" multiple onChange={handleImage} name="AvatarFile" type="file" />
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
                                  
                                    <div className="card col-6">
                                        <Editor value={text} onTextChange={handleEditorChange} style={{ height: '320px' }} />
                                    </div>  
                                </Form.Group>
                                <Form.Group className="mb-3 row p-3" >
                                    <div className="col-6">
                                        <Form.Label>Giá bán</Form.Label>
                                        <InputGroup className="mb-3">
                                            <Form.Control  onPaste={handlePaste} onChange={handleChange} name="Price" type="number" min={0} placeholder="Nhập giá bán" />
                                            <InputGroup.Text >.000 VNĐ</InputGroup.Text>
                                        </InputGroup>
                                    </div>
                                    {/* <div className="col-6">
                                        <Form.Label>Giá khuyến mãi</Form.Label>
                                        <InputGroup className="mb-3">
                                            <Form.Control onChange={handleChange} name="SalePrice" type="number" min={0} placeholder="Nhập khuyến mãi" />
                                            <InputGroup.Text>.000 VNĐ</InputGroup.Text>
                                        </InputGroup>
                                    </div> */}
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
                                            <option value={0} selected>Chọn hãng sản xuất</option>
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
                                                <Form.Check onChange={handleCheck} name="BestSeller" type="checkbox" label="Nổi bật" />
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
                                <Button onClick={handleSubmit} className="col-1 btn btn-success " type="button">
                                    <i className="fa fa-plus text-white"> Tạo mới</i>
                                </Button>
                            </Form>
                        </Tab>
                        <Tab eventKey={2} title="Thuộc tính sản phẩm"  >
                            <Form className="card p-3">
                                <h4>Chọn danh sách thuộc tính cho sản phẩm</h4>
                                
                                    {/* {
                                        Attribute.map((item, index) => {
                                            return (<div className="card p-2 col-6" key={index}>
                                                <Button className="btn btn-secondary" onClick={() => handleClickShowAttributeValue(item.id)} key={index} >{item.nameAttribute}</Button>
                                            </div>
                                            )
                                        })
                                    } */}
                                    <DataTable
                                        value={Attribute}
                                        loading={loading}
                                        paginator
                                        rows={10}
                                        rowsPerPageOptions={[10, 25, 50]}
                                        className="p-datatable-customers"
                                    >
                                        <Column body={idView} header="#" sortable />
                                        <Column body={btnViewAttribute} header="Tên thuộc tính" />
                                    </DataTable>
                                
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
                    {Array.isArray(Attributevalues) && Attributevalues.length > 0 ? (
                        Attributevalues.map((item, index) => (
                            <div className="col-12 mb-3 d-flex justify-content-between align-items-center" key={index}>
                                <Form.Label className="mb-0 w-75"><h5>{item.nameValue}</h5></Form.Label>
                                <Button onClick={() => hanleClickSaveHandleAttributeValue(item.id)} className="w-25">Chọn</Button>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 mb-3 d-flex justify-content-center align-items-center">
                            <h5>Chưa có dữ liệu</h5>
                        </div>
                    )}
                </Form.Group> 
                <div>
                    <h5>Các giá trị thuộc tính đã chọn:</h5>
                    <ul>
                        {AttributevaluesForProduct.map((attribute, index) => (
                            <li className="p-2" style={{ color: "blue" }} key={index}>
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