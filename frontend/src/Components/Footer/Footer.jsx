import React, { useEffect } from "react";
import "./Footer.scss";
import { SiYourtraveldottv } from "react-icons/si";
import { ImFacebook } from "react-icons/im";
import { AiFillInstagram } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";

import Aos from 'aos';
import 'aos/dist/aos.css';

const Footer = () => {

    useEffect(()=>{
        Aos.init({duration: 2000})
      },[])

  return (
    <div className="footer" id="footer" >
      <div className="secContainer container grid">
        <div data-aos="fade-up" data-aos-duration="2000" className="logoDiv">

          <div data-aos="fade-up" data-aos-duration="2000" className="footerLogo">
            <a href="/" className="logo flex">
              <h1 className="flex text-2xl font-bold">
                <SiYourtraveldottv className="icon" />
                Netropolis
              </h1>
            </a>
          </div>

          <div data-aos="fade-up" data-aos-duration="3000" className="socials flex">
            <ImFacebook className="icon" />
            <AiFillInstagram className="icon" />
            <FaXTwitter  className="icon" />
          </div>
        </div>

        <div data-aos="fade-up" data-aos-duration="3000" className="footerLinks">
          <span className="linkTitle">Information</span>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="#">Explore</a>
          </li>
          <li>
            <a href="#">Travel</a>
          </li>
        </div>
        <div data-aos="fade-up" data-aos-duration="4000" className="footerLinks">
          <span className="linkTitle">Helpful Links</span>
          <li>
            <a href="#">Destination</a>
          </li>
          <li>
            <a href="#">Support</a>
          </li>
          <li>
            <a href="#">Terms & Conditions</a>
          </li>
          <li>
            <a href="#">Privacy</a>
          </li>
        </div>
        <div data-aos="fade-up" data-aos-duration="5000" className="footerLinks">
          <span className="linkTitle">Contact Us</span>
          <span className="phone">+444 555 7778</span>
          <span className="email">netropolis@gmail.com</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
