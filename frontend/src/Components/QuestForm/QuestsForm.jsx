import React, { useEffect, useState } from "react";
import COVER_IMAGE from "../../assets/6345765_24850.jpg";
import { toast } from 'react-toastify';
import Select from "react-select";
import PuffLoader from "react-spinners/PuffLoader";
import { useAuth } from "../authentication/service/AuthService";
import axios from "axios";


const QuestsForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState([]);
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState(1);
  const [difficulty, setDifficulty] = useState("");
  const [rewards, setRewards] = useState(1000);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const isLoggedin = localStorage.getItem('isLoggedin')
  const token = localStorage.getItem('Token')
  const params = {
    "title": title,
    "description": description,
    "category": category,
    "additional_information": additionalInfo,
    "location": location,
    "difficulty": difficulty,
    "duration": duration,
    "rewards": rewards
  }
  const handleCategory = (e) => {
    const a = []
    e.forEach((ev) => a.push(ev.value))
    setCategory(a)

  }


  const [submitting, setSubmitting] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title !== "" && description !== "" && category.length !== 0 && location !== "" && difficulty !== "" && additionalInfo !== "") {
      setSubmitting(true)
      try {
        const response = await axios.post('http://localhost:5000/jobs/createjob', params, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        if(response.status===201){
          alert("Quest Submitted!!")
        }else{
          alert(response.data.message)
        }
      } catch {
        alert('Failed to Submit Form ')
      }
      setSubmitting(false)
    }else{
      alert("Please Fill all details")
    }

  };
  // const json={
  //   "name":title,
  //   "description":description,
  //   "category":category,
  //   "additional_information":additionalInfo,
  //   "location":location,
  //   "difficulty":difficulty,
  //   "duration":duration,
  //   "wage":rewards
  //  }
  // }



  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const options = [
    { value: "Exploration", label: "Exploration" },
    { value: "Adventure", label: "Adventure" },
    { value: "Art & Creativity", label: "Art & Creativity" },
    { value: "Wellness", label: "Wellness" },
    { value: "Nightlife & Entertainment", label: "Nightlife & Entertainment" },
    { value: "Sports & Recreation", label: "Sports & Recreation" },
    { value: "Local Events", label: "Local Events" },
  ];

  return (
    <div className="w-full h-full grid items-start p-10 bg-[#28282B]">
      <div className="w-full h-full bg-[#D8DCDB] flex rounded-[25px]">
        <div className="w-3/5 h-full p-20 bg-[#D8DCDB] rounded-[25px]">
          <h1 className="text-3xl text-[#060606] font-bold mb-5">
            <a href="/">Create a New Quest</a>
          </h1>

          <form className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-xl font-semibold text-gray-800 mt-14"
              >
                Quest Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-black my-2 bg-transparent border-b border-black outline-none focus:outline-none text-[17px]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-xl font-semibold text-gray-800 mt-8"
              >
                Description
              </label>
              <textarea
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-black my-2 bg-transparent border-b border-black outline-none focus:outline-none text-[17px]"
                required
                rows="2"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-xl font-semibold text-gray-800 mt-8"
              >
                Category
              </label>
              <Select
                id="category"
                required
                isMulti
                onChange={(e) => handleCategory(e)}
                className="basic-multi-select my-2 cursor-pointer text-[17px]"
                options={options}
              />
            </div>

            <div>
              <label
                htmlFor="additionalInfo"
                className="block text-xl font-semibold text-gray-800 mt-8"
              >
                Additional Information
              </label>
              <textarea
                type="text"
                id="additionalInfo"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="w-full text-black my-2 bg-transparent border-b border-black outline-none focus:outline-none text-[17px]"
                required
                rows="2"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-xl font-semibold text-gray-800 mt-8"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-black my-2 bg-transparent border-b border-black outline-none focus:outline-none text-[17px]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="difficulty"
                className="block text-xl font-semibold text-gray-800 mt-8"
              >
                Difficulty Level
              </label>
              <select
                id="difficulty"
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full text-black my-2 bg-transparent border-b border-black outline-none focus:outline-none text-[17px]"
                required
              >
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="duration"
                className="block text-xl font-semibold text-gray-800 mt-8"
              >
                Duration (hours)
              </label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full text-black my-2 bg-transparent border-b border-black outline-none focus:outline-none text-[17px]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="rewards"
                className="block text-xl font-semibold text-gray-800 mt-8"
              >
                Rewards
              </label>
              <input
                id="rewards"
                value={rewards}
                onChange={(e) => setRewards(Number(e.target.value))}
                className="w-full text-black my-2 bg-transparent border-b border-black outline-none focus:outline-none text-[17px]"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="mt-14 w-full bg-[#060606] rounded-full text-white border-2 border-black font-semibold p-4 my-2 hover:scale-105 hover:opacity-80 duration-300"
                onClick={(e) => handleSubmit(e)}
              >{submitting ? ("Submitting...") : ("Create Quest")}
              </button>
            </div>
          </form>
        </div>

        <div className="w-2/5 h-full mt-28 mr-14">
          <h1 className="text-4xl text-[#060606] font-bold mb-28 mt-28 items-center flex justify-center">
            Netropolis
          </h1>
          <img
            src={COVER_IMAGE}
            className=" object-cover rounded-[25px] p-4 bg-black"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestsForm;
