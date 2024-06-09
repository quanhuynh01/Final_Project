import { useEffect, useState } from "react";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import axios from "axios"; 
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
 

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('https://freetestapi.com/api/v1/products')
          .then(res => setProducts(res.data));
      }, []);
    console.log(products)
    return (
        <>
            <SidebarAdmin />
            <div id="right-panel" className="right-panel">
                {/* Header*/}
                <HeaderAdmin />
                {/* Header*/}
                <div className="breadcrumbs">
                    <div className="col-sm-4">
                        <div className="page-header float-left">
                            <div className="page-title">
                                <h1>Sản phẩm</h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className="page-header float-right">
                            <div className="page-title">
                                <ol className="breadcrumb text-right">
                                    <li className="breadcrumb-item active">Sản phẩm</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content mt-3  ">
                    <Link to={"create"} className="btn btn-outline-success">Thêm sản phẩm</Link>
                </div>
                <div className="content mt-3  ">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên sản phẩm</th>
                                <th>Hãng</th>
                                <th>Mô tả</th>
                                <th>Màu</th>
                                <th>Ảnh sản phẩm</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((item, index) => (
                                <tr key={index} >
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.title}</td>
                                    <td>{item.brand}</td>
                                    <td>{item.description}</td>
                                    <td>{item.colors}</td>
                                    <td> <div><img className="w-25 h-25" src="https://i.imgur.com/q56nR6A.jpeg" alt="Product" /></div></td>
                                    <td>
                                        <div><button type="button" className="btn btn-outline-warning btn-delete" data-id={item.id}><i className="fa fa-edit"></i>Chỉnh sửa</button></div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>  
                </div> {/* .content */}
            </div>
        </>
    );
}

export default Products;
