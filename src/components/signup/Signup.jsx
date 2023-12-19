import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router'
import { toast } from "react-toastify";
import axios from 'axios';


const Signup = () => {

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    const [showPassword, setShowPassword] = useState(false);
    const [Error, setError] = useState("");
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const move = useNavigate()

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const Signup = async (data) => {

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        // if (data.password != data.cpassword) {
        //     return setError("Password")
        // }
        console.log("Signup data is::", data)
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/signup`, data);
            if (response.data === "User Created") {
                toast.success("Account Created")
                move('/login')
                reset();
            }
        } catch (error) {
            console.log("error is::", error)
            if (error.response && error.response.status === 400) {
                setError('e-mail')
            } else if (error.response && error.response.status === 402) {
                setError('username')
            } else {
                setError('Try with different E-mail')
            }
        }
    }
    
    useEffect(() => {
        if (Error) {
            const timeoutId = setTimeout(() => {
                setError('');
            }, 5000);

            return () => clearTimeout(timeoutId);
        }
    }, [Error]);

    return <>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-lg-6 col-sm-12 my-5'>
                    <div>
                        <p className="m-0 fs-2 text-center fw-bolder">
                            Create Your Account
                        </p>
                    </div>
                    <form action="" onSubmit={handleSubmit(Signup)}>
                        {Error === "e-mail" &&
                            <div className='error mb-3'>Try with different E-mail</div>
                        }
                        {Error === "username" &&
                            <div className='error mb-3'>Try with different Username</div>
                        }
                        <div className="input-group my-4">
                            <label htmlFor="" className='mb-1'>Enter Your Name *</label>
                            <input type="text" className="form-control w-100" {...register('name', { required: true })} />
                            {errors.name ? <div className='error'>Name is required </div> : null}
                        </div>
                        <div className="input-group my-4">
                            <label htmlFor="" className='mb-1'>Enter Your username *</label>
                            <input type="text" className="form-control w-100" {...register('username', { required: true })} />
                            {errors.username ? <div className='error'>Username is required </div> : null}
                        </div>
                        <div className="input-group my-4">
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
                        <div className="input-group my-4">
                            <label htmlFor="" className='mb-1'>Enter Your Birthdate *</label>
                            <input type="date" className="form-control w-100" {...register('birthdate', { required: true })} />
                            {errors.birthdate ? <div className='error'>birthdate is required </div> : null}
                        </div>
                        <div className="input-group mb-3">
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
                        {/* <div className="input-group mb-3">
                            <label htmlFor="" className='mb-1'>Confirm Password *</label>
                            <input required="true"
                                type={showPassword ? "text" : "password"}
                                className="form-control w-100"
                                {...register('cpassword', { required: true })} />
                            {errors.password ? <div className='error'>Please Retype your password </div> : null}
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div> */}
                        <button className="btn rounded login_btn mt-3">
                            Register
                        </button>
                        <div className="mt-3">
                            <p className="m-0 fs-6">
                                Already have an Account?{" "}
                                <span className="register_btn" onClick={() => {
                                    move("/login")
                                }}>
                                    Login
                                </span>
                            </p>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    </>
}

export default Signup