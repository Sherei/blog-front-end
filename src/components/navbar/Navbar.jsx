import React, { useState, useEffect, useRef } from 'react'
import { useForm } from "react-hook-form";
import { RxCross1 } from "react-icons/rx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./navbar.css"

const Navbar = () => {

  const cu = useSelector((store) => store.userSection.cu);
  const move = useNavigate();
  const dispatch = useDispatch();

  const ref = useRef();
  const [login, setLogin] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [Error, setError] = useState("");
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const Logintoggle = (event) => {
    event.stopPropagation();
    setLogin(!login)
  }


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setLogin(false);
      }

    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref]);

  const Login = async (data) => {

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/login`, data)
      let loginUser = response.data;
      if (loginUser) {
        setLogin(false)
        localStorage.setItem("userToken", loginUser.myToken);
        dispatch({
          type: "LOGIN_USER",
          payload: loginUser.user,
        });
        if (loginUser.user.email === "admin@gmail.com") {
          move("/admin-dashboard");
          toast.success("Welcome to Admin Panel");
        } else {
          toast.success("Welcome to Blogs");
          move("/");
        }
      }
    } catch (e) {
      if (e.response && e.response.status === 404) {
        setError("Invalid Credentials");
      } else {
        setError("Invalid Credentials");
      }
    }
  };

  function Logout() {
    dispatch({
      type: "LOGOUT_USER",
    });
    move("/login");
  }

  return <>
    <>
      <div className="container-fluid px-5 py-3" style={{ backgroundColor: "darkblue" }}>
        <div className='row'>
          <div className='col d-flex justify-content-between align-items-center'>
            <div>
              <NavLink to="/" style={{ color: "white" }}><strong>Ming Mingle</strong></NavLink>
            </div>
            <div className='d-flex gap-3'>
              {(cu._id != undefined && cu.email === "admin@gmail.com") &&
                <NavLink to="/admin-dashboard">
                  <button className="btn btn-outline-light" type="submit">
                    Admin
                  </button>
                </NavLink>
              }
              {cu._id === undefined &&
                <button className="btn btn-outline-light" type="submit" onClick={Logintoggle}>
                  Login
                </button>
              }
              {cu._id != undefined &&
                <button className="btn btn-outline-light" type="submit" onClick={Logout}>
                  Logout
                </button>
              }
            </div>
          </div>
        </div>

      </div>
      {login && (
        <div className="login_div px-4 py-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <p className="m-0 fs-5 text-center fw-bolder" >
                Login to my Account
              </p>
            </div>
            <div className='fw-bolder'
              style={{ color: "darkblue" }}
              onClick={() => {
                setLogin(false);
              }}
            >
              <RxCross1 />
            </div>
          </div>
        
          <form action="" onSubmit={handleSubmit(Login)}>
          {Error === "Invalid Credentials" && (
            <div className="error mb-3">
              {" "}
              Invalid Credentials{" "}
            </div>
          )}
            <div className="input-group my-2">
              <label htmlFor="" className='mb-1'>Enter Your Email *</label>
              <input required="true"
                type="email"
                className="form-control w-100" {...register('email', {
                  required: true, validate: function (typedValue) {
                    if (typedValue.match(
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    )) {
                      return true;
                    } else {
                      return false;
                    }
                  }
                })} />
              {errors.email ? <div className='error'>Email is required </div> : null}
            </div>
            <div className="input-group mb-3" style={{ position: "relative" }}>
              <label htmlFor="" className='mb-1'>Enter Password *</label>
              <input required="true"
                 type={showPassword ? "text" : "password"}
                className="form-control w-100"
                {...register('password', { required: true })} />
              {errors.password ? <div className='error'>Passowrd is required </div> : null}
              <button
                type="button"
                className="password-toggle-btn"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button> 
            </div>
            <button className="btn rounded login_btn mt-3">
              Login
            </button>
          </form>
          <div className="mt-3">
            <p className="m-0 fs-6">
              I don't have an account?{" "}
              <NavLink to="/signup">
                <span
                  className="register_btn"
                  onClick={() => {
                    setLogin(false);
                  }}
                >
                  Register
                </span>
              </NavLink>
            </p>
          </div>
        </div>
      )

      }

    </>

  </>
}

export default Navbar