import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";

const Discount = () => {
    return ( <>
     <SidebarAdmin />
          <div id="right-panel" className="right-panel"  style={{ width: '86%' }}>
            {/* Header*/}
            <HeaderAdmin />
            {/* Header*/}
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
                <div className="content mt-3  ">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <strong className="card-title">Danh sách chương trình khuyến mãi</strong>
                                </div>
                                    <div className="card-body">
                                        <label className="switch switch-3d switch-primary mr-3">
                                            <input type="checkbox" className="switch-input" defaultChecked="true" /> <span className="switch-label" /> <span className="switch-handle" /></label>
                                        <label className="switch switch-3d switch-secondary mr-3"><input type="checkbox" className="switch-input" defaultChecked="true" /> <span className="switch-label" /> <span className="switch-handle" /></label>
                                        <label className="switch switch-3d switch-success mr-3"><input type="checkbox" className="switch-input" defaultChecked="true" /> <span className="switch-label" /> <span className="switch-handle" /></label>
                                        <label className="switch switch-3d switch-warning mr-3"><input type="checkbox" className="switch-input" defaultChecked="true" /> <span className="switch-label" /> <span className="switch-handle" /></label>
                                        <label className="switch switch-3d switch-info mr-3"><input type="checkbox" className="switch-input" defaultChecked="true" /> <span className="switch-label" /> <span className="switch-handle" /></label>
                                        <label className="switch switch-3d switch-danger mr-3"><input type="checkbox" className="switch-input" defaultChecked="true" /> <span className="switch-label" /> <span className="switch-handle" /></label>
                                    </div>

                            </div>
                        </div>

                    </div>
                </div> 
            </div> {/* .content */}
            </div>
            </div>
    </> );
}
 
export default Discount;