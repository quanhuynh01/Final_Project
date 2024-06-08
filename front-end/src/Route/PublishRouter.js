import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutUser from "../User/LayoutUser/LayoutUser";
import Login from "../User/Component/Login/Login";

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
            </Routes>
        </BrowserRouter>

    </>);
}

export default PublishRouter;