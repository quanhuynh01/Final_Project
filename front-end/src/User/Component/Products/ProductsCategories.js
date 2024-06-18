import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router"; 
import Header from "../Header/Header";
import { Breadcrumb, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
const ProductsCategories = ()=>{ 
    const {id}= useParams();
    const [Products, setProducts] = useState([]); 
    const [cart, setCart] = useState([]); 
    const [NameCate, setNameCate] = useState(null);
    useEffect(() => {
        axios.get(`https://localhost:7201/danh-muc/${id}`)
            .then( res=> {
                setProducts(res.data.data);
                setNameCate(res.data.nameCategories);
            });
    }, []);  
    
    // const [selectedCategory, setCategory] = useState(null);
    // const [isShowModal, setShowModal] = useState(false);
    // const [selectedProduct, setProduct] = useState(null); 
    // const [isShowCart, setShowCart] = useState(false); 
    // const onClickCategoryHandler = (cat_id) => {
    //   setCategory(cat_id);
    // }; 

    const onAddtoCartHandler = (product) => {
        console.log(product);
      if (cart.indexOf(product) !== -1) return null;
      const arr = [...cart];
      product.amount = 1;
      arr.push(product);
      setCart([...arr]);
    };
  
    useEffect(() => {
      console.log(cart);
    });
  
    //   console.log(selectedCategory);
    // let filteredProducts = [...Products];
    // if (selectedCategory != null) {
    //   filteredProducts = Products.filter(
    //     (product) => product.category_id == selectedCategory
    //   );
    // }

    //chuyển đổi tiền
    function convertToVND(price) {  
        const priceInVND = price * 1000;
        return priceInVND.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    } 
    return (<> 
    <Header soluong={cart.length} />
        <Breadcrumb > 
            <Breadcrumb.Item className="ml-5" href="/">Trang chủ</Breadcrumb.Item>
            <Breadcrumb.Item active>{NameCate}</Breadcrumb.Item> 
        </Breadcrumb>
        <div className="container">
            {
                Products.map((item, index) => {
                    return (<div key={index}>
                        <Card className='card-item' style={{ width: '17.5rem', margin: '10px' }}>
                            <Card.Img variant="top" src={`https://localhost:7201${item.product.avatar}`} alt='' />
                            <Card.Body style={{ position: "relative" }}>
                                <Link key={item.product.id} to={`/chi-tiet-san-pham/${item.id}`}>
                                    <div className='d-flex' style={{ justifyContent: "space-between" }}>
                                        <Card.Text>Mã SP:{item.product.sku}</Card.Text>
                                        <Card.Text className={item.product.stock > 0 ? 'text-success' : 'text-danger'}>
                                            {item.product.stock > 0 ? <><i className='fa fa-check'></i> Còn hàng</> : "Hết hàng"}
                                        </Card.Text>
                                    </div>
                                    <Card.Title style={{ height: '3rem', overflow: "hidden" }}>
                                        {item.product.productName}
                                    </Card.Title>
                                    <Card.Text>Giá: {convertToVND(item.product.price)}</Card.Text>
                                </Link>
                            </Card.Body>
                            <div style={{ display: "flex", justifyContent: "flex-end", position: "absolute", bottom: "10px", right: "20px" }}>
                                <Button  onClick={() => onAddtoCartHandler(item.product)}  variant="primary"><i className="fa fa-shopping-cart"></i></Button>
                            </div>

                        </Card>
                    </div>)
                })
            }
        </div>
    </>)
}
export default ProductsCategories;