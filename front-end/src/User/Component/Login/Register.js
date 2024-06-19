import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Register = () => {
    
    const [User, setUser] = useState({
        Username: '',
        Phone: '',
        passwordone: '',
        password: ''
    });
    const [Error, setError] = useState("");
    const navigate = useNavigate();
    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setUser(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (User.passwordone !== User.password) {
            setError("Mật khẩu không trùng khớp !");
            return;
        }

        if (!User.Username || !User.Phone || !User.password) {
            alert('Nhập đầy đủ thông tin');
            return;
        }

        try {
            const res = await axios.post(`https://localhost:7201/api/Users/register`, User); 
            if (res.data.status === 0) {
                setError("Tên người dùng đã tồn tại");
            } else if (res.data.status === 1) {
                setError("Mật khẩu bao gồm 1 chữ hoa, 1 ký tự đặc biệt và chữ số");
            } else if (res.data.success === true) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Tạo tài khoản thành công",
                    showConfirmButton: false,
                    timer: 1500
                  });
                // Chờ 1.5 giây trước khi chuyển hướng
                setTimeout(() => {
                   navigate("/login");
                }, 1100);
            } else {
                setError(""); 
            }
        } catch (error) {
            console.error("There was an error!", error);
            setError("Có lỗi xảy ra trong quá trình đăng ký.");
        }
    }; 

    return (
        <div className=" ">
            <article className="card-body mx-auto" style={{ maxWidth: 400 }}>
                <h4 className="card-title mt-3 text-center">Create Account</h4>
                <p className="text-center">Get started with your free account</p>
                <form className="card p-4" onSubmit={handleSubmit}>
                    <div className="form-group input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"> <i className="fa fa-user" /> </span>
                        </div>
                        <input name="Fullname" required onChange={handleChange} className="form-control" placeholder="Full Name" type="text" />
                    </div>

                    <div className="form-group input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"> <i className="fa fa-user" /> </span>
                        </div>
                        <input name="Username" required onChange={handleChange} className="form-control" placeholder="User Name" type="text" />
                    </div>

                    <div className="form-group input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"> <i className="fa fa-envelope" /> </span>
                        </div>
                        <input name="Email" onChange={handleChange} className="form-control" placeholder="Email address" type="email" />
                    </div>

                    <div className="form-group input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"> <i className="fa fa-phone" /> </span>
                        </div>
                        <input name="Phone" onChange={handleChange} className="form-control" placeholder="Phone number" type="number" />
                    </div>

                    <div className="form-group input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"> <i className="fa fa-lock" /> </span>
                        </div>
                        <input name="passwordone" required onChange={handleChange} className="form-control" placeholder="Create password" type="password" />
                    </div>

                    <div className="form-group input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"> <i className="fa fa-lock" /> </span>
                        </div>
                        <input name="password" required onChange={handleChange} className="form-control" placeholder="Repeat password" type="password" />
                    </div>

                    {Error && (
                        <div className="error mt-1 mb-3 text-center text-danger">
                            <i className="fa fa-exclamation-triangle"></i> {Error}
                        </div>
                    )}

                    <div className="form-group">
                        <button type="submit" className="btn btn-primary btn-block"> Create Account</button>
                    </div>

                    <p className="text-center">Have an account? <Link className="text-primary" to={`/login`}>Log In</Link></p>
                </form>
            </article>
        </div>
    );
}

export default Register;
