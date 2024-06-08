import { useParams } from "react-router";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";

const AttributeEdit = () => {
    const {id}= useParams();
    console.log(id);
    return ( <>
         <SidebarAdmin />
            <div id="right-panel" className="right-panel" style={{ width: '86%' }}>
                <HeaderAdmin />
                <div className="breadcrumbs">
                    <div className="col-sm-4">
                        <div className="page-header float-left">
                            <div className="page-title">
                                <h1>Chỉnh sửa thuộc tính <b className="text-primary"> </b></h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className="page-header float-right">
                            <div className="page-title">
                                <ol className="breadcrumb text-right">
                                    <li className="breadcrumb-item active">Chỉnh sửa thuộc tính</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content mt-3  ">
                    <div className="animated fadeIn">
                        {/* <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Tên thương hiệu</Form.Label>
                            <Form.Control
                                name="nameCategory"
                                value={Categories.nameCategory || ""}
                                onChange={handleChange}
                                type="text"
                                placeholder="Nhập tên thương hiệu"
                            />
                            </Form.Group>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Ảnh thương hiệu</Form.Label>
                                <Form.Control name="imageCateFile" onChange={handleImageChange} type="file" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Mô tả</Form.Label>
                                <Form.Control name="description" value={Categories.description ==null ? " ":Categories.description} onChange={handleChange} as="textarea" rows={3} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Check // prettier-ignore
                                    type="switch"
                                    id="custom-switch"
                                    label="Trạng thái"
                                    name="show"
                                    checked={Categories.show}
                                    onChange={handleCheck}
                                />
                            </Form.Group>
                            <Button type="button" className="btn btn-outline-primary"><i className="fa fa-save"></i> Lưu thay đổi</Button>
                            <Button type="button" className="btn btn-outline-success ml-2   "><i className="fa fa-addAttribute"></i> Thêm thuộc tính</Button>
                        </Form>   */}
                    </div>
 
                </div> 
            </div>
    
    </> );
}
 
export default AttributeEdit;