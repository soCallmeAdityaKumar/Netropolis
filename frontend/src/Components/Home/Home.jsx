import React, {useEffect,useState} from "react";
import "./Home.scss";

import Aos from 'aos';
import 'aos/dist/aos.css';
import axios from "axios";

const Home = ({handleDataFromHome}) => {

  const [location,setLocation]=useState('')
  const [category ,setCategory]=useState('')
  const [company ,setCompany]=useState('')
  const handleData=(data)=>{
    handleDataFromHome(data.jobs)
  }

  const handleSearch=async()=>{
    if(location!==''&&category!==''&&company!==''){
      const response=await axios.get(`http://localhost:5000/jobs/filter?location=${location}&category=${category}&name=${company}`)
      handleData(response.data)
    }else if(company==''&&location==''){
      const response=await axios.get(`http://localhost:5000/jobs/category?category=${category}}`)
      handleData(response.data)
    }else if(company==''&&category==''){
      const response=await axios.get(`http://localhost:5000/jobs/location?location=${location}`)
      handleData(response.data)
    }else if(location==''&&category==''){
      const response=await axios.get(`http://localhost:5000/jobs/company_name?name=${company}`)
      handleData(response.data)
    }else if(location==''){
      const response=await axios.get(`http://localhost:5000/jobs/filterIC?catergory=${category}&name=${company}`)
      handleData(response.data)
    }else if(category==''){
      const response=await axios.get(`http://localhost:5000/jobs/filetrLI?name=${company}&location=${location}`)
      handleData(response.data)
    }else if(company==''){
      const response=await axios.get(`http://localhost:5000/jobs/filterLC?category=${category}&location=${location}`)
      handleData(response.data)
    }else{
      // Show a toast to enter some details
    }
  }
  useEffect(()=>{
    Aos.init({duration: 2000})
  },[])

  return (
    <section className="home">
      <div className="secContainer container">
        <div className="homeText">
          <h1 data-aos="fade-up" className="title">Plan your trip with Netropolis</h1>
          <p data-aos="fade-up" data-aos-duration="2500" className="subTitle">Travel to your favourite place</p>
          <button data-aos="fade-up" data-aos-duration="3000" className="btn">
            <a href="#explore">Explore Now</a>
          </button>
        </div>

        <div className="homeCard grid">
          <div data-aos="fade-right" data-aos-duration="2000" className="locationDiv">
            <label htmlFor="location">Location</label>
            <input type="text" placeholder="Dream Destination" value={location} onChange={(e)=>setLocation(e.target.value)}/>
          </div>

          <div data-aos="fade-right" data-aos-duration="2500" className="distDiv">
            <label htmlFor="distance">Company</label>
            <input type="text" placeholder="Tokyo travels"value={company} onChange={(e)=>setCompany(e.target.value)} />
          </div>

          <div data-aos="fade-right" data-aos-duration="3000" className="priceDiv">
            <label htmlFor="price">Category</label>
            <input type="text" placeholder="Adventure" value={category} onChange={(e)=>setCategory(e.target.value)}/>
          </div>

          <button data-aos="fade-left" data-aos-duration="2000" className="btn" onClick={handleSearch}>Search</button>

        </div>
        
      </div>
    </section>
  );
};

export default Home;
