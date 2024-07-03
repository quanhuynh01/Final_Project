import { useEffect, useState } from "react";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import axios from "axios";
 
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";


const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('https://localhost:7201/api/Products')
            .then(res => setProducts(res.data));
    }, []);
    const HandleDelete=(id)=>{
        Swal.fire({
            title: "Bạn có muốn xóa",
            text: "Dữ liệu liên quan đến sản phẩm này sẽ bị mất",
            icon: "warning",
            showCancelButton: "true",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete"
          }).then((result) => {
              if (result.isConfirmed) {
                  axios.delete(`https://localhost:7201/api/Products/${id}`).then(res => { 
                        console.log(res.data.id);
                      if (res.status === 200) {
                          Swal.fire({
                              title: "Deleted!",
                              text: "Your file has been deleted.",
                              icon: "success"
                          }); 
                          setProducts(prevProducts => prevProducts.filter(product => product.id !== res.data.id));
                      }
                      
                  }) 
              }
          });
    }
   
    return (
        <>
            <SidebarAdmin />
            <div id="right-panel" className="right-panel" style={{width:"86%"}}>
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
                            {products.filter(p=>p.softDelete === false).map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.productName}</td>
                                    <td><img  style={{width:"100px" ,height:"100px"}} src={`https://localhost:7201${item.avatar}`} alt=""/></td>
                                    <td>{item.brand.brandName}</td> 
                                    <td>{item.price}</td> 
                                    <td>
                                        <div>
                                            <a href={`products/edit/${item.id}`}
                                                className="btn btn-outline-warning btn-delete mr-2"
                                            >
                                                <i className="fa fa-edit"></i> Chỉnh sửa
                                            </a>
                                            <Button onClick={()=>HandleDelete(item.id)} className="btn btn-danger" > <i className="fa fa-trash text-white"></i></Button>
                                        </div>
                                       
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
