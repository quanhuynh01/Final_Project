import { useEffect, useState } from "react";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import { useParams } from "react-router";
import axios from "axios";

const AttributeValue = () => {
    const {id} = useParams() 
    const [lsAttributeValue, setlsAttributeValue] = useState([]);    
    useEffect(() => {
        axios.get(`https://localhost:7201/api/Attributevalues/lsAttributeValue/${id}`)
        .then(res=>setlsAttributeValue(res.data));
    }, []);
 
    return (<>
      <SidebarAdmin />
        <div id="right-panel" className="right-panel"  style={{ width: '86%' }}>
            {/* Header*/}
            <HeaderAdmin />
            {/* Header*/}
             
            <div className="breadcrumbs">
                <div className="col-sm-4">
                    <div className="page-header float-left">
                        <div className="page-title">
                            <h1>Danh sách giá trị thuộc tính sản phẩm</h1>
                        </div>
                    </div>
                </div>
                <div className="col-sm-8">
                    <div className="page-header float-right">
                        <div className="page-title">
                            <ol className="breadcrumb text-right">
                                <li className="breadcrumb-item active">Giá trị thuộc tính sản phẩm</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div> 
            <div className="content mt-3  ">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <strong className="card-title">Danh sách giá trị thuộc tính </strong>
                                </div>
                                <div className="card-body">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Tên thuộc tính</th>
                                               
                                                
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lsAttributeValue.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.nameValue}</td>
                                                    {/* <td><button className="btn btn-outline-success">Thêm giá trị</button></td> */}
                                                    {/* <td> <a type="button"  className="btn btn-outline-warning" href= {`http://localhost:3000/admin/brand/chinh-sua-thuong-hieu/${item.id}`} ><i className="fa fa-edit"></i> Chỉnh sửa</a>
                                                    <button onClick={()=>handleDelete(item.id) } className="btn btn-outline-danger ml-2"><i className="fa fa-trash"></i> Xoá</button> </td> */}
                                                </tr>
                                            ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div> 
            </div> {/* .content */}
        </div>
    
    
    </>  );
}
 
export default AttributeValue;