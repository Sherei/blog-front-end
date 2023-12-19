import React, { useEffect } from 'react'
import Navbar from "./components/navbar/Navbar"
import Home from "./components/home/Home"
import AddBlog from "./components/Admin/AddBlog"
import BlogDetail from "./components/blog detail/BlogDetail"
import Login from './components/login/Login'
import Signup from './components/signup/Signup'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import Dashboard from './components/Admin/Dashboard'

function App() {

  const dispatch = useDispatch();

  useEffect(() => {

    try {
      axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/session-check`, { token: localStorage.getItem('userToken') }).then((res) => {
        if (res.data) {
          dispatch({
            type: 'LOGIN_USER',
            payload: res.data,
          });
        }
      });
    } catch (e) {

    }
  }, []);

  return <>
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/blog-detail/:blogId' element={<BlogDetail />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route exact path='/admin-dashboard-add-blog' element={<AddBlog />} />
          <Route exact path='/admin-dashboard-add-blog/:blogId' element={<AddBlog />} />
          <Route exact path='*' element={<Home />} />
        </Routes>
      </main>
    </BrowserRouter>
    <ToastContainer
      style={{
        minWidth: "250px",
      }}
      position="top-center"
      autoClose={1500}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
  </>
}

export default App
