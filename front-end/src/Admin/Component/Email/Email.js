import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";

const Email = () => {
    return (<>
        <SidebarAdmin />
        <div id="right-panel" className="right-panel" style={{ width: "87%" }}>
            <HeaderAdmin />
            <h1>Cấu hình Email</h1>
        </div>
    </>)

}
export default Email;