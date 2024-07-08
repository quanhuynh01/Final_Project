import React, { useState, useEffect } from "react";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Modal, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [lsReview, setlsReview] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        setShow(true);
        axios.get(`https://localhost:7201/api/Reviews/viewReviewFromProduct/${id}`).then(res => {
            setlsReview(res.data);
        }
        )
    }

    const [filters, setFilters] = useState({
        productName: { value: null, matchMode: 'contains' },
        brand: { value: null, matchMode: 'contains' },
        price: { value: null, matchMode: 'equals' },
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        axios.get('https://localhost:7201/api/Products')
            .then(res => setProducts(res.data))
            .catch(error => console.error('Error fetching products:', error));
    };

    const HandleDelete = (id) => {
        Swal.fire({
            title: "Bạn có muốn xóa",
            text: "Dữ liệu liên quan đến sản phẩm này sẽ bị mất",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`https://localhost:7201/api/Products/${id}`)
                    .then(res => {
                        if (res.status === 200) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your file has been deleted.",
                                icon: "success"
                            });
                            setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
                        } else {
                            Swal.fire({
                                title: "Error!",
                                text: "Failed to delete product.",
                                icon: "error"
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error deleting product:', error);
                        Swal.fire({
                            title: "Error!",
                            text: "Failed to delete product.",
                            icon: "error"
                        });
                    });
            }
        });
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={`https://localhost:7201${rowData.avatar}`} alt={rowData.productName} style={{ width: "100px", height: "100px" }} />;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div>
                <Link to={`./edit/${rowData.id}`} className="btn btn-outline-warning btn-delete mr-2">
                    <i className="fa fa-edit"></i> Chỉnh sửa
                </Link>
                <Button onClick={() => HandleDelete(rowData.id)} className="btn btn-danger mr-2">
                    <i className="fa fa-trash text-white"></i>
                </Button>
                <Button onClick={() => handleShow(rowData.id)}> <i className="fa fa-comment text-white"></i></Button>
            </div>
        );
    };

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const renderHeader = () => {
        return (
            <div className="table-header">
                <div className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Global Search" />
                </div>
            </div>
        );
    };

    const renderInputFilter = (field, header) => {
        return (
            <InputText
                value={filters[field]?.value || ''}
                onChange={(e) => onInputChange(e, field)}
                placeholder={`Search ${header}`}
            />
        );
    };

    const onInputChange = (e, field) => {
        const value = e.target.value.trim();
        let _filters = { ...filters };
        if (value) {
            _filters[field] = { value: value, matchMode: 'contains' };
        } else {
            delete _filters[field];
        }
        setFilters(_filters);
    };

    const handleSeen = (id) => {
        axios.put(`https://localhost:7201/api/Reviews/changeSeen/${id}`).then(res => {
            const updatedReview = res.data; 
            console.log(updatedReview);
            // Cập nhật trạng thái seen trong lsReview
            setlsReview(prevReviews =>
                prevReviews.map(review =>
                    review.id === updatedReview.id ? { ...review, seen: updatedReview.seen } : review
                )
            );
        }).catch(error => {
            console.error("Failed to update review status", error);
        });
    };
   
    return (
        <>
            <SidebarAdmin />
            <div id="right-panel" className="right-panel" style={{ width: "86%" }}>
                <HeaderAdmin />
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
                <div className="content mt-3">
                    <Link to={"create"} className="btn btn-outline-success">Thêm sản phẩm</Link>
                </div>
                <div className="content mt-3">
                    <DataTable value={products.filter(p => !p.softDelete)} paginator rows={10} className="datatable-responsive"
                        globalFilter={globalFilterValue} header={renderHeader()}>
                        <Column field="id" header="STT" body={(rowData, options) => options.rowIndex + 1} />
                        <Column field="productName" header="Tên sản phẩm" filter filterElement={() => renderInputFilter('productName', 'Product Name')} />
                        <Column header="Ảnh sản phẩm" body={imageBodyTemplate} />
                        <Column field="brand.brandName" header="Hãng" filter filterElement={() => renderInputFilter('brand', 'Brand')} />
                        <Column field="price" header="Giá" filter filterElement={() => renderInputFilter('price', 'Price')} />
                        <Column header="Chức năng" body={actionBodyTemplate} />
                    </DataTable>
                </div>
            </div>

            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header>
                    <Modal.Title>Danh sách bình luận của sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        lsReview.length > 0 ? (
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Tên người bình luận</th>
                                        <th>Nội dung</th>
                                        <th>Số sao</th>
                                        <th>Trạng thái</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        lsReview.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td>{item.content}</td>
                                                <td>{item.rating}</td>
                                                <td>{item.seen ? <p className="text-success">Đã xem</p> : <p className="text-danger">Chưa xem</p>}</td>
                                                <td><Button onClick={() => handleSeen(item.id)}> <i className="fa fa-edit"></i> Xem</Button></td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        ) : (
                            <h6>Sản phẩm chưa có bình luận</h6>
                        )
                    }
        </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Products;
