import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LayoutAdmin from '../Admin/LayoutAdmin/LayoutAdmin';
import Products from '../Admin/Component/Products/Products';
import Categories from '../Admin/Component/Categories/Categories';
import Login from '../User/Component/Login/Login';
import Brand from '../Admin/Component/Brand/Brand';
import BrandEdit from '../Admin/Component/Brand/BrandEdit';
import Attribute from '../Admin/Component/Attribute/Attribute';
import AttributeValue from '../Admin/Component/Attribute/AttribiuteValue';
import CategoriesEdit from '../Admin/Component/Categories/CategoriesEdit';
import AttributeEdit from '../Admin/Component/Attribute/AttributeEdit';
import CustomerSupplier from '../Admin/Component/CustomerSupplier/CustomerSupplier';
import ProductsCreate from '../Admin/Component/Products/ProductsCreate';
import ProductsEdit from '../Admin/Component/Products/ProductsEdit';
import Email from '../Admin/Component/Email/Email';
import Order from '../Admin/Component/Order/Order';
 
 

const PrivateRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/admin">
                    <Route index element={<LayoutAdmin />} />
                    <Route path="products">
                        <Route index element={<Products />}></Route>
                        <Route path="create" element={<ProductsCreate />} />
                        <Route path="edit/:id" element={<ProductsEdit />} />
                    </Route>
                    <Route path="categories">
                        <Route index element={<Categories />}></Route>
                        <Route path="chinh-sua-danh-muc/:id" element={<CategoriesEdit />} />
                    </Route>
                    <Route path="brand">
                        <Route index element={<Brand />}></Route>
                        <Route path="chinh-sua-thuong-hieu/:id" element={<BrandEdit />} />
                    </Route>
                    <Route path="attributes">
                        <Route index element={<Attribute />}></Route>  
                        <Route path="chinh-sua-thuoc-tinh/:id" element={<AttributeEdit />} />
                        <Route path="attributevalues/:id" element={<AttributeValue />} />
                    </Route>
                    <Route path="customer-supplier">
                        <Route index element={<CustomerSupplier />}></Route>   
                    </Route>
                    <Route path="email-config">
                        <Route index element={<Email />}></Route>   
                    </Route>
                    <Route path="order">
                        <Route index element={<Order />}></Route>   
                    </Route>
                   
                </Route>

                {/* login admin*/}
                <Route path="/login" element={<Login />}>
                    <Route index element={<Login />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default PrivateRouter;
