import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutUser from "../User/LayoutUser/LayoutUser";
import Login from "../User/Component/Login/Login"; 
import ProductsDetail from "../User/Component/Products/ProductsDetail";
import ProductsList from "../User/Component/Products/ProductsList";
import Cart from "../User/Component/Cart/Cart";
import ProductsCategories from "../User/Component/Products/ProductsCategories";

const PublishRouter = () => {
    return (<>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LayoutUser />}>
                    <Route index element={<LayoutUser />} />
                </Route>
                <Route path="/login" element={<Login />}>
                    <Route index element={<Login />} />
                </Route>
                <Route path="/san-pham" element={<ProductsList />}>
                    <Route index element={<ProductsList />} /> 
                </Route>
                <Route path="/chi-tiet-san-pham/:id" element={<ProductsDetail />} />
                <Route path="/danh-muc/:id" element={<ProductsCategories />} />
                <Route path="/cart" element={<Cart />}>
                    <Route index element={<Cart />} />
                </Route>
            </Routes>
        </BrowserRouter>

    </>);
}

export default PublishRouter;