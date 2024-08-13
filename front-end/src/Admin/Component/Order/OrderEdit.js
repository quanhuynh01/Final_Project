import { useEffect, useState } from "react";
import { useParams } from "react-router";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import axios from "axios";

const OrderEdit = () => {
    const {id} = useParams();
    const [order, setorder] = useState({});
    useEffect(() => {
        axios.get(`https://localhost:7201/api/Orders/${id}`).then(res=>{
            setorder(res.data);
        });
    }, []);
    console.log(order);
    return ( <> 
    <SidebarAdmin />
        <div id="right-panel" className="right-panel" style={{ width: '86%' }}>
                <HeaderAdmin/>
                <div className="breadcrumbs">
                    <div className="col-sm-4">
                        <div className="page-header float-left">
                            <div className="page-title">
                                <h1>Chi tiết đơn hàng</h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className="page-header float-right">
                            <div className="page-title">
                                <ol className="breadcrumb text-right">
                                    <li className="breadcrumb-item active">Chi tiết đơn hàng</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div> 
                <div className="content mt-3">
                    <div className="animated fadeIn">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-header">
                                        <strong className="card-title">Danh sách đơn hàng</strong>
                                    </div>
                                    <div className="card-body">
                                
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
      
        </div>

    </> );
}
 
export default OrderEdit;