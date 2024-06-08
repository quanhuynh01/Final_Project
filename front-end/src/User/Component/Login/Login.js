import axios from "axios";
import { useState } from "react";
import Swal from 'sweetalert2'
const Login = () => {
    const [Login, setLogin] = useState();
    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setLogin(prev => ({ ...prev, [name]: value }));
    }
    const HandelSubmit = (e) => {
        console.log(Login);
        if(Login ==null)
        {
            alert('Nhập đầy đủ thông tin');
        }
        else{
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
    

    
    return (<> {/* 
<div className="main-wrapper">
  <div className="preloader" style={{display: 'none'}}>
    <div className="lds-ripple">
      <div className="lds-pos" />
      <div className="lds-pos" />
    </div>
  </div>
  <div className="
    auth-wrapper
    d-flex
    no-block
    justify-content-center
    align-items-center
    bg-light
  ">
   <div className="auth-box bg-light border-top border-secondary">
      <div id="loginform">
        <div className="text-center pt-3 pb-3">
          <span className="db"><img src="https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg" alt="logo" /></span>
        </div>
  
        <form className="form-horizontal mt-3" id="loginform" action="index.html">
          <div className="row pb-4">
            <div className="col-12">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text bg-success text-white h-100" id="basic-addon1"><i className="fa fa-user fs-4" /></span>
                </div>
                <input type="text" className="form-control form-control-lg username" name="username" onChange={(e) =>handleChange(e)} placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" required />
              </div>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text bg-warning text-white h-100" id="basic-addon2"><i className="fa fa-lock fs-4" /></span>
                </div>
                <input type="text" className="form-control form-control-lg password" onChange={(e) =>handleChange(e)}  placeholder="Password" aria-label="Password"  name="password" aria-describedby="basic-addon1" required />
              </div>
            </div>
          </div>
          <div className="row border-top border-secondary">
            <div className="col-12">
              <div className="form-group">
                <div className="pt-3">
                  <button className="btn btn-info" id="to-recover" type="button">
                    <i className="mdi mdi-lock fs-4 me-1" /> Lost password?
                  </button>
                  <button className="btn btn-success float-end text-white btn-login" type="button" onClick={(e)=>HandelSubmit(e)}> 
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div> 
    </div> 

  </div>
</div>
*/}
<div className="sufee-login d-flex align-content-center flex-wrap">
  <div className="container">
    <div className="login-content">
      <div className="login-logo">
        <a href="index.html">
          <img className="align-content" src="images/logo.png" alt="" />
        </a>
      </div>
      <div className="login-form">
        <form>
          <div className="form-group">
            <label>Email address</label>
            <input type="text" className="form-control" placeholder="Username" name="username" onChange={(e) =>handleChange(e)}/>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Password"   name="password" onChange={(e) =>handleChange(e)}/>
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
              <button type="button" className="btn social facebook btn-flat btn-addon mb-3"><i className="ti-facebook" />Sign in with facebook</button>
              <button type="button" className="btn social twitter btn-flat btn-addon mt-2"><i className="ti-twitter" />Sign in with twitter</button>
            </div>
          </div>
          <div className="register-link m-t-15 text-center">
            <p>Don't have account ? <a href="#"> Sign Up Here</a></p>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>



    </>
    );
}
 
export default Login;