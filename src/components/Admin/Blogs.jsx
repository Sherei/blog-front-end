import React, { useEffect, useState, useRef } from 'react';
import Loader from '../Loader/Loader';
import { AiFillDelete } from 'react-icons/ai';
import { FaPencilAlt } from 'react-icons/fa'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Blogs = () => {

  const [blog, setblog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  let move = useNavigate()

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/blog`)
      .then((res) => {
        setblog(res?.data);
        setIsLoading(false);
      })
      .catch((error) => {
        return <>
          <div className='col-lg-12 col-sm-12 d-flex align-items-center justify-content-center' style={{ height: "50vh" }} >
            <Loader />
          </div>
        </>
      });
  }, []);

  const handleSearchInputChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredBlog = blog.length > 0 && blog?.filter((data) => {
    const lowerCaseSearch = search.toLowerCase();
    return (
      data?.title?.toLowerCase().includes(lowerCaseSearch) ||
      data?.author?.toLowerCase().includes(lowerCaseSearch) ||
      data?.description?.toLowerCase().includes(lowerCaseSearch)
    );
  });

  const Deleteblog = (dataId) => {
    axios.delete(`${import.meta.env.VITE_REACT_APP_BASE_URL}/deleteBlog?id=${dataId}`).then(() => {
      setblog(blog.filter((item) => dataId !== item._id));
      toast.success("blog Removed")
    });
  };
  const formatDateTime = (dateStr) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', options);
  };

  return <>
    <div className="container-fluid">
      <div className="row my-3">
        <div className="col-lg-12 col-sm-12 d-flex justify-content-between">
          <h1 className="fw-bolder" style={{ color: "darkblue" }}>
            Blog List
          </h1>
          <div>
            <input
              type="search"
              className="w-100 form-control mb-2 mr-sm-2"
              placeholder="Search Anything"
              value={search}
              onChange={handleSearchInputChange}
            />
          </div>
        </div>
      </div>
      {isLoading ? (
        <div
          className="col-lg-12 col-sm-12 d-flex align-items-center justify-content-center"
          style={{ height: "50vh" }}
        >
          <Loader />
        </div>
      ) : filteredBlog.length === 0 ? (
        <div className="col-12" style={{ height: "300px" }}>
          <p className='text-center'>No Blog Found try with different keyword...</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 row-cols-sm-2 px-0 g-4">
          {filteredBlog?.map((data, index) => {
            return <div className='col' key={index}>
              <div class="card">
                <img src={`${data?.image}`} className="card-img-top" alt="No Network" />
                <div className="card-body">
                  <h5 className="card-title">{data?.title.slice(0,20)}...</h5>
                  <p className="card-text">{data?.description?.slice(0,50)}...</p>
                  <button class="btn btn-primary" onClick={() => move("/blog-detail/" + data._id)}>Read More</button>
                  <div className='d-flex justify-content-between mt-1'>
                    <button className="btn btn-outline-primary" onClick={() => Deleteblog(data?._id)} style={{color:"red", backgroundColor:"white"}}><AiFillDelete /></button>
                    <button className="btn btn-outline-primary" onClick={() => move(`/admin-dashboard-add-blog/${data?._id}`)} style={{color:"darkblue", backgroundColor:"white"}}><FaPencilAlt /></button>
                  </div>
                </div>
              </div>
            </div>
          })
          }
        </div>
      )}
      {/* <div className='row row-cols-1 row-cols-md-3 row-cols-lg-4 row-cols-sm-2 px-lg-0 px-md-0 px-1 g-4'>
        {isLoading ? (
          <div className='col-lg-12 col-sm-12 d-flex align-items-center justify-content-center' style={{ height: "50vh" }} >
            <Loader />
          </div>
        ) : filteredBlog.length === 0 ? (
          <div className="col-12" style={{ height: "300px" }}>
            <p className='text-center'>No Blog Found...</p>
          </div>
        ) : (
          <div className="">
            {filteredBlog?.map((data, index) => {
              return <div className='col' key={index}>
                <div class="card">
                  <img src={`${data.image}`} className="card-img-top" alt="No Network" />
                  <div className="card-body">
                    <h5 className="card-title">{data.title}</h5>
                    <p className="card-text">{data.description}</p>
                    <button class="btn btn-primary" onClick={() => move("/blog-detail/" + data._id)}>Read More</button>
                    
                  </div>
                </div>
              </div>
            })
            }
          </div>
        )}
      </div> */}
    </div>
  </>
}

export default Blogs