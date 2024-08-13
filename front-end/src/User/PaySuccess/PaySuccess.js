import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Header from "../Component/Header/Header";
import Navbar from "../Component/Navbar/Navbar";
import { Link } from "react-router-dom";
import axios from "axios";
import $ from 'jquery'
import Footer from "../Component/Footer/Footer";
const PaySuccess = () => {
    const [queryString, setqueryString] = useState(null);
    const [invoice, setinvoice] = useState({code:""}); 
    const [Qurery, setQurery] = useState(null);
    const navigate = useNavigate();
    useEffect(() => { 
        const Url = window.location.search;
        setqueryString(Url);
        const UrlParams = new URLSearchParams(queryString);
        const vnp_TransactionStatus = UrlParams.get(`vnp_TransactionStatus`);  
        const vnp_TxnRef =UrlParams.get(`vnp_TxnRef`);
        const vnp_ResponseCode = UrlParams.get('vnp_ResponseCode')
        localStorage.setItem("vnp_TxnRef",vnp_TxnRef) ; 
        localStorage.setItem("vnp_ResponseCode",vnp_ResponseCode) ;  
        if(vnp_ResponseCode === "00")
        {
            $('.inforpayment').removeClass('d-none');
            var idOrder = localStorage.getItem("idOrder");
            var  vnp_TxnRefCode=localStorage.getItem("vnp_TxnRef");
            axios.put(`https://localhost:7201/api/Orders/${idOrder}?code=${vnp_TxnRefCode}`).then(res=> 
               {  
                if(res.status === 200)
                {
                    localStorage.removeItem("idOrder");
                    setinvoice(prev => ({ ...prev, code: res.data.code }))
                    localStorage.removeItem(`vnp_TxnRef`); 
                    localStorage.removeItem('vnp_ResponseCode');
                } 
               });
        }
        if (vnp_ResponseCode === "24") {
            var idOrder = localStorage.getItem("idOrder");
            alert("Giao dịch không thành công");
            $('.inforpayment').css("display","none");
            axios.delete(`https://localhost:7201/api/Orders/HanleDelete/${idOrder}`).then(res=> 
                {    
                 if(res.status === 200)
                 {
                     localStorage.removeItem("idOrder");
                     //setinvoice(prev => ({ ...prev, code: res.data.code }))
                     localStorage.removeItem(`vnp_TxnRef`); 
                     localStorage.removeItem('vnp_ResponseCode');
                     navigate(`/`);
                 } 
                });
        }
        //lấy order 

    }, [queryString]); 
    return (<>
        <Header />
        <Navbar/>
        <div className="container card mt-5 p-3 inforpayment d-none" > 
            <h1 className="text-success text-center"><i className="fa fa-check-circle">Thanh toán thành công</i></h1>
            <div className="infor-payment d-flex mt-2"  style={{alignItems:"center",flexDirection:"column-reverse"}}>
                <h5 className="d-flex">Mã đơn hàng của bạn:  <b className="text-success ">{invoice.code}</b></h5>
                 <h5>Xem chi tiết đơn hàng <Link style={{fontSize:"15px" }} to={`/tai-khoan`}>Tại đây</Link></h5>
            </div>
        </div> 
        <Footer/>
    </>);
}
 
export default PaySuccess;