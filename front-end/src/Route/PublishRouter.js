import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutUser from "../User/LayoutUser/LayoutUser";
import Login from "../User/Component/Login/Login"; 
import ProductsDetail from "../User/Component/Products/ProductsDetail";
import ProductsList from "../User/Component/Products/ProductsList";
import Cart from "../User/Component/Cart/Cart";
import ProductsCategories from "../User/Component/Products/ProductsCategories";
import Register from "../User/Component/Login/Register";
import Account from "../User/Component/Account/Account";
import AccountForgot from "../User/Component/Login/AccountForgot";
 
import ProductAttibute from "../User/Component/Products/ProductAttribute";
import PaySuccess from "../User/PaySuccess/PaySuccess";
import WistList from "../User/Component/WistList/WistList";
import Contact from "../User/Component/Contact/Contact";
import NotFound from "../User/NotFound";

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
                <Route path="/register" element={<Register />}>
                    <Route index element={<Register />} /> 
                </Route>
                <Route path="/shop.html" element={<ProductsList />}>
                    <Route index element={<ProductsList />} /> 
                </Route>
                <Route path="/tai-khoan" element={<Account />}>
                    <Route index element={<Account />} /> 
                </Route>
                <Route path="/quen-mat-khau" element={<AccountForgot />}>
                    <Route index element={<AccountForgot />} /> 
                </Route>
                <Route path="/chi-tiet-san-pham/:id" element={<ProductsDetail />} />
                <Route path="/danh-muc/:id" element={<ProductsCategories />} />
                
                <Route path="/filteValue/:id/:catid" element={<ProductAttibute />} /> 

                <Route path="/cart" element={<Cart />}>
                    <Route index element={<Cart />} />
                </Route>

                <Route path="/wishList" element={<WistList />}>
                    <Route index element={<WistList />} />
                </Route>

                <Route path="/contact.html" element={<Contact />}>
                    <Route index element={<Contact />} />
                </Route>
                <Route path="/paysucces.html" element={<PaySuccess />}>
                    <Route index element={<PaySuccess />} />
                </Route>
                <Route path="/not-found" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />

            </Routes>
        </BrowserRouter>

    </>);
}

export default PublishRouter;