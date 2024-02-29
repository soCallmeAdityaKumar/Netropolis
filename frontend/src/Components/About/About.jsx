import React, { useEffect } from "react";
import "./About.scss";
import img from "../../assets/pexels-stephan-seeber-1054218.jpg";
import video from "../../assets/187356 (540p).mp4";

import Aos from 'aos';
import 'aos/dist/aos.css';


const About = () => {

  useEffect(()=>{
    Aos.init({duration: 2000})
  },[])

  return (
    <section className="about section">
      <div className="secContainer">
        <div className="title">Why Hikings?</div>

        <div className="mainContent container grid">
          <div data-aos="fade-up" data-aos-duration="2000" className="singleItem">
            <img src={img} alt="" />
            <h3>100+ Mountains</h3>
            <p>
              Research shows that hiking can help improve blood pressure, boost
              bone density, and build strength.
            </p>
          </div>
          <div data-aos="fade-up" data-aos-duration="2500" className="singleItem">
            <img src={img} alt="" />
            <h3>1000+ Hikings</h3>
            <p>
              Research shows that hiking can help improve blood pressure, boost
              bone density, and build strength.
            </p>
          </div>
          <div data-aos="fade-up" data-aos-duration="3000" className="singleItem">
            <img src={img} alt="" />
            <h3>2000+ Customers</h3>
            <p>
              Research shows that hiking can help improve blood pressure, boost
              bone density, and build strength.
            </p>
          </div>
        </div>

        <div className="videoCard container">
          <div className="cardContent grid">
            <div data-aos="fade-right" data-aos-duration="2000" className="cardText">
              <h2>Wonderful House experience in there!</h2>
              <p>
                The Adeventure of a lifetime is waiting for you. Come and
                explore the beauty of the world with us.
              </p>
            </div>

            <div data-aos="fade-left" data-aos-duration="2000" className="cardVideo">
              <video src={video} autoPlay loop muted type="video/mp4"></video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
