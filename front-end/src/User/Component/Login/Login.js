import axios from "axios";
import { useState } from "react";
import Swal from 'sweetalert2'
import './Login.css' 
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
 
 
  const [Login, setLogin] = useState();
  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setLogin(prev => ({ ...prev, [name]: value }));
  } 
  const [Error, setError] = useState();
  const navigate = useNavigate();
  
  const handleGoogleSuccess = (response) => { 
    if (response) {
        try {
            const decoded = jwtDecode(response.credential);
            //console.log("Decoded Token: ", decoded);
            if (decoded && decoded.email) {
                const newAccGoogle = {
                    Email: decoded.email,
                    Fullname: decoded.name
                }; 
                // Your axios post request here
                axios.post(`https://localhost:7201/api/Users/LoginGoogle`, newAccGoogle)
                    .then(res => { 
                        localStorage.setItem("token", res.data);
                        if (res.status === 200) {
                            navigate("/");
                        }
                    })
                    .catch(error => {
                        console.log("Đăng nhập bằng Google thất bại. Vui lòng thử lại!");
                        console.log(error);
                    });
            } else {
                console.log("Email not found in the decoded token");
            }
        } catch (error) {
            console.error("Error decoding token: ", error);
        }
    }
};

  const HandelSubmit = (e) => {  
    if (Login == null) {
      alert('Nhập đầy đủ thông tin');
    }
    else {
      e.preventDefault();
      //console.log(Login);
      axios.post(`https://localhost:7201/api/Users/login`, Login)
        .then(res => { 
          if (res.data.token) {
            // console.log(res.data.token)
            localStorage.setItem('token', res.data.token);
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Đăng nhập thành công !",
              showConfirmButton: false,
              timer: 1500
            });

            setTimeout(() => {
              window.location.href = 'http://localhost:3000';
            }, 1300);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Đăng nhập thất bại !",
              showConfirmButton: false,
              timer: 1500
            });

          }
        })
        .catch(error => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Đăng nhập thất bại !",
            showConfirmButton: false,
            timer: 1500
          });
          console.error('Error:', error);

        });
    }

  }
 
  return (
  <> 
      <div className="login-content">
        <div className="login-logo">
          <Link to={`/`}>
            <img style={{width:"100px"}} className="align-content " src="https://img.lovepik.com/free-png/20211206/lovepik-computer-icon-png-image_401346483_wh1200.png" alt="" />
          </Link>
        </div>
        <div className="login-form">
          <form>
            <div className="form-group">
              <label>Tài khoản</label>
              <input type="text" className="form-control" placeholder="Nhập tên tài khoản" name="username" onChange={(e) => handleChange(e)} />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <input type="password" className="form-control" placeholder="Nhập mật khẩu" name="password" onChange={(e) => handleChange(e)} />
            </div>
            <div className="checkbox">
              <label>
                <input type="checkbox" /> Ghi nhớ đăng nhập
              </label>
              <label className="pull-right">
                <Link to={"/quen-mat-khau"}>Quên mật khẩu</Link>
              </label>
            </div>
            <button type="button" className="btn btn-success btn-flat m-b-30 m-t-30" onClick={HandelSubmit}>Đăng nhập</button>
            <div className="social-login-content">
              <div className="social-button">
               
                <div className="d-flex justify-content-center">
                  <GoogleLogin onClick={handleGoogleSuccess}
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                      console.log('Login Failed');
                    }}
                  />
                </div>
                
                {/* <button type="button" onClick={HandelSubmitGoogle} className="btn btn-warning social google btn-flat btn-addon mt-2"><i className="ti-google" />Sign in with Google</button> */}
              </div>
            </div>
            <div className="register-link m-t-15 text-center">
              <p>Bạn chưa có tài khoản? <Link to={`/register`}> Đăng ký ngay</Link></p>
            </div>
          </form>
        </div>
      </div>
 
  </>
  );
}

export default Login;