
import { Link } from "react-router-dom";

const SidebarAdmin = () => {
    const currentPath = window.location.pathname;
    const adminPath = currentPath.startsWith('/admin') ? '/admin' : '';
 
    return (
        <aside id="left-panel" className="left-panel">
            <nav className="navbar navbar-expand-sm navbar-default">
                <div className="navbar-header">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-menu" aria-controls="main-menu" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fa fa-bars" />
                    </button>
                    <a className="navbar-brand" href="/admin"><h4>DQ STORE</h4></a>
                    <a className="navbar-brand hidden" href="./"><img src="../images/logo2.png" alt="Logo" /></a>
                </div>
                <div id="main-menu" className="main-menu collapse navbar-collapse">
                    <ul className="nav navbar-nav">
                        <li className="active">
                            <a href="/admin"> <i className="menu-icon fa fa-dashboard" />Dashboard </a>
                        </li>
                        <h3 className="menu-title">Hàng hóa</h3>{/* /.menu-title */}
                        <li className="menu-item-has-children dropdown">
                            <a className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i className="menu-icon fa fa-laptop" />Sản phẩm</a>
                            <ul className="sub-menu children dropdown-menu">
                                <li><i className="fa fa-bars" /><Link to={`${adminPath}/products`}>Danh sách sản phẩm</Link></li>
                                <li><i className="fa fa-id-badge" /><Link to={`${adminPath}/attributes`}>Thuộc tính sản phẩm</Link></li>
                                <li><i className="fa fa-bars" /><a href="ui-tabs.html">Danh mục sản phẩm</a></li>
                                <li><i className="fa fa-share-square-o" /><Link to={`${adminPath}/categories`}>Danh mục sản phẩm</Link></li>
                                <li><i className="fa fa-indent" /><Link to={`${adminPath}/brand`}>Thương hiệu</Link></li>
                            </ul>
                        </li>
                        <li className="menu-item-has-children dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i className="menu-icon fa fa-table" />Đơn hàng</a>
                            <ul className="sub-menu children dropdown-menu">
                                <li><i className="fa fa-table" /><a href="tables-basic.html">Danh sách đơn hàng</a></li>
                            </ul>
                        </li>
                        <li className="menu-item-has-children dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i className="menu-icon fa fa-th" />Dối tác</a>
                            <ul className="sub-menu children dropdown-menu">
                                <li><i className="menu-icon fa fa-th" /><a href="forms-basic.html">Khách hàng</a></li>
                                <li><i className="menu-icon fa fa-th" /><Link to={`${adminPath}/customer-supplier`}>Nhà cung cấp</Link></li> 
                            </ul>
                        </li>
                        <h3 className="menu-title">Icons</h3>{/* /.menu-title */}
                        <li className="menu-item-has-children dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i className="menu-icon fa fa-tasks" />Icons</a>
                            <ul className="sub-menu children dropdown-menu">
                                <li><i className="menu-icon fa fa-fort-awesome" /><a href="font-fontawesome.html">Font Awesome</a></li>
                                <li><i className="menu-icon ti-themify-logo" /><a href="font-themify.html">Themefy Icons</a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="widgets.html"> <i className="menu-icon ti-email" />Widgets </a>
                        </li>
                        <li className="menu-item-has-children dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i className="menu-icon fa fa-bar-chart" />Charts</a>
                            <ul className="sub-menu children dropdown-menu">
                                <li><i className="menu-icon fa fa-line-chart" /><a href="charts-chartjs.html">Chart JS</a></li>
                                <li><i className="menu-icon fa fa-area-chart" /><a href="charts-flot.html">Flot Chart</a></li>
                                <li><i className="menu-icon fa fa-pie-chart" /><a href="charts-peity.html">Peity Chart</a></li>
                            </ul>
                        </li>
                        <li className="menu-item-has-children dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i className="menu-icon fa fa-area-chart" />Maps</a>
                            <ul className="sub-menu children dropdown-menu">
                                <li><i className="menu-icon fa fa-map-o" /><a href="maps-gmap.html">Google Maps</a></li>
                                <li><i className="menu-icon fa fa-street-view" /><a href="maps-vector.html">Vector Maps</a></li>
                            </ul>
                        </li>
                        <h3 className="menu-title">Extras</h3>{/* /.menu-title */}
                        <li className="menu-item-has-children dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i className="menu-icon fa fa-glass" />Pages</a>
                            <ul className="sub-menu children dropdown-menu">
                                <li><i className="menu-icon fa fa-sign-in" /><a href="page-login.html">Login</a></li>
                                <li><i className="menu-icon fa fa-sign-in" /><a href="page-register.html">Register</a></li>
                                <li><i className="menu-icon fa fa-paper-plane" /><a href="pages-forget.html">Forget Pass</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>{/* /.navbar-collapse */}
            </nav>
        </aside>
    );
}

export default SidebarAdmin;
