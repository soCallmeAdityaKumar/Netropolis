import React from "react";
import Login from "./Components/authentication/Login";
import SignUp from "./Components/authentication/SignUp";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Components/Pages/HomePage";
import QuestsForm from "./Components/QuestForm/QuestsForm";
import UserProfile from "./Components/Pages/UserProfile";
import DetailsPage from "./Components/Pages/DetailsPage";
import AdminLogin from "./Components/authentication/AdminLogin";
import AdminSignup from "./Components/authentication/AdminSignup";

const RoutesPage = () => {
  return (
    <Routes>
      <Route path="/login" Component={Login} />
      <Route path="/signup" Component={SignUp} />
      <Route path="/" Component={HomePage} />
      <Route path="/form" Component={QuestsForm} />
      <Route path="/userprofile" Component={UserProfile} />
      <Route path="/details/:job_id" Component={DetailsPage} />
      <Route path="/adminlogin" Component={AdminLogin} />
      <Route path="/adminsignup" Component={AdminSignup} />
    </Routes>
  );
};

export default RoutesPage;
