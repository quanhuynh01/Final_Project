import { useEffect, useState } from "react";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import axios from "axios";
 
import { Link } from "react-router-dom";


const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('https://localhost:7201/api/Products')
            .then(res => setProducts(res.data));
    }, []);
    // const formatPrice = (price) => {
    //     var p = price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    //     if (!p.includes('000 VNĐ')) {
    //         p += ' 000 VNĐ';  
    //     } 
    //     return p; 
    // };
   
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
                                <th>Ảnh sản phẩm</th>
                                <th>Hãng</th> 
                                <th>Giá</th>   
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.productName}</td>
                                    <td><img  style={{width:"100px" ,height:"100px"}} src={`https://localhost:7201${item.avatar}`} alt=""/></td>
                                    <td>{item.brand.brandName}</td> 
                                    <td>{item.price}</td> 
                                    {/* <td>
                                        <div>
                                            <button
                                                type="button"
                                                className="btn btn-outline-warning btn-delete"
                                                data-id={item.id}
                                            >
                                                <i className="fa fa-edit"></i> Chỉnh sửa
                                            </button>
                                        </div>
                                    </td> */}
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
