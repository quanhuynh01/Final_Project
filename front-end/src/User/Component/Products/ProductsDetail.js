import { useParams } from "react-router";
import Header from "../Header/Header";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useEffect, useState } from "react";
import axios from "axios";
import './ProductsDetail.css'
import { Button, Tab, Tabs } from "react-bootstrap";
const ProductsDetail = () => {
    const { id } = useParams();
    const [productDetail, setproductDetail] = useState({ brand: { brandName: "" } });
    const [Image, setImage] = useState([]);
    const [currentImage, setCurrentImage] = useState(`https://localhost:7201${productDetail.avatar}`);
    useEffect(() => {
        axios.get(`https://localhost:7201/api/Products/${id}`).then(res => {
            setproductDetail(res.data);
            setCurrentImage(res.data.avatar);
        })
        axios.get(`https://localhost:7201/api/ProductThumbs/hinhsp/${id}`).then(res => setImage(res.data));
    }, []);
    console.log(productDetail);
    //xử lý click active hình ảnh
    const handleImageClick = (imageUrl) => {
        // console.log(imageUrl.image);
        setCurrentImage(imageUrl.image);
    };

    function convertToVND(price) {
        // Giả sử đơn giá hiện tại là USD, và tỷ giá chuyển đổi là 23,000 VND cho 1 USD
        const exchangeRate = 23000;
        const priceInVND = price * exchangeRate;
        return priceInVND.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    return (<>
        <Header />
        <div className="">
            <Breadcrumb className="">
                <Breadcrumb.Item className="ml-5" href="/">Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item active>Chi tiết sản phẩm</Breadcrumb.Item>
            </Breadcrumb>
        </div>
        <section className="detail container" >
            <div className="row">
                <div className="col-6 image-section" >
                    <div className="big-image-holder col-12 " id="js-big-img" style={{ height: "370px" }}>

                        <img src={`https://localhost:7201${currentImage}`} alt={`https://localhost:7201${currentImage}`} />

                    </div>
                    <div className="image-thumbnail-holder row pt-2">
                        {Image.map((image, index) => (
                            <div className="thumbnail col-3" key={index} onClick={() => handleImageClick(image)} >
                                <img src={`https://localhost:7201${image.image}`} alt={`Thumbnail ${index}`} className="img-thumbnail" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-6">
                    <h3>{productDetail.productName}</h3>
                    <div className="row ">
                        <p className="col-4">Mã sản phẩm: {productDetail.sku}</p>
                        <p className="col-4">Hãng sản xuất:  {productDetail.brand.brandName}</p>
                    </div>
                    <div className="p-price pt-4 ">
                        <h5 className="text-primary p-2">
                            <b>Giá:</b> <del className="text-secondary">{convertToVND(productDetail.price)}</del>
                        </h5>
                        <h4 className="text-primary p-2">
                            <b>Giá khuyến mãi:</b> <b className="text-danger">{convertToVND(productDetail.salePrice)}</b>
                        </h4>
                    </div>
                    <div className="p-3">
                        <h4>Chính sách giao hàng</h4>
                        <p className="pt-2"><i className="fa fa-gift text-danger"></i> Giao hàng tận nơi</p>
                        <p  ><i className="fa fa-gift text-danger"></i> Giao hàng tận nơi</p>
                        <p  ><i className="fa fa-gift text-danger"></i> Giao hàng tận nơi</p>
                        <p  ><i className="fa fa-gift text-danger"></i> Giao hàng tận nơi</p>
                        <p ><i className="fa fa-gift text-danger"></i> Giao hàng tận nơi</p>
                    </div>
                    <Button className="mr-5 btn btn-danger">Mua ngay</Button>
                    <Button className="btn btn-outline-danger"> <i className="fa fa-shopping-cart"></i> Thêm vào giỏ</Button>
                </div>
            </div>
            <Tabs
                defaultActiveKey="home"
                id="fill-tab-example"
                className="mb-3 d-flex justify-content-center"
                fill
            >
                <Tab eventKey="home" title="Mô tả sản phẩm">
                    <div className="pd-desc-group js-static-container" id="pd-decs">
                        <h2 align="center" style={{ lineHeight: '1.2', fontSize: '2rem', color: 'rgb(51, 51, 51)', fontFamily: 'Roboto, sans-serif' }}><span style={{ color: 'rgb(51, 102, 255)' }}><span style={{ fontWeight: 'bolder' }}><span style={{ fontFamily: 'arial, helvetica, sans-serif', fontSize: '24pt' }}>Laptop ASUS ROG Flow X16 GV601VV NL016W</span></span></span></h2><p style={{ marginBottom: '1rem', color: 'rgb(51, 51, 51)', fontFamily: 'Roboto, sans-serif', textAlign: 'justify' }}><span style={{ fontWeight: 'bolder' }}><span style={{ fontSize: '14pt', color: 'rgb(204, 153, 255)' }}><em>Một chiếc laptop sở hữu cấu hình khủng, hiệu năng cao với bản lề đa dụng 360° là những gì khi nhắc tới chiếc laptop ASUS ROG Flow X16 GV601VV NL016W</em></span></span></p><h3 style={{ lineHeight: '1.2', fontSize: '1.75rem', color: 'rgb(51, 51, 51)', fontFamily: 'Roboto, sans-serif', textAlign: 'justify' }}><span style={{ fontSize: '14pt' }}>Hiệu năng ấn tượng</span></h3><p style={{ marginBottom: '1rem', color: 'rgb(51, 51, 51)', fontFamily: 'Roboto, sans-serif', textAlign: 'justify' }}><span style={{ fontSize: '14pt' }}>Đây là một trong những mẫu laptop - máy tính xách tay chơi game cao cấp nhất của ASUS khi sử dụng cấu hình mới nhất từ Intel Gen 13 và card đồ họa cực kì mạnh mẽ. Sở hữu một trong những cấu hình cao nhất hiện nay với chip Intel Core i9 13900H gen 13 cùng card đồ họa RTX 4060 Series 4000 cho hiệu năng cực kì mạnh mẽ. Máy hoàn toàn đáp ứng mọi nhu cầu sử dụng phức tạp và xử lý mượt mà các ứng dụng đồ họa chuyên nghiệp và các tựa game online nặng…</span></p><h3 style={{ lineHeight: '1.2', fontSize: '1.75rem', color: 'rgb(51, 51, 51)', fontFamily: 'Roboto, sans-serif', textAlign: 'justify' }}><span style={{ fontSize: '14pt' }}>Thiết kế ấn tượng, linh hoạt</span></h3><p style={{ marginBottom: '1rem', color: 'rgb(51, 51, 51)', fontFamily: 'Roboto, sans-serif', textAlign: 'justify' }}><span style={{ fontSize: '14pt' }}>Nhanh - mượt mà - linh hoạt là những từ mô tả laptop gaming 16 inch đầu tiên của ROG sở hữu thiết kế xoay gập linh hoạt nhờ bản lề 360°. Nâng tầm phong cách với phiên bản Supernova cùng logo kim loại màu tím lấp lánh. Các đường vân được thiết kế dọc khung máy cho kết cấu vững chắc và cảm giác cầm nắm chắc chắn. Thiết kế gọn nhẹ giúp máy có thể dễ dàng đặt trong trong túi xách và có thêm không gian cho các trang bị gaming yêu thích của bạn.</span></p><p style={{ marginBottom: '1rem', color: 'rgb(51, 51, 51)', fontFamily: 'Roboto, sans-serif' }}><span style={{ fontSize: '14pt' }}><img src="https://anphat.com.vn/media/lib/20-04-2023/asusrogflowx16gv601vvnl016w1.jpeg" alt width={800} style={{ maxWidth: '100%', height: 'auto', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} /></span></p><h3 style={{ lineHeight: '1.2', fontSize: '1.75rem', color: 'rgb(51, 51, 51)', fontFamily: 'Roboto, sans-serif', textAlign: 'justify' }}><span style={{ fontSize: '14pt' }}>Trải nghiệm màn hình siêu sắc nét</span></h3><p style={{ marginBottom: '1rem', color: 'rgb(51, 51, 51)', fontFamily: 'Roboto, sans-serif', textAlign: 'justify' }}><span style={{ fontSize: '14pt' }}>ASUS ROG Flow X16 đi kèm với màn hình ROG Nebula HDR, độ phân giải 2K (QHD - 2560x1600) dưới tấm nền Mini LED cùng tần số quét 240Hz và thời gian phản hồi 3ms giúp mang lại khả năng tái tạo hình ảnh chân thật, sống động và tuyệt vời. Độ phủ màu cao lên 100% DCI-P3 cùng chuẩn màu PANTONE mang tới trải nghiệm màu sắc đầy đủ và chân thật nhất, đáp ứng hoàn hảo nhu cầu tận dụng hiệu năng khủng của X16 để sử dụng làm việc đồ hoạ, chỉnh sửa hình ảnh hay video. Công nghệ Dolby Vision® cho hình ảnh hiển thị đẹp mắt và chi tiết hơn, giúp cải thiện HDR ở video 4K, điều chỉnh động để mọi hình ảnh hiển thị rực rỡ, sáng và sống động hơn.</span></p><h3 style={{ lineHeight: '1.2', fontSize: '1.75rem', color: 'rgb(51, 51, 51)', fontFamily: 'Roboto, sans-serif' }}><span style={{ fontSize: '14pt' }}><img src="https://anphat.com.vn/media/product/44769_asus_rog_flow_x16_gv601vv_nl016w__7_.jpg" alt width={800} height={800} style={{ maxWidth: '100%', height: 'auto', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />Tản nhiệt hiệu quả</span></h3><p style={{ marginBottom: '1rem', color: 'rgb(51, 51, 51)', fontFamily: 'Roboto, sans-serif', textAlign: 'justify' }}><span style={{ fontSize: '14pt' }}>Hệ thống tản nhiệt&nbsp;<span style={{ fontWeight: 'bolder' }}>ASUS ROG Flow X1</span>6 với buồng hơi cao cấp giữ cho đồ họa của ROG XG Mobile luôn hoạt động mạnh mẽ. Thiết kế tùy chỉnh của chúng tôi tăng 54% diện tích tiếp xúc với bộ tản nhiệt so với cách bố trí ống dẫn nhiệt điển hình, cho phép luân chuyển nhiệt nhanh hơn và tạo nhiều không gian hơn cho luồng khí. Kết hợp với thiết kế đứng tiết kiệm diện tích của XG Mobile, hệ thống tản nhiệt thông khí tối ưu này cho phép hoạt động mạnh mẽ hơn trong thân hình siêu nhỏ gọn.</span></p><p style={{ marginBottom: '1rem', color: 'rgb(51, 51, 51)', fontFamily: 'Roboto, sans-serif' }}>&nbsp;<img src="https://anphat.com.vn/media/lib/20-04-2023/asusrogflowx16gv601vvnl016w3.jpeg" alt width={800} style={{ maxWidth: '100%', height: 'auto', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} /></p><p style={{ marginBottom: '1rem', color: 'rgb(51, 51, 51)', fontFamily: 'Roboto, sans-serif', textAlign: 'justify' }}><span style={{ fontSize: '14pt' }}>Công nghệ&nbsp;<span style={{ fontWeight: 'bolder' }}>Tri-Fan</span>&nbsp;và tản nhiệt toàn phần giúp&nbsp;<em><span style={{ fontWeight: 'bolder' }}>ASUS ROG Flow X16</span></em>&nbsp;biến hình từ một model laptop mỏng nhẹ thành một chiếc laptop gaming thực thụ. Hợp chất tản nhiệt kim loại lỏng Thermal Grizzly hỗ trợ nâng cao truyền nhiệt và hạn chế gây tiếng ồn khi quạt tản nhiệt hoạt động.</span></p><h3 style={{ lineHeight: '1.2', fontSize: '1.75rem', color: 'rgb(51, 51, 51)', fontFamily: 'Roboto, sans-serif', textAlign: 'justify' }}><span style={{ fontSize: '14pt' }}>Kết nối đa dụng</span></h3><p style={{ marginBottom: '1rem', color: 'rgb(51, 51, 51)', fontFamily: 'Roboto, sans-serif', textAlign: 'justify' }}><span style={{ fontSize: '14pt' }}>Được trang bị đủ tất cả các cổng cần thiết cho các công việc sáng tạo chuyên nghiệp hay giải trí. Bao gồm cổng HDMI, USB 3.2, ROG XG Mobile Interface, USB 3.2 Gen 2 Type-C support DisplayPort cùng jack cắm tai nghe tiêu chuẩn 3.5mm… Cổng kết nối ROG XG Mobile Interface là chi tiết độc quyền với mục đích chính là khai thác tối đa chiếc card đồ họa GeForce RTX 4060.</span></p><p style={{ marginBottom: '1rem', color: 'rgb(51, 51, 51)', fontFamily: 'Roboto, sans-serif' }}><span style={{ fontSize: '14pt' }}><img src="https://anphat.com.vn/media/lib/20-04-2023/asusrogflowx16gv601vvnl016w2.jpeg" alt width={800} style={{ maxWidth: '100%', height: 'auto', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} /></span></p>                                <div className="pd-btn-desc ">
                            <a href="javascript:void(0)" id="expandDescription">XEM THÊM <i className="fas fa-angle-double-down" aria-hidden="true" /></a>
                            <a href="javascript:void(0)" id="collapseDescription" style={{ display: 'none' }}>THU GỌN <i className="fas fa-angle-double-up" aria-hidden="true" /></a>
                        </div>
                    </div>

                </Tab>
                <Tab eventKey="profile" title="Thông số kỹ thuật">
                    Thông số kỹ thuật
                </Tab>

            </Tabs>

        </section>
    </>);
}

export default ProductsDetail;