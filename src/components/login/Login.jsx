import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from 'axios';

const Login = () => {

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    const cu = useSelector(store => store.userSection.cu)
    const move = useNavigate()
    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const [Error, setError] = useState("");
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };


    const Login = async (data) => {

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/login`, data)
            let loginUser = response.data;
            if (loginUser) {
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

    useEffect(() => {
        if (Error) {
            const timeoutId = setTimeout(() => {
                setError('');
            }, 5000);

            return () => clearTimeout(timeoutId);
        }
    }, [Error]);

    useEffect(() => {
        if (cu._id != undefined) {
            return move('/')
        }
    }, [cu])

    return <>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-lg-6 col-sm-12 my-5'>
                    <div>
                        <p className="m-0 fs-2 text-center fw-bolder">
                            Login to my Account
                        </p>
                        <p className="m-0 fs-6 text-center">
                            Enter your email and password
                        </p>
                    </div>

                    <form action="" onSubmit={handleSubmit(Login)}>
                        {Error === "Invalid Credentials" && (
                            <div className="error mb-3">
                                {" "}
                                Invalid Credentials{" "}
                            </div>
                        )}
                        <div className="input-group my-4">
                            <label htmlFor="" className='mb-1'>Enter Your Email *</label>
                            <input required="true"
                                placeholder='joe123@gmail.com'
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
                        <div className="input-group mb-3">
                            <label htmlFor="" className='mb-1'>Enter Password *</label>
                            <input
                                placeholder='*******'
                                required="true"
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
                            <span
                                className="register_btn"
                                onClick={() => {
                                    move("/signup")
                                }}
                            >
                                Register
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Login