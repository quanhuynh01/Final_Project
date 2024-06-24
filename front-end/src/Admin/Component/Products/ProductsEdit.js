import { useParams } from "react-router";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, FormLabel, InputGroup } from "react-bootstrap";
import Select from 'react-select';

const ProductsEdit = () => {
    const { id } = useParams();
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
    const [Attributepost, setAttributepost] = useState([]); // Lưu thuộc tính của sản phẩm
    const [Categories, setCategories] = useState([]); // Hiển thị danh mục
    const [Catepost, setCatepost] = useState([]); // Sản phẩm theo danh mục

    useEffect(() => {
        axios.get(`https://localhost:7201/api/Products/${id}`).then(res => {
            console.log(res);
            const product = res.data.data.product;
            setProductDetail(product);  
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

    // Xử lý chọn thuộc tính
    const handleAttribute = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setAttributepost(selectedValues);
    };

    const categoryOptions = Categories.map(item => ({
        value: item.id,
        label: item.nameCategory
    }));

    const AttributeOptions = Attribute.map(item => ({
        value: item.id,
        label: item.nameAttribute + ":  " + item.value
    }));

    console.log(productDetail);

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
                        <Form.Group className="mb-3 row p-3">
                            <div className="col-6">
                                <FormLabel>Chọn danh sách thuộc tính cho sản phẩm</FormLabel>
                                <div>
                                    <Select
                                        isMulti
                                        name="attrId"
                                        options={AttributeOptions}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        onChange={handleAttribute}
                                        placeholder="Chọn thuộc tính..."
                                        value={AttributeOptions.filter(option => Attributepost.includes(option.value))}
                                    />
                                </div>
                            </div>
                        </Form.Group>
                        <Button className="col-1 btn btn-success" type="button">
                            <i className="fa fa-plus"></i>Tạo mới
                        </Button>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default ProductsEdit;
