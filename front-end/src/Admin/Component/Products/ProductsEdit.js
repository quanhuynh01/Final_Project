import { useParams } from "react-router";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";

const ProductsEdit = () => {
    const {id} = useParams();
    console.log(id);
    return ( <>
        <SidebarAdmin />
        <div id="right-panel" className="right-panel"style={{width:"85.5%"}}>
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
                                <ol className="breadcrumb text-right">
                                    <li className="breadcrumb-item active">Chỉnh sửa sản phẩm</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </> );
}
 
export default ProductsEdit;