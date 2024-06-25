import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UilUser, UilAt, UilLockAlt } from '@iconscout/react-unicons';
import './Login2.module.css';

const LoginSignUpForm = () => {
  const [isSignUp, setIsSignUp] = useState(false); // State để chuyển đổi giữa Đăng Nhập và Đăng Ký
  const [Login, setLogin] = useState({}); // State để lưu trữ thông tin đăng nhập/đăng ký

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const HandelSubmitGoogle =()=>{
    alert('123');
  }

  const handleCheckboxChange = () => {
    setIsSignUp(!isSignUp);
  };

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
      <a href="https://front.codes/" className="logo" target="_blank">
        <img src="https://assets.codepen.io/1462889/fcy.png" alt="" />
      </a>

      <div className="section">
        <div className="container">
          <div className="row full-height justify-content-center">
            <div className="col-12 text-center align-self-center py-5">
              <div className="section pb-5 pt-5 pt-sm-2 text-center">
                <h6 className="mb-0 pb-3">
                  <span onClick={() => setIsSignUp(false)}>Log In</span>
                  <span onClick={() => setIsSignUp(true)}>Sign Up</span>
                </h6>
                <input
                  className="checkbox"
                  type="checkbox"
                  id="reg-log"
                  name="reg-log"
                  checked={isSignUp}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="reg-log"></label>

                <div className="card-3d-wrap mx-auto">
                  <div className="card-3d-wrapper">
                    <div className="card-front">
                      <div className="center-wrap">
                        <div className="section text-center">
                          <h4 className="mb-4 pb-3">Log In</h4>
                          <div className="form-group">
                            <input
                              type="text"
                              name="username"
                              className="form-style"
                              placeholder="Your Email"
                              id="logemail"
                              autoComplete="off"
                              onChange={(e) => handleChange(e)}
                            />
                            <i className="input-icon"><UilAt  /></i>
                          </div>
                          <div className="form-group mt-2">
                            <input
                              type="password"
                              name="password"
                              className="form-style"
                              placeholder="Your Password"
                              id="logpass"
                              autoComplete="off"
                              onChange={(e) => handleChange(e)}
                            />
                            <i className="input-icon"><UilLockAlt  /></i>
                          </div>
                          <button
                            type="submit"
                            className="btn mt-4"
                            onClick={HandelSubmit}
                          >
                            Log In
                          </button>
                          <p className="mb-0 mt-4 text-center">
                            <a href="#0" className="link">
                              Forgot your password?
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="card-back">
                      <div className="center-wrap">
                        <div className="section text-center">
                          <h4 className="mb-4 pb-3">Sign Up</h4>
                          <div className="form-group">
                            <input
                              type="text"
                              name="name"
                              className="form-style"
                              placeholder="Your Full Name"
                              id="logname"
                              autoComplete="off"
                              onChange={handleChange}
                            />
                            <i className="input-icon"><UilUser /></i>
                          </div>
                          <div className="form-group mt-2">
                            <input
                              type="email"
                              name="email"
                              className="form-style"
                              placeholder="Your Email"
                              id="logemail"
                              autoComplete="off"
                              onChange={handleChange}
                            />
                            <i className="input-icon"><UilAt  /></i>
                          </div>
                          <div className="form-group mt-2">
                            <input
                              type="password"
                              name="password"
                              className="form-style"
                              placeholder="Your Password"
                              id="logpass"
                              autoComplete="off"
                              onChange={handleChange}
                            />
                            <i className="input-icon"><UilLockAlt  /></i>
                          </div>
                          <button
                            type="submit"
                            className="btn mt-4"
                            onClick={HandelSubmit}
                          >
                            Sign Up
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-success btn-flat m-b-30 m-t-30"
                  onClick={HandelSubmitGoogle}
                >
                  Sign in with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginSignUpForm;
