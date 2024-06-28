import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { Breadcrumb, Button, Form, Table } from "react-bootstrap";  
import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";

import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';
import './Contact.css';

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_jcjss04', 'template_gnx7gh8', form.current, {
        publicKey: 'S3wq9dYZBRcA3ZgHr',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Gửi liên hệ thành công!",
            showConfirmButton: false,
            timer: 1500
          });
        },
        (error) => {
          console.log('FAILED...', error.text);
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Gửi liên hệ thất bại!",
            showConfirmButton: false,
            timer: 1500
          });
        }
      );
  };
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra nếu có trường nào trống
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Vui lòng điền đầy đủ thông tin!",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    // Thiết lập các thông số cho EmailJS
    const serviceID = 'service_jcjss04';
    const templateID = 'template_gnx7gh8';

    // Gửi email qua EmailJS
    emailjs.send(serviceID, templateID, formData)
      .then(response => {
        console.log('Form submitted successfully:', response.status, response.text);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Gửi liên hệ thành công!",
          showConfirmButton: false,
          timer: 1500
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Gửi liên hệ thất bại!",
          showConfirmButton: false,
          timer: 1500
        });
      });
  };

    return (<>
            <Header />
            <Navbar />
            <Breadcrumb>
                <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item active>Contact</Breadcrumb.Item>
            </Breadcrumb>
        <div className="container-fluid">
            <h2 className="section-title position-relative text-uppercase-override mx-xl-5 mb-4">
                <span className="bg-secondary pr-3">Contact Us</span>
            </h2>
            <div className="col-lg-7 mb-5">
              <div className="contact-form bg-light p-30">
                <div id="success"></div>
                <form ref={form} onSubmit={sendEmail}>
                  <div className="control-group">
                    <label>Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="user_name"
                      placeholder="Your Name"
                      required="required"
                      data-validation-required-message="Please enter your name"
                    />
                    <p className="help-block text-danger"></p>
                  </div>
                  <div className="control-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="user_email"
                      placeholder="Your Email"
                      required="required"
                      data-validation-required-message="Please enter your email"
                    />
                    <p className="help-block text-danger"></p>
                  </div>
                  <div className="control-group">
                    <label>Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      name="subject"
                      placeholder="Subject"
                      required="required"
                      data-validation-required-message="Please enter a subject"
                    />
                    <p className="help-block text-danger"></p>
                  </div>
                  <div className="control-group">
                    <label>Message</label>
                    <textarea
                      className="form-control"
                      rows="8"
                      name="message"
                      placeholder="Message"
                      required="required"
                      data-validation-required-message="Please enter your message"
                    ></textarea>
                    <p className="help-block text-danger"></p>
                  </div>
                  <div>
                    <input className="btn btn-primary py-2 px-4" type="submit" value="Send Message" />
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-5 mb-5">
              <div className="bg-light p-30 mb-30">
                <iframe
                  style={{ width: '100%', height: '250px' }}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001156.4288297426!2d-78.01371936852176!3d42.72876761954724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4ccc4bf0f123a5a9%3A0xddcfc6c1de189567!2sNew%20York%2C%20USA!5e0!3m2!1sen!2sbd!4v1603794290143!5m2!1sen!2sbd"
                  frameBorder="0"
                  allowFullScreen=""
                  aria-hidden="false"
                  tabIndex="0"
                ></iframe>
              </div>
              <div className="bg-light p-30 mb-3">
                <p className="mb-2">
                  <i className="fa fa-map-marker-alt text-primary mr-3"></i>123 Street, New York, USA
                </p>
                <p className="mb-2">
                  <i className="fa fa-envelope text-primary mr-3"></i>info@example.com
                </p>
                <p className="mb-2">
                  <i className="fa fa-phone-alt text-primary mr-3"></i>+012 345 67890
                </p>
              </div>
            </div>
        </div>
        </>
      );
    };

export default Contact;