import { useEffect, useState } from "react";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import axios from "axios";

const Order = () => {
    const[lsOrder , setlsOrder] = useState([]);
    useEffect(()=>{
        axios.get(`https://localhost:7201/api/Orders`).then(res=>setlsOrder(res.data));
    },[])
  

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
                            <h1>Danh sách đơn hàng</h1>
                        </div>
                    </div>
                </div>
                <div className="col-sm-8">
                    <div className="page-header float-right">
                        <div className="page-title">
                            <ol className="breadcrumb text-right">
                                <li className="breadcrumb-item active">Danh sách đơn hàng</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div className="content mt-3  ">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <strong className="card-title">Danh sách thuộc tính</strong>
                                </div>
                                <div className="card-body">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Ngày tạo</th> 
                                                <th scope="col">Tên khách hàng</th>  
                                                <th scope="col">Trạng thái</th>
                                                <th>Chức năng</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lsOrder.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.dateShip}</td>
                                                    <td>{item.user.fullName}</td>  
                                                    <td>{item.deliveryStatus.status}</td>
                                                    <td>
                                                        <button className="btn btn-warning text-white mr-1">Xác nhận </button>
                                                        <button className="btn btn-primary mr-1">Giao hàng</button>
                                                        <button className="btn btn-success mr-1">Đã giao</button>
                                                     
                                                    </td>
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
            </div>
    </>)
}
export default Order;