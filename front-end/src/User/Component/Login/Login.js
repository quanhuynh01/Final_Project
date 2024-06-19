import axios from "axios";
import { useState } from "react";
import Swal from 'sweetalert2'
import './Login.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { Link } from "react-router-dom";

const Login = () => {
 
 
  const [Login, setLogin] = useState();
  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setLogin(prev => ({ ...prev, [name]: value }));
  } 
  const HandelSubmitGoogle =()=>{
      alert('123');
  }

  const HandelSubmit = (e) => {
    console.log(Login);
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
          <a href="index.html">
            <img style={{width:"100px"}} className="align-content " src="https://img.lovepik.com/free-png/20211206/lovepik-computer-icon-png-image_401346483_wh1200.png" alt="" />
          </a>
        </div>
        <div className="login-form">
          <form>
            <div className="form-group">
              <label>Email address</label>
              <input type="text" className="form-control" placeholder="Username" name="username" onChange={(e) => handleChange(e)} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-control" placeholder="Password" name="password" onChange={(e) => handleChange(e)} />
            </div>
            <div className="checkbox">
              <label>
                <input type="checkbox" /> Remember Me
              </label>
              <label className="pull-right">
                <a href="#">Forgotten Password?</a>
              </label>
            </div>
            <button type="button" className="btn btn-success btn-flat m-b-30 m-t-30" onClick={HandelSubmit}>Sign in</button>
            <div className="social-login-content">
              <div className="social-button">
                <button type="button"  className="btn social facebook btn-flat btn-addon mb-3"><i className="ti-facebook" />Sign in with facebook</button>

                <GoogleLogin
                  onSuccess={credentialResponse => {
                    console.log(credentialResponse);
                  }}
                  onError={() => {
                    console.log('Login Failed');
                  }}
/>
                <button type="button" onClick={HandelSubmitGoogle} className="btn btn-warning social google btn-flat btn-addon mt-2"><i className="ti-google" />Sign in with Google</button>
              </div>
            </div>
            <div className="register-link m-t-15 text-center">
              <p>Don't have account ? <Link to={`/register`}> Sign Up Here</Link></p>
            </div>
          </form>
        </div>
      </div>
 
  </>
  );
}

export default Login;