import React, { useEffect, useState } from "react";
import "./Offer.scss";
import PuffLoader from "react-spinners/PuffLoader";
import {
  MdAirportShuttle,
  MdBathtub,
  MdKingBed,
  MdLocationOn,
} from "react-icons/md";
import { FaWifi } from "react-icons/fa";
import { BsArrowRightShort } from "react-icons/bs";

import img from "../../assets/anime-style-house-architecture.jpg";

import Aos from "aos";
import "aos/dist/aos.css";
import axios from "axios";

const Offers = [
  {
    id: 1,
    imgSrc: img,
    destTitle: "Machu Pichu",
    location: "Peru",
    price: "$7,452",
  },
  {
    id: 2,
    imgSrc: img,
    destTitle: "Guanajuato",
    location: "Mexico",
    price: "$2,452",
  },
  {
    id: 3,
    imgSrc: img,
    destTitle: "Angkor Wat",
    location: "Cambodia",
    price: "$4,400",
  },
];

const Offer = ({questData,change,isChange}) => {
  const [loadingPage, setLoadingPage] = useState(true);

  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  // const [params,setParams]=useState({job_id:1})
  useEffect(()=>{
    setOffers(questData)
    isChange(false)
  },[change])
  let off=[]

  const category=[]
  useEffect(()=>{
    Aos.init({duration: 2000})
    const getOffers=async()=>{
      try{
        const response=await axios.get('http://localhost:5000/jobs/all')
        if(response){
          off=response.data.jobs
          if(off)setOffers(off)
        }else{
          console.log("Error in getting offers...")
        }
      }catch{
        console.log("Cannot get Offers")
      }
      finally{
        setLoadingPage(false)
      }
    }
    getOffers()
  },[loadingPage])

  useEffect(() => {
    setTimeout(() => {
      // setLoadingPage(false);
    }, 1500);
  }, []);

  return (
    <section className="offer container section" id="explore">
      <div className="secContainer">
        <div data-aos="fade-up" data-aos-duration="2000" className="secIntro">
          <h2 className="secTitle text-2xl font-semibold">Quests Packages</h2>
          <p>
            From historical cities to natural specteculars, come see the best of
            the world!
          </p>
        </div>

        {loadingPage ? (
          <div className="flex items-center justify-center mt-28">
            <PuffLoader color="black" loading={loadingPage} size={100} />
          </div>
        ) : (
          <div className="mainContent grid">
            {offers.length>0?(offers.map(({job_id,title,location,category,rewards})  => {
              return (
                <div
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  className="singleOffer"
                >
                  <div className="destImage">
                    <img src={img} alt={job_id} />
                    <span className="discount">30% off</span>
                  </div>
                  <div className="offerBody">
                    <div className="price flex">
                      <h4>{title}</h4>
                      <span className="status">{rewards}</span>
                    </div>
                    <div className="amenities flex">
                      {category.map((i)=> {return (
                      <div className="singleAmenity flex">
                        <MdKingBed className="icon" />
                        <small>{i}</small>
                      </div>)})}
                    </div>

                    <div className="location flex">
                      <MdLocationOn className="icon" />
                      <small>{location}</small>
                    </div>

                    <button className="btn flex">
                      <a href={`/details/${job_id}`}>View Details</a>
                      <BsArrowRightShort className="icon" />
                    </button>
                  </div>
                </div>
              );
            })):(<div className="flex items-center justify-center mt-28"><h2 className="secTitle text-2xl font-semibold">Coming soon...</h2></div>)}
          </div>
        )}
      </div>
    </section>
  );
};

export default Offer;
