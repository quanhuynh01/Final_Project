import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutUser from "../User/LayoutUser/LayoutUser";
import Login from "../User/Component/Login/Login"; 
import ProductsDetail from "../User/Component/Products/ProductsDetail";
import ProductsList from "../User/Component/Products/ProductsList";

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
            </Routes>
        </BrowserRouter>

    </>);
}

export default PublishRouter;