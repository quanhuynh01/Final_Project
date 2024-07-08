import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import SidebarAdmin from '../SidebarAdmin/SidebarAdmin';
import HeaderAdmin from '../HeaderAdmin/HeaderAdmin';
import { Modal, Table } from 'react-bootstrap';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false); 
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [lsOrderDetail, setlsOrderDetail] = useState([]);
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('https://localhost:7201/api/Orders');
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleAccept = async (id) => {
        try {
            const response = await axios.get(`https://localhost:7201/accept/${id}`);
            if (response.status === 200) {
                alert('Đã xác nhận đơn hàng');
                fetchOrders(); // Reload orders after successful action
            }
        } catch (error) {
            console.error('Error accepting order:', error);
        }
    };

    const handleDeliver = async (id) => {
        try {
            const response = await axios.get(`https://localhost:7201/deliver/${id}`);
            if (response.status === 200) {
                alert('Đơn hàng bắt đầu vận chuyển');
                fetchOrders(); // Reload orders after successful action
            }
        } catch (error) {
            console.error('Error delivering order:', error);
        }
    };

    const handleAcceptDeliver = async (id) => {
        try {
            const response = await axios.get(`https://localhost:7201/AcceptDeliver/${id}`);
            if (response.status === 200) {
                alert('Đơn hàng được giao thành công');
                fetchOrders(); // Reload orders after successful action
            }
        } catch (error) {
            console.error('Error accepting delivery:', error);
        }
    };

    const getStatusClass = (id) => {
        switch (id) {
            case 1:
                return 'text-dark';
            case 2:
                return 'text-warning';
            case 3:
                return 'text-info';
            case 7:
                return 'text-danger';
            case 8:
                return 'text-success';
            default:
                return '';
        }
    };

    const statusBodyTemplate = (rowData) => {
        return <span className={getStatusClass(rowData.deliveryStatus.id)}>{rowData.deliveryStatus.status}</span>;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div>
                {rowData.deliveryStatusId === 1 && (
                    <Button onClick={() => handleAccept(rowData.id)} className="btn btn-info" label="Xác nhận đơn" />
                )}
                {rowData.deliveryStatusId === 2 && (
                    <Button onClick={() => handleDeliver(rowData.id)} className="btn btn-warning"  label="Vận chuyển" />
                )}
                {rowData.deliveryStatusId === 3 && (
                    <Button onClick={() => handleAcceptDeliver(rowData.id)}  className="btn btn-success" label="Xác nhận giao hàng" />
                )}
            </div>
        );
    };


    const deltail = (rowData)=>{
        return (
            <div>
                  <Button onClick={() => handleDetail(rowData.id)} className="btn btn-info" >Xem chi tiết </Button>
            </div>
        );
    }

    const handleDetail=(id)=>{
        
         axios.get(`https://localhost:7201/getOrderDetailByOrderId/${id}`).then(res=>{
            if(res.status ===200)
            {
                console.log(res.data);
                setShow(true);
                setlsOrderDetail(res.data);
            }
         });
    }
    return (<>

        <SidebarAdmin />
        <div id="right-panel" className="right-panel" style={{ width: '86%' }}>
                <HeaderAdmin/>
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
                <div className="content mt-3">
                    <div className="animated fadeIn">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-header">
                                        <strong className="card-title">Danh sách danh mục sản phẩm</strong>
                                    </div>
                                    <div className="card-body">
                                    <DataTable value={orders} loading={loading} paginator rows={10} rowsPerPageOptions={[10, 25, 50]} className="p-datatable-customers">
                                        <Column field="dateShip" header="Ngày tạo" sortable />
                                        <Column field="user.fullName" header="Tên khách hàng" sortable />
                                        <Column field="deliveryStatus" header="Trạng thái" body={statusBodyTemplate} sortable />
                                        <Column header="Chức năng" body={actionBodyTemplate} />
                                        <Column header="Xem chi tiết" body={deltail} />
                                    </DataTable>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
      
        </div>
        <Modal show={show} onHide={handleClose} size='lg'>
        <Modal.Header>
          <Modal.Title>Danh sách sản phẩm theo đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
              <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Sản phẩm</th>
                        <th>Ảnh</th>
                        <th>Số lượng</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        lsOrderDetail.map((item ,index)=>{
                            return(
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{item.product.productName}</td> 
                                <td><img className='w-25' src={`https://localhost:7201${item.product.avatar}`}alt=''/> </td>
                                <td>{item.amount}</td>
                            </tr>)
                        })
                    }
                </tbody>
              </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button className='btn btn-primary' onClick={handleClose}>
            Close
          </Button> 
        </Modal.Footer>
      </Modal>
        </>
    );
};

export default Order;
