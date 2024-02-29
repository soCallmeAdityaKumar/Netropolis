import React, { useState,useEffect } from "react";
import COVER_IMAGE from "../../assets/6345765_24850.jpg";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { useAuth } from "../authentication/service/AuthService";
import axios from "axios";


const UserProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [rewardsEarned, setRewardsEarned] = useState(100);
  const [ongoingQuests, setOngoingQuests] = useState([
    { id: 1, title: "Explore Central Park", category: "Exploration" },
    { id: 2, title: "Cooking Class: Local Cuisine", category: "Culinary" },
    { id: 3, title: "Street Art Tour", category: "Art & Creativity" },
  ]);
  const [questPreferences, setQuestPreferences] = useState([]);
  //Todo Error when empty

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const addItem = (e) => {
    e.preventDefault();
    setQuestPreferences([...questPreferences, e.target.value]);
  };

  const removeItem = (item) => {
    const filtered = questPreferences.filter((e) => e !== item);
    setQuestPreferences(filtered);
  };


  let updated=false

  const {token,message}=useAuth()

  const handleSubmit = (event) => {
    event.preventDefault();
  };
  const reqBody={
    "name":name,
    "location":location,
    "bio":bio,
    "rewards":rewardsEarned,
    "quest_preferences":questPreferences
  }
  useEffect(()=>{
  },[token])
  const [updating,setUpdating]=useState(false)
  const handleUpdate= async()=>{
    setUpdating(true)
  try{
      const {message,user}= await axios.put('http://localhost:5000/auth/user/change_profile',reqBody,{
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
        })
        updated=true
        alert("Profile Updated")

    }
    catch{
     console.log("Cannot Change Profile")
    }
    setUpdating(false)

}
  const getProfile= async()=>{
    try{
      const response= await axios.get('http://localhost:5000/auth/user/profile',{
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
        })
        const obj=response.data[0]
        if(obj.name)setName(obj.name)
        if(obj.location)setLocation(obj.location)
        if(obj.email)setEmail(obj.email)
        if(obj.bio)setBio(obj.bio)
        if(obj.rewards)setRewardsEarned(obj.rewards)
        if(obj.quest_preferences)setQuestPreferences(obj.quest_preferences)

    }
    catch{
     console.log("Cannot get Profile")
    }
  }
  useEffect(()=>{
    getProfile()
  },[updated])

  return (
    <div className="w-full h-full grid items-start p-10 bg-[#28282B]">
      <div className="w-full h-full bg-[#D8DCDB] flex rounded-[25px]">
        <div className="w-4/5 h-full p-20 bg-[#D8DCDB] rounded-[25px]">
          <h1 className="text-3xl text-[#060606] font-bold mb-5">
            <a href="/">User Profile</a>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xl font-semibold text-gray-800 mt-14"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-black my-2 bg-transparent border-b border-black outline-none focus:outline-none text-[17px]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xl font-semibold text-gray-800 mt-8"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-black my-2 bg-transparent border-b border-black outline-none focus:outline-none text-[17px]"
                required
                disabled
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
                htmlFor="bio"
                className="block text-xl font-semibold text-gray-800 mt-8"
              >
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full text-black my-2 bg-transparent border-b border-black outline-none focus:outline-none text-[17px]"
                rows="4"
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="block text-xl font-semibold text-gray-800 mt-5">
                  Rewards Earned
                </span>
                <span className="text-gray-800 text-xl mt-2">
                  {rewardsEarned} points
                </span>
              </div>
            </div>
            <div>
              <h3 className="block text-xl font-semibold text-gray-800 mb-2 mt-8">
                Ongoing Quests
              </h3>
              <ul className="divide-y divide-gray-500">
                {ongoingQuests.map((quest) => (
                  <li key={quest.id} className="py-2">
                    <span className="font-semibold">{quest.title}</span> -{" "}
                    {quest.category}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="block text-xl font-semibold text-gray-800 mb-2 mt-5">
                Quest Preferences
              </h3>
              <ul className="divide-y divide-gray-500">
                {questPreferences.map((preference, index) => (
                  <li key={index} className="py-2 flex">
                    {preference}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100%"
                      height="100%"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-x cursor-pointer hover:scale-110 hover:bg-red-500 rounded-full w-4 h-4 ml-2"
                      onClick={() => removeItem(preference)}
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </li>
                ))}
              </ul>
              <div className="relative inline-block text-left">
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="bg-[#060606] text-sm rounded-lg text-white p-2 hover:scale-105 hover:opacity-80 duration-300"
                  id="options-menu"
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  <div className="flex">
                    Add Quest
                    <IoIosArrowDropdownCircle className="ml-2 text-lg" />
                  </div>
                </button>
                {isOpen && (
                  <div
                    className="origin-top-right absolute left-5 border-b border-black mt-2 w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <div
                      className="py-1 ml-2 pr-2 cursor-pointer text-[17px] divide-y divide-gray-400"
                      onClick={addItem}
                    >
                      <option value="Exploration">Exploration</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Culinary">Culinary</option>
                      <option value="Art & Creativity">Art & Creativity</option>
                      <option value="Wellness">Wellness</option>
                      <option value="Nightlife & Entertainment">
                        Nightlife & Entertainment
                      </option>
                      <option value="Sports & Recreation">
                        Sports & Recreation
                      </option>
                      <option value="Local Events">Local Events</option>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="mt-14 w-full bg-[#060606] rounded-full text-white border-2 border-black font-semibold p-4 my-2 hover:scale-105 hover:opacity-80 duration-300"
                onClick={handleUpdate}
              >
                {updating?("Updating..."):("Update Profile")}
              </button>
            </div>
          </form>
        </div>

        <div className="w-1/5 h-full mt-28 mr-14">
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

export default UserProfile;
