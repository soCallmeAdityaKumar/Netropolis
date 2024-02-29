import React from "react";
import RoutesPage from "./Routes";
import "./App.css";
import { AuthProvider } from "./Components/authentication/service/AuthService";
import { ToastContainer } from 'react-toastify';


const App = () => {
  return (
    <>
      <AuthProvider>
      <RoutesPage />
      <ToastContainer/>
      </AuthProvider>
    </>
  );
};

export default App;
