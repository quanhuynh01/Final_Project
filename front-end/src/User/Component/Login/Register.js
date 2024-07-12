import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Register = () => {
    const [isLoading, setIsLoading] = useState(false);
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
    const ValidatePhoneNumber = (phoneNumber) => {
        var regExp = /^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$/;
        return regExp.test(phoneNumber);
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); 
        if (User.passwordone !== User.password) {
            setError("Mật khẩu không trùng khớp !");
            setIsLoading(false);
            return;
        } 
        if (!User.Username || !User.password) {
            setError("Vui lòng nhập đầy đủ thông tin");
            setIsLoading(false);
            return;
        }
    
        if (!ValidatePhoneNumber(User.Phone)) {
            setError("Số điện thoại chưa đúng định dạng");
            setIsLoading(false);
            return;
        }
    
        Swal.fire({
            title: "Đăng ký tài khoản!",
            html: "Đang xử lý ...",
            timer: 2100,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            }
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log("I was closed by the timer");
            }
        });
    
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
                    timer: 1100
                });
                setTimeout(() => {
                    navigate("/login");
                }, 1100);
            } else {
                setError("Đã xảy ra lỗi không xác định.");
            }
        } catch (error) {
            console.error("There was an error!", error);
            setError("Có lỗi xảy ra trong quá trình đăng ký.");
        } finally {
            setIsLoading(false);
        }
    };  
    return (
        <div className=" ">
            <article className="card-body mx-auto" style={{ maxWidth: 400 }}>
                <h4 className="card-title mt-3 text-center">Tạo mới tài khoản</h4>
                <p className="text-center">Hãy trải nghiệm dịch vụ chúng tôi </p>
                <form className="card p-4" onSubmit={handleSubmit}>
                    <div className="form-group input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"> <i className="fa  fa-male"></i></span>
                        </div>
                        <input name="Fullname" required onChange={handleChange} className="form-control" placeholder="Họ và tên" type="text" />
                    </div>

                    <div className="form-group input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"> <i className="fa fa-user" /> </span>
                        </div>
                        <input name="Username" required onChange={handleChange} className="form-control" placeholder="Tên đăng nhập" type="text" />
                    </div>

                    <div className="form-group input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"> <i className="fa fa-envelope" /> </span>
                        </div>
                        <input name="Email" onChange={handleChange} className="form-control" placeholder="Địa chỉ email" type="email" />
                    </div>

                    <div className="form-group input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"> <i className="fa fa-phone" /> </span>
                        </div>
                        <input name="Phone" onChange={handleChange} className="form-control" placeholder="Số điện thoại" type="number" />
                    </div>

                    <div className="form-group input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"> <i className="fa fa-lock" /> </span>
                        </div>
                        <input name="passwordone" required onChange={handleChange} className="form-control" placeholder="Nhập mật khẩu" type="password" />
                    </div>

                    <div className="form-group input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"> <i className="fa fa-lock" /> </span>
                        </div>
                        <input name="password" required onChange={handleChange} className="form-control" placeholder="Nhập lại mật khẩu" type="password" />
                    </div> 
                    {

                    }
                    {Error && (
                        <div className="error mt-1 mb-3 text-center text-danger">
                            <i className="fa fa-exclamation-triangle"></i> {Error}
                        </div>
                    )}

                    <div className="form-group">
                        <button type="submit" className="btn btn-primary btn-block">Đăng ký</button>
                    </div>

                    <p className="text-center">Bạn đã có tài khoản? <Link className="text-primary" to={`/login`}>Đăng nhập</Link></p>
                </form>
            </article>
        </div>
    );
}

export default Register;
