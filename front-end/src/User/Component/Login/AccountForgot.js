import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AccountForgot =()=>{
     
    const navigate = useNavigate();
  const [Username, setUsername] = useState(''); 
  const handleSubmit =(e)=>{
    e.preventDefault();
    if(Username !=="")
    {
        axios.post(`https://localhost:7201/api/Users/ForgotPass/${Username}`).then(res=>{
            console.log(res);
            if (res.data.status === 200) {
                Swal.fire({
                    title: "Khôi phục tài khoản thành công, vui lòng kiểm tra Email để nhận mật khẩu",
                    showClass: {
                      popup: `
                        animate__animated
                        animate__fadeInUp
                        animate__faster
                      `
                    },
                    hideClass: {
                      popup: `
                        animate__animated
                        animate__fadeOutDown
                        animate__faster
                      `
                    }
                  });
                navigate("/login");
            }
            else{
                Swal.fire({
                    icon: "error",
                    title: "Tài khoản không tồn tại"
                  });
            }
        });
    }
    else{
        alert("Nhập tên tài khoản");
    }
  }
  console.log(Username);
    return (  <> 
        <div className="login-content">
          <div className="login-logo">
            <a href="index.html">
              <img style={{width:"100px"}} className="align-content " src="https://img.lovepik.com/free-png/20211206/lovepik-computer-icon-png-image_401346483_wh1200.png" alt="" />
            </a>
          </div>
          <div className="login-form">
            <h5 className="text-center">Quên mật khẩu</h5>
            <form> 
              <div className="form-group">
                <label>Nhập tên tài khoản</label>
                <input type="text" className="form-control" placeholder="Nhập tên tài khoản" name="username" onChange={(e) => setUsername(e.target.value)} />
              </div> 
              <div className="social-login-content">
                <div className="social-button"> 
                  <button type="button" onClick={handleSubmit} className="btn btn-success social google btn-flat btn-addon mt-2"> Gửi</button>
                </div>
              </div>
               
            </form>
          </div>
        </div>
   
    </>)
}
export default AccountForgot