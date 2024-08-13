import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeaderAdmin from '../HeaderAdmin/HeaderAdmin';
import SidebarAdmin from '../SidebarAdmin/SidebarAdmin';
import { Button, Form, Modal } from 'react-bootstrap';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterService } from 'primereact/api';

// Đăng ký filter tùy chỉnh cho activity
FilterService.register('custom_activity', (value, filters) => {
    const [from, to] = filters ?? [null, null];
    if (from === null && to === null) return true;
    if (from !== null && to === null) return from <= value;
    if (from === null && to !== null) return value <= to;
    return from <= value && value <= to;
});

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [CateCreate, setCateCreate] = useState({ Show: false });
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nameCategory: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        description: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        show: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    useEffect(() => {
        axios.get('https://localhost:7201/api/Categories')
            .then(res => setCategories(res.data));
    }, []);

    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setCateCreate(prev => ({ ...prev, [name]: value }));
    }

    const handleCheck = (e) => {
        let name = e.target.name;
        let value = e.target.checked;
        setCateCreate(prev => ({ ...prev, [name]: value }));
    }

    const handleImageChange = (e) => {
        setCateCreate(prev => ({ ...prev, ImageCateFile: e.target.files[0] }));
    }

    const handleSubmit = (e) => {
        if (CateCreate.NameCategory == null) {
            alert('Bạn chưa nhập đủ thông tin');
            return;
        } else {
            e.preventDefault();
            const formData = new FormData();
            Object.entries(CateCreate).forEach(([key, value]) => {
                formData.append(key, value);
            });
            axios.post(`https://localhost:7201/api/Categories`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((res) => {
                    if (res.status === 201) {
                        alert(`Thêm danh mục ${res.data.nameCategory} thành công`);
                        window.location.reload();
                    }
                })
                .catch(() => {
                    alert("Thêm thất bại!!!");
                });
        }
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Tìm kiếm" />
                </span>
            </div>
        );
    };

    const imageBodyTemplate = (rowData) => {
        const imageUrl = `https://localhost:7201${rowData.iconCate}`;
        return <img src={imageUrl} alt={rowData.nameCategory} className="w-25 h-25" />;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <a type="button" className="btn btn-outline-warning" href={`/admin/categories/chinh-sua-danh-muc/${rowData.id}`}>
                <i className="fa fa-edit"></i> Chỉnh sửa
            </a>
        );
    };

    const statusBodyTemplate = (rowData) => {
        const row = rowData.show ? <p className='text-success'>Hiển thị</p> : <p className='text-danger'>Ẩn</p>
        return row;
    };

    const header = renderHeader();

    return (
        <>
            <SidebarAdmin />
            <div id="right-panel" className="right-panel" style={{ width: '86%' }}>
                <HeaderAdmin />
                <div className="breadcrumbs">
                    <div className="col-sm-4">
                        <div className="page-header float-left">
                            <div className="page-title">
                                <h1>Danh mục sản phẩm</h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className="page-header float-right">
                            <div className="page-title">
                                <ol className="breadcrumb text-right">
                                    <li className="breadcrumb-item active">Danh mục sản phẩm</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <button onClick={() => setCateCreate({ Show: true })} className="btn btn-outline-success" type="button">
                        <i className="fa fa-plus"></i> Tạo mới danh mục
                    </button>
                </div>
                <div className="content mt-3">
                    <div className="animated fadeIn">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-header">
                                        <strong className="card-title">Danh sách danh mục sản phẩm</strong>
                                    </div>
                                    <div className="card-body">
                                        <DataTable value={categories} paginator rows={5} dataKey="id" filters={filters} filterDisplay="row" loading={false}
                                            globalFilterFields={['nameCategory', 'description']} header={header} emptyMessage="Không tìm thấy danh mục.">
                                            <Column field="nameCategory" header="Tên danh mục" filter filterPlaceholder="Tìm theo tên" style={{ minWidth: '12rem' }} /> 
                                            <Column field="show" header="Trạng thái" body={statusBodyTemplate} filter filterPlaceholder="Tìm theo trạng thái" style={{ minWidth: '12rem' }} />
                                            <Column header="Ảnh" body={imageBodyTemplate} style={{ minWidth: '12rem' }} />
                                            <Column header="Chức năng" body={actionBodyTemplate} style={{ minWidth: '12rem' }} />
                                        </DataTable>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={CateCreate.Show} onHide={() => setCateCreate({ Show: false })}>
                <Modal.Header>
                    <Modal.Title>Tạo mới danh mục sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Tên danh mục</Form.Label>
                            <Form.Control name="NameCategory" onChange={(e) => handleChange(e)} type="text" placeholder="Nhập tên danh mục" />
                        </Form.Group>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Ảnh hiển thị danh mục</Form.Label>
                            <Form.Control name="ImageCateFile" onChange={handleImageChange} type="file" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control name="Description" onChange={(e) => handleChange(e)} as="textarea" rows={3} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Check
                                type="switch"
                                id="custom-switch"
                                label="Hiển thị"
                                name="Show"
                                onChange={(e) => handleCheck(e)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setCateCreate({ Show: false })}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Thêm mới
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Categories;
