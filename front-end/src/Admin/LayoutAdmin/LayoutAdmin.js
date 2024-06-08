import { Outlet } from "react-router";
import HeaderAdmin from "../Component/HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../Component/SidebarAdmin/SidebarAdmin";

const LayoutAdmin = () => {
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
                                <h1>Dashboard</h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className="page-header float-right">
                            <div className="page-title">
                                <ol className="breadcrumb text-right">
                                    <li className="breadcrumb-item active">Dashboard</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content mt-3  ">
                    <div className="col-sm-12">
                        <div className="alert  alert-success alert-dismissible fade show" role="alert">
                            <span className="badge badge-pill badge-success">Success</span> You successfully read this important alert message.
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                    </div>
                    <div className="col-sm-6 col-lg-3">
                        <div className="card text-white bg-flat-color-1">
                            <div className="card-body pb-0">
                                <div className="dropdown float-right">
                                    <button className="btn bg-transparent dropdown-toggle theme-toggle text-light" type="button" id="dropdownMenuButton1" data-toggle="dropdown">
                                        <i className="fa fa-cog" />
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                        <div className="dropdown-menu-content">
                                            <a className="dropdown-item" href="#">Action</a>
                                            <a className="dropdown-item" href="#">Another action</a>
                                            <a className="dropdown-item" href="#">Something else here</a>
                                        </div>
                                    </div>
                                </div>
                                <h4 className="mb-0">
                                    <span className="count">10468</span>
                                </h4>
                                <p className="text-light">Members online</p>
                                <div className="chart-wrapper px-0" style={{ height: 70 }} height={70}><div className="chartjs-size-monitor" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', visibility: 'hidden', zIndex: -1 }}><div className="chartjs-size-monitor-expand" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', visibility: 'hidden', zIndex: -1 }}><div style={{ position: 'absolute', width: 1000000, height: 1000000, left: 0, top: 0 }} /></div><div className="chartjs-size-monitor-shrink" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', visibility: 'hidden', zIndex: -1 }}><div style={{ position: 'absolute', width: '200%', height: '200%', left: 0, top: 0 }} /></div></div>
                                    <canvas id="widgetChart1" height={70} style={{ display: 'block', width: 324, height: 70 }} width={324} className="chartjs-render-monitor" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*/.col*/}
                    <div className="col-sm-6 col-lg-3">
                        <div className="card text-white bg-flat-color-2">
                            <div className="card-body pb-0">
                                <div className="dropdown float-right">
                                    <button className="btn bg-transparent dropdown-toggle theme-toggle text-light" type="button" id="dropdownMenuButton2" data-toggle="dropdown">
                                        <i className="fa fa-cog" />
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                                        <div className="dropdown-menu-content">
                                            <a className="dropdown-item" href="#">Action</a>
                                            <a className="dropdown-item" href="#">Another action</a>
                                            <a className="dropdown-item" href="#">Something else here</a>
                                        </div>
                                    </div>
                                </div>
                                <h4 className="mb-0">
                                    <span className="count">10468</span>
                                </h4>
                                <p className="text-light">Members online</p>
                                <div className="chart-wrapper px-0" style={{ height: 70 }} height={70}><div className="chartjs-size-monitor" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', visibility: 'hidden', zIndex: -1 }}><div className="chartjs-size-monitor-expand" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', visibility: 'hidden', zIndex: -1 }}><div style={{ position: 'absolute', width: 1000000, height: 1000000, left: 0, top: 0 }} /></div><div className="chartjs-size-monitor-shrink" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', visibility: 'hidden', zIndex: -1 }}><div style={{ position: 'absolute', width: '200%', height: '200%', left: 0, top: 0 }} /></div></div>
                                    <canvas id="widgetChart2" height={70} style={{ display: 'block', width: 324, height: 70 }} width={324} className="chartjs-render-monitor" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*/.col*/}
                    <div className="col-sm-6 col-lg-3">
                        <div className="card text-white bg-flat-color-3">
                            <div className="card-body pb-0">
                                <div className="dropdown float-right">
                                    <button className="btn bg-transparent dropdown-toggle theme-toggle text-light" type="button" id="dropdownMenuButton3" data-toggle="dropdown">
                                        <i className="fa fa-cog" />
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton3">
                                        <div className="dropdown-menu-content">
                                            <a className="dropdown-item" href="#">Action</a>
                                            <a className="dropdown-item" href="#">Another action</a>
                                            <a className="dropdown-item" href="#">Something else here</a>
                                        </div>
                                    </div>
                                </div>
                                <h4 className="mb-0">
                                    <span className="count">10468</span>
                                </h4>
                                <p className="text-light">Members online</p>
                            </div>
                            <div className="chart-wrapper px-0" style={{ height: 70 }} height={70}><div className="chartjs-size-monitor" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', visibility: 'hidden', zIndex: -1 }}><div className="chartjs-size-monitor-expand" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', visibility: 'hidden', zIndex: -1 }}><div style={{ position: 'absolute', width: 1000000, height: 1000000, left: 0, top: 0 }} /></div><div className="chartjs-size-monitor-shrink" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', visibility: 'hidden', zIndex: -1 }}><div style={{ position: 'absolute', width: '200%', height: '200%', left: 0, top: 0 }} /></div></div>
                                <canvas id="widgetChart3" height={84} style={{ display: 'block', width: 364, height: 84 }} width={364} className="chartjs-render-monitor" />
                            </div>
                        </div>
                    </div>
                    {/*/.col*/}
                    <div className="col-sm-6 col-lg-3">
                        <div className="card text-white bg-flat-color-4">
                            <div className="card-body pb-0">
                                <div className="dropdown float-right">
                                    <button className="btn bg-transparent dropdown-toggle theme-toggle text-light" type="button" id="dropdownMenuButton4" data-toggle="dropdown">
                                        <i className="fa fa-cog" />
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton4">
                                        <div className="dropdown-menu-content">
                                            <a className="dropdown-item" href="#">Action</a>
                                            <a className="dropdown-item" href="#">Another action</a>
                                            <a className="dropdown-item" href="#">Something else here</a>
                                        </div>
                                    </div>
                                </div>
                                <h4 className="mb-0">
                                    <span className="count">10468</span>
                                </h4>
                                <p className="text-light">Members online</p>
                                <div className="chart-wrapper px-3" style={{ height: 70 }} height={70}><div className="chartjs-size-monitor" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', visibility: 'hidden', zIndex: -1 }}><div className="chartjs-size-monitor-expand" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', visibility: 'hidden', zIndex: -1 }}><div style={{ position: 'absolute', width: 1000000, height: 1000000, left: 0, top: 0 }} /></div><div className="chartjs-size-monitor-shrink" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', visibility: 'hidden', zIndex: -1 }}><div style={{ position: 'absolute', width: '200%', height: '200%', left: 0, top: 0 }} /></div></div>
                                    <canvas id="widgetChart4" height={68} style={{ display: 'block', width: 292, height: 68 }} width={292} className="chartjs-render-monitor" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*/.col*/}
                    <div className="col-lg-3 col-md-6">
                        <div className="social-box facebook">
                            <i className="fa fa-facebook" />
                            <ul>
                                <li>
                                    <span className="count">40</span> k
                                    <span>friends</span>
                                </li>
                                <li>
                                    <span className="count">450</span>
                                    <span>feeds</span>
                                </li>
                            </ul>
                        </div>
                        {/*/social-box*/}
                    </div>
                    {/*/.col*/}
                    <div className="col-lg-3 col-md-6">
                        <div className="social-box twitter">
                            <i className="fa fa-twitter" />
                            <ul>
                                <li>
                                    <span className="count">30</span> k
                                    <span>friends</span>
                                </li>
                                <li>
                                    <span className="count">450</span>
                                    <span>tweets</span>
                                </li>
                            </ul>
                        </div>
                        {/*/social-box*/}
                    </div>
                    {/*/.col*/}
                    <div className="col-lg-3 col-md-6">
                        <div className="social-box twitter">
                            <i className="fa fa-twitter" />
                            <ul>
                                <li>
                                    <span className="count">30</span> k
                                    <span>friends</span>
                                </li>
                                <li>
                                    <span className="count">450</span>
                                    <span>tweets</span>
                                </li>
                            </ul>
                        </div>
                        {/*/social-box*/}
                    </div>
                    {/*/.col*/}
                    <div className="col-lg-3 col-md-6">
                        <div className="social-box twitter">
                            <i className="fa fa-twitter" />
                            <ul>
                                <li>
                                    <span className="count">30</span> k
                                    <span>friends</span>
                                </li>
                                <li>
                                    <span className="count">450</span>
                                    <span>tweets</span>
                                </li>
                            </ul>
                        </div>
                        {/*/social-box*/}
                    </div>
                    {/*/.col*/}
                    <div className="col-lg-3 col-md-6">
                        <div className="social-box twitter">
                            <i className="fa fa-twitter" />
                            <ul>
                                <li>
                                    <span className="count">30</span> k
                                    <span>friends</span>
                                </li>
                                <li>
                                    <span className="count">450</span>
                                    <span>tweets</span>
                                </li>
                            </ul>
                        </div>
                        {/*/social-box*/}
                    </div>
                    {/*/.col*/}
                    <div className="col-lg-3 col-md-6">
                        <div className="social-box twitter">
                            <i className="fa fa-twitter" />
                            <ul>
                                <li>
                                    <span className="count">30</span> k
                                    <span>friends</span>
                                </li>
                                <li>
                                    <span className="count">450</span>
                                    <span>tweets</span>
                                </li>
                            </ul>
                        </div>
                        {/*/social-box*/}
                    </div>
                    {/*/.col*/}

                    <div className="col-lg-3 col-md-6">
                        <div className="social-box twitter">
                            <i className="fa fa-twitter" />
                            <ul>
                                <li>
                                    <span className="count">30</span> k
                                    <span>friends</span>
                                </li>
                                <li>
                                    <span className="count">450</span>
                                    <span>tweets</span>
                                </li>
                            </ul>
                        </div>
                        {/*/social-box*/}
                    </div>
                    {/*/.col*/}
                    <div className="col-lg-3 col-md-6">
                        <div className="social-box twitter">
                            <i className="fa fa-twitter" />
                            <ul>
                                <li>
                                    <span className="count">30</span> k
                                    <span>friends</span>
                                </li>
                                <li>
                                    <span className="count">450</span>
                                    <span>tweets</span>
                                </li>
                            </ul>
                        </div>
                        {/*/social-box*/}
                    </div>
                    {/*/.col*/}
                    <div className="col-lg-3 col-md-6">
                        <div className="social-box twitter">
                            <i className="fa fa-twitter" />
                            <ul>
                                <li>
                                    <span className="count">30</span> k
                                    <span>friends</span>
                                </li>
                                <li>
                                    <span className="count">450</span>
                                    <span>tweets</span>
                                </li>
                            </ul>
                        </div>
                        {/*/social-box*/}
                    </div>
                    {/*/.col*/}
                    <div className="col-lg-3 col-md-6">
                        <div className="social-box twitter">
                            <i className="fa fa-twitter" />
                            <ul>
                                <li>
                                    <span className="count">30</span> k
                                    <span>friends</span>
                                </li>
                                <li>
                                    <span className="count">450</span>
                                    <span>tweets</span>
                                </li>
                            </ul>
                        </div>
                        {/*/social-box*/}
                    </div>
                    {/*/.col*/}
                    <div className="col-lg-3 col-md-6">
                        <div className="social-box twitter">
                            <i className="fa fa-twitter" />
                            <ul>
                                <li>
                                    <span className="count">30</span> k
                                    <span>friends</span>
                                </li>
                                <li>
                                    <span className="count">450</span>
                                    <span>tweets</span>
                                </li>
                            </ul>
                        </div>
                        {/*/social-box*/}
                    </div>
                    {/*/.col*/}
                    <div className="col-lg-3 col-md-6">
                        <div className="social-box twitter">
                            <i className="fa fa-twitter" />
                            <ul>
                                <li>
                                    <span className="count">30</span> k
                                    <span>friends</span>
                                </li>
                                <li>
                                    <span className="count">450</span>
                                    <span>tweets</span>
                                </li>
                            </ul>
                        </div>
                        {/*/social-box*/}
                    </div>
                    {/*/.col*/}
                    <div className="col-lg-3 col-md-6">
                        <div className="social-box twitter">
                            <i className="fa fa-twitter" />
                            <ul>
                                <li>
                                    <span className="count">30</span> k
                                    <span>friends</span>
                                </li>
                                <li>
                                    <span className="count">450</span>
                                    <span>tweets</span>
                                </li>
                            </ul>
                        </div>
                        {/*/social-box*/}
                    </div>
                    {/*/.col*/}
                    <Outlet />
                </div> {/* .content */}
            </div>
        </>
    );
}

export default LayoutAdmin;
