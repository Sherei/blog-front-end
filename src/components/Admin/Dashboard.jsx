import React, { useState, useEffect } from 'react'
import Blogs from './Blogs';
import Users from "./Users"
import Comments from "./Comments"
import { useSelector } from 'react-redux';
import axios from 'axios';
import "./dashboard.css"
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {

  useEffect(() => {
    window.scrollTo({
      top: 0
    });
  }, []);

  let cu = useSelector(store => store.userSection.cu)
  const [users, setUsers] = useState([])
  const [blogs, setBlogs] = useState([])
  const [comment, setComments] = useState([])
  const [component, setComponent] = useState("blog")
  const move = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3020/dashboard`).then((res) => {
      setUsers(res.data.Users)
      setBlogs(res.data.Blogs)
      setComments(res.data.comments)
    })
  }, [])

  let data = [
    { title: "Blogs", desc: blogs.length, path: "blog" },
    { title: "Total Users", desc: users.length, path: "user" },
    { title: "Comments", desc: comment.length, path: "comment" },
  ];

  if (cu.email != "admin@gmail.com") {
    return move('/')
  } else if (cu._id === undefined) {
    return move('/')
  }

  return <>
    <div className='container '>
      <p className='text-center fw-bolder fs-3 mt-5 mb-3' style={{ color: "darkblue" }}>Welcome to Admin Panel</p>
      <div className='row  row-cols-1 row-cols-md-3 row-cols-lg-4 row-cols-sm-2 px-5 g-4'>
        {data.map((item, index) => {
          return <div className={`col border dashboard_box ${item.path === component ? 'activeComponent' : ''}`}
            key={index}
            onClick={() => setComponent(item.path)}
          >
            <p className='m-0'>{item.title}</p>
            <p className='m-0'>{item?.desc}</p>
          </div>
        })
        }
        <div className="col border dashboard_box" onClick={() => move('/admin-dashboard-add-blog')}>
            <p className='m-0'>Add Blog</p>
          </div>
      </div>
      <div className='row'>
        <div className='col'>

          {component === "blog" &&
            <Blogs />
          }
          {component === "user" &&
            <Users />

          }
          {component === "comment" &&
            <Comments />
          }
        </div>
      </div>
    </div>
  </>
}

export default Dashboard