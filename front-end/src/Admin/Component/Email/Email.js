import { useEffect, useState } from "react";
import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";
import axios from "axios";
import * as XLSX from "xlsx";

const Email = () => {
    const [excelData, setExcelData] = useState([]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                setExcelData(jsonData);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleFileSubmit = () => {
        axios.post(`https://localhost:7201/api/Products/ImportExcel`, { data: excelData })
            .then(res => console.log(res.data))
            .catch(err => console.error(err));
    };

    return (
        <>
            <SidebarAdmin />
            <div id="right-panel" className="right-panel" style={{ width: "87%" }}>
                <HeaderAdmin />
                <h1>Cấu hình Email</h1>
                <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                <button onClick={handleFileSubmit}>Submit</button>
                <div>
                    <h3>Preview:</h3>
                    <pre>{JSON.stringify(excelData, null, 2)}</pre>
                </div>
            </div>
        </>
    );
}

export default Email;
