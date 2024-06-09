import { Button, Form, InputGroup } from "react-bootstrap";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import axios from "axios";
import { useEffect, useState } from "react";

const ProductsCreate = () => {

    const [Brand, setBrand] = useState([]);
    useEffect(() => {
        axios.get(`https://localhost:7201/api/Brands`).then(res =>setBrand(res.data));
    }, []);
    console.log(Brand);
    return ( <>
              <SidebarAdmin />
        <div id="right-panel" className="right-panel" style={{width:"86%"}}> 
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
                            <Form.Control type="text" placeholder="Nhập mã sản phẩm" />
                            </div>
                            <div className="col-6">
                            <Form.Label>Mã sản phẩm</Form.Label>
                            <Form.Control type="text" placeholder="Nhập mã sản phẩm" />
                            </div> 
                            <div className="col-6">
                            <Form.Label>Ảnh sản phẩm</Form.Label>
                            <Form.Control type="file" />
                            </div>  
                        </Form.Group>
                        <Form.Group className="mb-3 row p-3" >
                        <div className="col-6">
                            <Form.Label>Giá bán</Form.Label>
                                <InputGroup className="mb-3"> 
                                    <Form.Control type="number" min={0} placeholder="Nhập giá bán" />
                                    <InputGroup.Text >.000 VNĐ</InputGroup.Text>
                                </InputGroup>
                            </div> 
                            <div className="col-6">
                            <Form.Label>Giá khuyến mãi</Form.Label>
                                <InputGroup className="mb-3"> 
                                    <Form.Control type="number" min={0} placeholder="Nhập khuyến mãi" />
                                    <InputGroup.Text>.000 VNĐ</InputGroup.Text>
                                </InputGroup>
                            </div> 
                            <div className="col-6">
                            <Form.Label>Bảo hành</Form.Label>
                                <InputGroup className="mb-3"> 
                                    <Form.Control type="number" min={0} placeholder="Nhập bảo hành" />
                                    <InputGroup.Text>Tháng</InputGroup.Text>
                                </InputGroup>
                            </div> 
                            <div className="col-6">
                            <Form.Label>Loại bảo hành</Form.Label>
                                <InputGroup className="mb-3"> 
                                    <Form.Control type="text" min={0} placeholder="Nhập loại bảo hành" />
                                    {/* <InputGroup.Text>Tháng</InputGroup.Text> */}
                                </InputGroup>
                            </div> 
                            <div className="col-6">
                                <Form.Label>Loại bảo hành</Form.Label>
                                <Form.Select className="form-control">
                                    <option disabled selected>Chọn hãng sản xuất</option>
                                    {
                                        Brand.map((item, index) => (
                                            <>

                                                <option key={index} value={item.id}>{item.brandName}</option>
                                            </>

                                        ))
                                    }
                                </Form.Select>
                            </div>
                            <div className=" col-6 row align-item-center">
                                <div className="col-6">
                                    <Form.Group className="mb-3" >
                                        <Form.Check type="checkbox" label="Bán chạy" />
                                    </Form.Group>
                                </div>
                                <div className="col-6">
                                    <Form.Group className="mb-3" >
                                        <Form.Check type="checkbox" label="Trạng thái" />
                                    </Form.Group>
                                </div>

                            </div>
                           
                        </Form.Group>
                        
                        <Button className="col-1 btn btn-success" type="button">
                            <i className="fa fa-plus"></i>Tạo mới
                        </Button>
                    </Form>
                </div>
            </div> {/* .content */}
        </div>

    </>);
}

export default ProductsCreate;