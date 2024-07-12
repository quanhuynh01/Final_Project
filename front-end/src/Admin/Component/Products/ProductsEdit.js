import { useParams } from "react-router";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, InputGroup, Modal, Tab, Tabs } from "react-bootstrap";
import Select from 'react-select';
import Swal from "sweetalert2";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const ProductsEdit = () => {
    const { id } = useParams();
    const [show, setShow] = useState(false); //modal
    const handleClose = () => setShow(false);
    const [productDetail, setProductDetail] = useState({
        sku: "",
        productName: "",
        avatar: "",
        stock: 0,
        price: 0,
        salePrice: 0,
        warranty: 0,
        warrantyType: "",
        brandId: "",
        bestSeller: false,
        active: false
    });
    const [Brand, setBrand] = useState([]);
    const [Attribute, setAttribute] = useState([]); // View thuộc tính của sản phẩm 
    const [AttributeViewHave, setAttributeViewHave] = useState([]); // View thuộc tính của sản phẩm đang có
    const [Categories, setCategories] = useState([]); // Hiển thị danh mục
    const [Catepost, setCatepost] = useState([]); // Sản phẩm theo danh mục
    const [Attributevalues, setAttributevalues] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios.get(`https://localhost:7201/getProduct/${id}`).then(res => {
            setLoading(false);
            setAttributeViewHave(res.data.attributes);
            setProductDetail(res.data.product);  
        });
        axios.get(`https://localhost:7201/api/Categories`).then(res => setCategories(res.data));
        axios.get(`https://localhost:7201/api/Attributes`).then(res => setAttribute(res.data));
        axios.get(`https://localhost:7201/api/Brands`).then(res => setBrand(res.data));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductDetail(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCheck = (e) => {
        const { name, checked } = e.target;
        setProductDetail(prevState => ({
            ...prevState,
            [name]: checked
        }));
    };

    const handleSelected = (e) => {
        const { name, value } = e.target;
        setProductDetail(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Xử lý chọn nhiều danh mục
    const handleMultiSelectChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setCatepost(selectedValues);
    }; 

    const categoryOptions = Categories.map(item => ({
        value: item.id,
        label: item.nameCategory
    }));

    const handleDeleteAttribute = (id) => {
        axios.delete(`https://localhost:7201/deleteAtttributeProduct/${id}`)
          .then(res => {
            if (res.status === 200) {
              alert("Xoá thuộc tính thành công");
              // cập nhật state
              setAttributeViewHave(prevAttributes => prevAttributes.filter(attr => attr.id !== id));
            }
          })
          .catch(error => {
            console.error("There was an error deleting the attribute!", error);
          });
      };


    const handleClickShowAttributeValue = (id) => {
        //    console.log(id);
        axios.get(`https://localhost:7201/api/Attributevalues/lsAttributeValue/${id}`).then(res => {
            if (res.data.data !== null) {
                setShow(true)
                setAttributevalues(res.data.data)
            }
        }
        );
    } 
    const hanleClickSaveHandleAttributeValue = (idAttributeValue) => {
        console.log(idAttributeValue);
        axios.post(`https://localhost:7201/api/Attributevalues/saveAttributeValueForProduct/${idAttributeValue}?idPro=${id}`).then(res => {
            console.log(res);
            if (res.status === 200) {
                alert("Thêm thuộc tính thành công"); 
                    // Lấy thông tin được trả về từ server
                    const { id,nameAttribute, nameValue } = res.data; 
                    // Cập nhật lại state AttributeViewHave
                    setAttributeViewHave(prevState => [
                        ...prevState,
                        { id,nameAttribute, attributeValue: nameValue } // Có thể điều chỉnh cấu trúc dữ liệu tùy vào yêu cầu của bạn
                    ]);
                    setShow(false);
            }
        });
    }
    const HandleSubmit= (e )=>{
        e.preventDefault();
        const formData = new FormData();
        Object.entries(productDetail).forEach(([key, value]) => {
            formData.append(key, value);
        });
        Catepost.forEach((id) => {
            formData.append("CateId[]", id);
        });

        axios.put(`https://localhost:7201/api/Products/${id}`, formData)
        .then(res => {
            console.log(res);
            if (res.status === 200) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Chỉnh sửa sản phẩm thành công",
                    showConfirmButton: false,
                    timer: 1000
                });
                // navigate(`/admin/products/edit/${res.data.id}`);
            } else {
                console.log('Lỗi server');
            }
        })
        .catch(error => {
            console.log('Lỗi khi thêm sản phẩm:', error);
        });
    }
    
    const btnShow = (row) => {
        return (<>
            <Button style={{width:"200px"}} className="btn " onClick={() => handleClickShowAttributeValue(row.id)}   >{row.nameAttribute}</Button>
        </>)
    }
    return (
        <>
            <SidebarAdmin />
            <div id="right-panel" className="right-panel" style={{ width: "85.5%" }}>
                <HeaderAdmin />
                <div className="breadcrumbs">
                    <div className="col-sm-4">
                        <div className="page-header float-left">
                            <div className="page-title">
                                <h1>Chỉnh sửa sản phẩm</h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className="page-header float-right">
                            <div className="page-title">
                                <ol className="Productsbreadcrumb text-right">
                                    <li className="breadcrumb-item active">Chỉnh sửa sản phẩm</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="animated fadeIn">
                 
                </div>
                <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                    <Tab eventKey={1} title="Thông tin sản phẩm">
                           <Form className="card p-3">
                        <Form.Group className="mb-3 row p-3">
                            <div className="col-6">
                                <Form.Label>Tên sản phẩm</Form.Label>
                                <Form.Control value={productDetail.productName} onChange={handleChange} name="productName" type="text" placeholder="Nhập Tên sản phẩm" />
                            </div>
                            <div className="col-6">
                                <Form.Label>Mã sản phẩm</Form.Label>
                                <Form.Control value={productDetail.sku} onChange={handleChange} name="sku" type="text" placeholder="Nhập mã sản phẩm" />
                            </div>
                            <div className="col-6">
                                <Form.Label>Ảnh sản phẩm</Form.Label>
                                <Form.Control multiple name="avatarFile" type="file" />
                            </div>
                            <div className="col-6">
                                <Form.Label>Tồn kho</Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control value={productDetail.stock} onChange={handleChange} name="stock" type="number" min={0} placeholder="Nhập tồn kho" />
                                </InputGroup>
                            </div>
                            <div className="col-6">
                                <Form.Label>Danh mục</Form.Label>
                                <Select
                                    name="CateId"
                                    options={categoryOptions}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={handleMultiSelectChange}
                                    placeholder="Chọn danh mục..."
                                    isMulti
                                    value={categoryOptions.filter(option => Catepost.includes(option.value))}
                                />
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3 row p-3">
                            <div className="col-6">
                                <Form.Label>Giá bán</Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control value={productDetail.price} onChange={handleChange} name="price" type="number" min={0} placeholder="Nhập giá bán" />
                                    <InputGroup.Text>.000 VNĐ</InputGroup.Text>
                                </InputGroup>
                            </div>
                            <div className="col-6">
                                <Form.Label>Giá khuyến mãi</Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control value={productDetail.salePrice} onChange={handleChange} name="salePrice" type="number" min={0} placeholder="Nhập khuyến mãi" />
                                    <InputGroup.Text>.000 VNĐ</InputGroup.Text>
                                </InputGroup>
                            </div>
                            <div className="col-6">
                                <Form.Label>Bảo hành</Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control value={productDetail.warranty} onChange={handleChange} name="warranty" type="number" min={0} placeholder="Nhập bảo hành" />
                                    <InputGroup.Text>Tháng</InputGroup.Text>
                                </InputGroup>
                            </div>
                            <div className="col-6">
                                <Form.Label>Loại bảo hành</Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control value={productDetail.warrantyType} onChange={handleChange} name="warrantyType" type="text" placeholder="Nhập loại bảo hành" />
                                </InputGroup>
                            </div>
                            <div className="col-6">
                                <Form.Label>Hãng sản xuất</Form.Label>
                                <Form.Select name="brandId" value={productDetail.brandId} onChange={handleSelected} className="form-control">
                                    <option disabled>Chọn hãng sản xuất</option>
                                    {Brand.map((item, index) => (
                                        <option key={index} value={item.id}>{item.brandName}</option>
                                    ))}
                                </Form.Select>
                            </div>
                            <div className="col-6 row align-item-center">
                                <div className="col-6">
                                    <Form.Group className="mb-3">
                                        <Form.Check checked={productDetail.bestSeller} onChange={handleCheck} name="bestSeller" type="checkbox" label="Bán chạy" />
                                    </Form.Group>
                                </div>
                                <div className="col-6">
                                    <Form.Group className="mb-3">
                                        <Form.Check checked={productDetail.active} onChange={handleCheck} name="active" type="checkbox" label="Trạng thái" />
                                    </Form.Group>
                                </div>
                            </div>
                        </Form.Group>
                        <hr></hr>
                       
                        <Button className="col-1 btn btn-success" onClick={(e)=>HandleSubmit(e)} type="button">
                            <i className="fa fa-check text-white">Chỉnh sửa</i>
                        </Button>
                    </Form>
                    </Tab>
                    <Tab eventKey={2} title="Thuộc tính sản phẩm">
                        <div className="content card p-3 mt-4">
                            <h4 className="text-center">Danh sách thuộc tính sản phẩm đang có</h4>
                            <div className="row">
                            {
                                 AttributeViewHave.map((item,index)=>{
                                    return(<div className="mr-4 ml-4 col-2 p-3" key={index}>
                                            <label>{item.nameAttribute} : {item.attributeValue}</label>
                                            <button onClick={()=>handleDeleteAttribute(item.id)} className="btn btn-danger ml-2">Xoá</button>
                                    </div>)
                                 })
                            }
                            </div> 
                        </div>
                       
                        <Form className="card p-3">    
                            <h4>Chọn danh sách thuộc tính cho sản phẩm</h4>
                            <DataTable
                                value={Attribute}
                                loading={loading}
                                paginator
                                rows={10}
                                rowsPerPageOptions={[10, 25, 50]}
                                className="p-datatable-customers"
                            >
                                <Column field="id" header="###" sortable />
                                <Column body={btnShow} header="Tên thuộc tính" />
                            </DataTable>
                            {/* <Form.Group className="mb-3 row p-3">
                                {
                                    Attribute.map((item,index)=>{
                                        return(<div className="card p-2 col-6" key={index}>
                                                 <FormLabel key={index} className="  p-2">{item.nameAttribute}</FormLabel>
                                                 <Button className="btn " onClick={()=>handleClickShowAttributeValue(item.id)} key={index} >{item.nameAttribute}</Button>   
                                        </div> 
                                        )
                                    }) 
                                } 
                                 
                        </Form.Group> */}
                        </Form>  
                    </Tab>
                   
                </Tabs>
            </div>

            {/* //modal hiển thị giá trị thuộc tính sản phẩm */}
            <Modal show={show} onHide={handleClose} size="md">
                <Modal.Header>
                    <Modal.Title>Danh sách giá trị thuộc tính</Modal.Title>
                </Modal.Header>
                <Modal.Body className="">
                    <Form.Group className="col-12">
                        {Array.isArray(Attributevalues) && Attributevalues.map((item, index) =>
                        {
                            return (
                                <div className="col-12 mb-3 d-flex justify-content-between align-items-center" key={index}>
                                    <Form.Label className="mb-0 w-75"><h5>{item.nameValue}</h5></Form.Label>
                                    <Button onClick={()=>hanleClickSaveHandleAttributeValue(item.id)} className="w-25">Chọn</Button>
                                </div>
                            )
                        }
                       )}
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Close
                    </Button> 
                </Modal.Footer>
            </Modal>

        </>
    );
};

export default ProductsEdit;
