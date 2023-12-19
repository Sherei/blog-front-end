import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Loader from "../Loader/Loader"
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const AddBlog = () => {

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  const cu = useSelector(store => store.userSection.cu);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(new FormData());

  let move = useNavigate();

  const { blogId } = useParams();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: blog?.title || '',
      issueDate: blog?.issueDate || '',
      description: blog?.description || '',
      image: blog?.image || '',
      author: blog?.author || 'Ming Mingle',
    },
  });

  useEffect(() => {
    try {
      if (blogId) {
        axios.get(`${process.env.REACT_APP_BASE_URL}/blog_edit?id=${blogId}`).then(function (resp) {
          setBlog(resp.data);
        });
      }
    } catch (e) {

    }
  }, []);
  useEffect(() => {
    if (blogId) {
      reset(blog);
    }
  }, [blog]);

  async function submitBlog(data) {
    window.scrollTo({
      top: 0,
    });
  
    let cloudinaryUrl = "";
  
    // Check if a new image is selected
    if (data.image && data.image[0]) {
      const formData = new FormData();
      formData.append('file', data.image[0]);
      formData.append('upload_preset', 'zonfnjjo');
      try {
        const response = await axios.post("https://api.cloudinary.com/v1_1/dlw9hxjr4/image/upload", formData);
        cloudinaryUrl = response.data.url;
      } catch (error) {
      }
    } else {
      cloudinaryUrl = blog ? blog.image : '';
    }
  
    setLoading(true);
  
    if (blogId) {
      data.image = cloudinaryUrl;
      try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/blog_update`, data);
        setLoading(false);
        toast.success("Blog updated");
        move('/admin-dashboard');
      } catch (error) {
        console.error("Error updating blog:", error);
        setLoading(false);
      }
    } else {
      data.image = cloudinaryUrl;
      try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/blog`, data);
        if (response.data) {
          toast.success("Blog Uploaded");
          reset();
        }
      } catch (error) {
        console.error("Error creating blog:", error);
      } finally {
        setLoading(false);
      }
    }
  }
  



  return <>
    <div className='container my-4'>
      <p className='text-center fw-bolder fs-3 mt-5 mb-3' style={{ color: "darkblue" }}>Welcome to Admin Panel</p>
      <div className='row border py-5 px-4'>
        <div className='col-lg-12 col-sm-12'>
          <div className='d-flex justify-content-between'>
            {!blog &&
              <h1 className='p_head' style={{ color: "darkblue", fontWeight: "700" }}> Add Blog </h1>
            }
            {blog &&
              <h1 className='p_head' style={{ color: "darkblue", fontWeight: "700" }}> Edit Blog </h1>
            }
            <p className='fw-bolder' style={{ color: "darkblue" }} onClick={() => move("/admin-dashboard")}>Admin Panel</p>
          </div>
          {loading ? (
            <div className='col-lg-12 col-sm-12 d-flex align-items-center justify-content-center' style={{ height: "50vh" }} >
              <Loader />
            </div>
          ) : (
            <form>
              <div className='row'>
                <div className='col-lg-6  col-md-6 col-sm-12  my-2'>
                  <label style={{ fontSize: "17px", fontWeight: "600" }}>Add Title *</label>
                  <input type="text" {...register('title', { required: true })} className="form-control mb-2 mr-sm-2" />
                  {errors.title && errors.title.type == "required" ? <div className='error'> Title is required </div> : null}
                </div>
                <div className='col-lg-6  col-md-6 col-sm-12  my-2'>
                  <label style={{ fontSize: "17px", fontWeight: "600" }}>Author Name *</label>
                  <input type="text" {...register('author', { required: true })} value="Ming Mingle" className="form-control mb-2 mr-sm-2" />
                  {errors.author && errors.author.type == "required" ? <div className='error'>Author Name is required</div> : null}
                </div>
                <div className='col-lg-6  col-md-6 col-sm-12  my-2'>
                  <label style={{ fontSize: "17px", fontWeight: "600" }}>Issue Date *</label>
                  <input
                    type="date"
                    defaultValue={blog ? blog.issueDate : ''}
                    {...register('issueDate', { required: blogId ? false : true })}
                    className="form-control mb-2 mr-sm-2"
                  />
                  {errors.issueDate && errors.issueDate.type == "required" ? <div className='error'>Issue Date is required</div> : null}
                </div>
                <div className='col-lg-6  col-md-6 col-sm-12  my-2'>
                  <label style={{ fontSize: "17px", fontWeight: "600" }}>Image *</label>
                  <input type="file"
                    defaultValue={blog ? blog.image : ""}
                    {...register('image',
                      {
                        required: blogId ? false : true,
                        minLength: 1,
                      })}
                    className="form-control mb-2 mr-sm-2" />
                  {errors.image && errors.image.type == "required" ? <div className='error'>Image is required</div> : null}
                  {errors.image && errors.image.type === 'minLength' && <div className='error'>At least one image is required</div>}

                </div>
                <div className='col-lg-12  col-md-12 col-sm-12  my-2'>
                  <label style={{ fontSize: "17px", fontWeight: "600" }}>Description *</label>
                  <textarea type="text" rows={7} {...register('description', { required: true })} className="form-control mb-2 mr-sm-2" />
                  {errors.description && errors.description.type == "required" ? <div className='error'>Discription is required</div> : null}
                </div>
              </div>
              <div className='row'>
                {!blog &&
                  <div className='col-lg-12 col-sm-12 my-5'>
                    <button type="button" className="btn btn-primary" style={{ width: "200px" }} onClick={handleSubmit(submitBlog)}>
                      Submit
                    </button>
                  </div>
                }
                {blog &&
                  <div className='col-lg-12 col-sm-12 my-5'>
                    <button type="button" className="btn btn-primary" style={{ width: "200px" }} onClick={handleSubmit(submitBlog)}>
                      Update
                    </button>
                  </div>
                }
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  </>
}

export default AddBlog