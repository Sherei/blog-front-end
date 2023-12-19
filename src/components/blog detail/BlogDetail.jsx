import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Loader from "../Loader/Loader";
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import { toast } from 'react-toastify';


const BlogDetail = () => {

  const allComments = useSelector((store) => store.Comment.comment);

  let { register, handleSubmit, reset, formState: { errors }, } = useForm();
  const { blogId } = useParams();
  const dispatch = useDispatch();

  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([])

  useEffect(() => {
    setLoading(true);
    try {
      axios
        .get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/singleBlog?id=${blogId}`)
        .then((res) => {
          setBlog(res.data);
        });
    } catch (e) {
      setLoading(true);
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  const Comment = async (cmnt) => {
    setLoading(true)
    try {

      const commentWithProductId = { ...cmnt, blogId };
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/comments`, commentWithProductId);
      if (response.data.message === "Feedback submitted") {
        dispatch({
          type: "ADD_COMMENT",
          payload: response.data.alldata,
        });
        setComments(response.data.alldata)
        toast.success("Feedback Submitted")
        reset();
        toggleVerify();
      } else {
        toast.error("Error occurred");
      }
    } catch (e) {
    } finally {
      setLoading(false)
    }
  };
  useEffect(() => {
    setLoading(true);
    try {
      axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/comments`).then((res) => {
        if (res) {
          dispatch({ type: "ADD_COMMENT", payload: res.data });
        }
      });
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (allComments) {
      setComments(allComments);
      setLoading(false);
    }
  }, [allComments]);

  const formatDateTime = (dateStr) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", options);
  };


  return <>
    <div className='container my-5'>
      <div className='row'>
        <div className='col'>
          <h2 className='m-0 fw-bolder'>{blog?.title}</h2>
          <p>Posted on:: {formatDateTime(blog?.date)}</p>
          <img src={blog?.image} alt="No Network" className='img-fluid mt-3 rounded-2' style={{ height: "400px" }} />
          <p className='my-3 '>{blog?.description}</p>
          <p>Author:: {blog?.author}</p>
          <p>Published on:: {formatDateTime(blog?.issueDate)}</p>
        </div>
      </div>

      <div className="row my-5">
        <div className="col-lg-6 col-md-6 col-sm-12 py-5" style={{ backgroundColor: "darkblue", height:"80vh", overflow:"auto" }}>
          <h1 className="text-center fs-1 fw-bolder" style={{ color: "white" }}>
            Blog Feedback
          </h1>
          {loading ? (
            <div
              className="col-lg-12 col-sm-12 d-flex align-items-center justify-content-center"
              style={{ height: "80vh" }}
            >
              <Loader />
            </div>
          ) : comments.filter((item) => item.blogId === blogId)
            .length === 0 ? (
            <div
              className="col-lg-12 col-sm-12 d-flex align-items-center justify-content-center"
              style={{ height: "50vh", color: "darkblue" }}
            >
              <h2 style={{ color: "white" }}>No Feedback available</h2>
            </div>
          ) : (
            <div className="mt-5">
              {comments.filter((item) => item.blogId === blogId).map((item, index) => {
                return <>
                  <div className='d-flex gap-4 px-5 border py-2 mb-3' key={index}>
                    <img src="/profile.png" alt="No Network" className='img-fluid rounded' style={{width:"70px"}} />
                    <div style={{color:"white"}}>
                      <p className='m-0'>{item?.name}</p>
                      <p className='m-0'>{item?.comment}</p> 
                      <p className='m-0'>{formatDateTime(item.date)}</p>
                    </div>
                  </div>
                </>
              })
              }
            </div>
          )}
        </div>

        <div className="col-lg-6 col-md-6 col-sm-12  px-lg-5 px-3 order-1 order-lg-2 order-md-2 order-xl-2" style={{ position: "relative" }}>
          <p
            className="fw-bolder fs-2 "
            style={{ color: "darkblue" }}
          >
            Blog Feedback
          </p>
          <form action="" onSubmit={handleSubmit(Comment)}>
            <div className="input-group my-4">
              <label htmlFor="" className='mb-1'>Enter Your Name *</label>
              <input type="text" className="form-control w-100" {...register('name', { required: true })} />
              {errors.name ? <div className='error'>Name is required </div> : null}
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
              <label htmlFor="" className='mb-1'>Enter Your Comment*</label>
              <textarea rows={5} type="text" className="form-control w-100" {...register('comment', { required: true })} />
              {errors.comment ? <div className='error'>Comment is required </div> : null}
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  </>
}

export default BlogDetail