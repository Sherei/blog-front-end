import React, { useState, useEffect } from 'react'
import Loader from "../Loader/Loader";
import axios from 'axios';
import "./home.css"
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const [blog, setBlog] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState([])
  const move = useNavigate()

  useEffect(() => {

    setLoading(true);
    try {
      axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/blog`).then((res) => {
        setBlog(res?.data);
      }).finally(() => {
        setLoading(false);
      });
    } catch (e) {

    }
  }, []);

  useEffect(() => {
    setLoading(true)
    try {
      let arr = blog?.filter((data) => {
        const Lsearch = (searchValue ?? "").toLowerCase();
        const Ltitle = (data?.title ?? "").toLowerCase();
        const LDescription = (data?.description ?? "").toLowerCase();

        const LsearchMatch = Ltitle.includes(Lsearch) || LDescription.includes(Lsearch);
        return (
          LsearchMatch
        );
      });

      setFilter(arr);
    } catch (e) {
    } finally {
      setLoading(false)
    }

  }, [blog, searchValue]);

  return <>
    <div className='container-fluid my-5'>
      <div className='my-5 d-flex flex-column align-items-center'>
        <p className='fs-2 fw-bolder'>Our Blogs</p>
        <input type="search" className='form-control' placeholder='Search Any Blog'
          style={{ width: "250px" }}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      {loading ? (
        <div
          className="col-lg-12 col-sm-12 d-flex align-items-center justify-content-center"
          style={{ height: "50vh" }}
        >
          <Loader />
        </div>
      ) : filter.length === 0 ? (
        <div className="col-12" style={{ height: "300px" }}>
          <p className='text-center'>No Blog Found try with different keyword...</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 row-cols-sm-2 px-5 g-4">
          {filter?.map((data, index) => {
            return <div className='col' key={index}>
              <div class="card">
                <img src={`${data.image}`} className="card-img-top" alt="No Network" />
                <div className="card-body">
                  <h5 className="card-title">{data?.title.slice(0, 20)}...</h5>
                  <p className="card-text">{data?.description?.slice(0, 50)}...</p>
                  <button class="btn btn-primary" onClick={() => move("/blog-detail/" + data._id)}>Read More</button>
                </div>
              </div>
            </div>
          })
          }
        </div>
      )}
    </div>
  </>
}

export default Home