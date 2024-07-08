import { Button, Form, InputGroup, Modal, Table } from "react-bootstrap";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import { useEffect, useState } from "react";
import axios from "axios";
import Select from 'react-select';

const Discount = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [lsDiscout, setlsDiscout] = useState([]);
    const [Discount, setDiscount] = useState({
        Show: false,
    });
    const [Products, setProducts] = useState([]);
    const [Productspost, setProductspost] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        axios.get('https://localhost:7201/api/Discounts')
            .then(res => setlsDiscout(res.data));
        axios.get('https://localhost:7201/api/Products')
            .then(res => setProducts(res.data));
    }, []);

    const ProductsOptions = Products.map(item => ({
        value: item.id,
        label: item.productName,
    }));

    const handleChange = (e) => {
        var name = e.target.name;
        var value = e.target.value;
        setDiscount((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheck = (e) => {
        var name = e.target.name;
        var value = e.target.checked;
        setDiscount((prev) => ({ ...prev, [name]: value }));
    };

    const handleMultiSelectChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setProductspost(selectedValues);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        // Validate Title
        if (!Discount.Title || Discount.Title.trim() === "") {
            newErrors.Title = "Tiêu đề là bắt buộc.";
        }

        // Validate Products
        if (Productspost.length === 0) {
            newErrors.Products = "Chọn ít nhất một sản phẩm.";
        }

        // Validate Price
        if (!Discount.Price || Discount.Price <= 0) {
            newErrors.Price = "Giá khuyến mãi phải lớn hơn 0.";
        }

        // Validate TimeEnd
        if (!Discount.TimeEnd) {
            newErrors.TimeEnd = "Chọn ngày kết thúc.";
        } else {
            const endDate = new Date(Discount.TimeEnd);
            const now = new Date();
            if (endDate <= now) {
                newErrors.TimeEnd = "Ngày kết thúc phải lớn hơn ngày hiện tại.";
            }
        }

        // Nếu có lỗi, cập nhật state errors và không submit
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const formData = new FormData();
        Object.entries(Discount).forEach(([key, value]) => {
            formData.append(key, value);
        });

        Productspost.forEach((id) => {
            console.log(id);
            formData.append("ProId[]", id);
        });
        // Nếu không có lỗi, tiến hành submit
        axios.post('https://localhost:7201/api/Discounts', formData)
            .then(res => {
                console.log(res.data);
                // Handle response
                handleClose();
            })
            .catch(err => {
                console.error(err);
            });
    };

    return (
        <>
            <SidebarAdmin />
            <div id="right-panel" className="right-panel" style={{ width: '86%' }}>
                <HeaderAdmin />
                <div className="breadcrumbs">
                    <div className="col-sm-4">
                        <div className="page-header float-left">
                            <div className="page-title">
                                <h1>Giảm giá</h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className="page-header float-right">
                            <div className="page-title">
                                <ol className="breadcrumb text-right">
                                    <li className="breadcrumb-item active">Chương trình giảm giá</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    <div className="content mt-3">
                        <a className="btn btn-outline-success text-success" onClick={handleShow}>
                            Thêm khuyến mãi
                        </a>
                        <div className="mt-5">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tiêu đề</th>
                                        <th>Giá giảm</th>
                                        <th>Ngày tạo</th>
                                        <th>Ngày kết thúc</th>
                                        <th>Hiển thị</th>
                                        <th>Tình trạng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lsDiscout.length > 0 && lsDiscout !== null ? (
                                        lsDiscout.map((item, index) => {
                                            // Kiểm tra ngày kết thúc so với ngày hiện tại
                                            const endDate = new Date(item.timeEnd);
                                            const now = new Date();
                                            const isActive = endDate > now;

                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.title}</td>
                                                    <td>{item.price}</td>
                                                    <td>{item.timeCreate}</td>
                                                    <td>{item.timeEnd}</td>
                                                    <td className={item.show === true ? "text-success" : "text-danger"}>
                                                        {item.show === true ? "Hiển thị" : "Ẩn"}
                                                    </td>
                                                    <td className={isActive ? "text-success" : "text-danger"}>
                                                        {isActive ? "Hoạt động" : "Ngừng hoạt động"}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="7">No data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>

                        </div>
                    </div>
                </div>
            </div>

            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header>
                    <Modal.Title>Thêm chương trình khuyến mãi</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Tiêu đề</Form.Label>
                            <Form.Control name="Title" onChange={handleChange} type="" placeholder="Nhập tiêu đề khuyến mãi" />
                            {errors.Title && <div className="alert alert-danger" role="alert">
                                {errors.Title}
                            </div>}

                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Chọn sản phẩm</Form.Label>
                            <Select
                                isMulti
                                name="CateId"
                                options={ProductsOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={handleMultiSelectChange}
                                placeholder="Chọn sản phẩm..."
                            />
                            {errors.Products && <div className="alert alert-danger" role="alert">
                                {errors.Products}
                            </div>}

                        </Form.Group>
                        <InputGroup className="mb-3">
                            <Form.Control onChange={handleChange} name="Price" type="number" min={0} placeholder="Nhập giá khuyến mãi" />
                            <InputGroup.Text>.000 VNĐ</InputGroup.Text>
                            {errors.Price && <div className="alert alert-danger" role="alert">
                                {errors.Price}
                            </div>}
                        </InputGroup>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Chọn ngày kết thúc</Form.Label>
                            <Form.Control name="TimeEnd" onChange={handleChange} type="datetime-local" placeholder=" " />
                            {errors.TimeEnd && <div className="alert alert-danger" role="alert">
                                {errors.TimeEnd}
                            </div>}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Group className="mb-3">
                                <Form.Check onClick={handleCheck} name="Show" type="checkbox" label="Hiển thị" />
                            </Form.Group>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Discount;
