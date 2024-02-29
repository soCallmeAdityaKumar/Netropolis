import axios from 'axios';
import React, { createContext, useContext, useReducer } from 'react';
const BASE_URL='http://localhost:5000/auth/'
const initialState = {
  statusCode:null,
  user: null,
  token: localStorage.getItem('Token'),
  message:null,
  loading: false,
  error: null,
  isLoggedin:false,
  isUser:null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SIGNUP_REQUEST':
      return { ...state,statusCode:null, loading: true, error: null,token:null,message:null,user:null,isLoggedin:false,isUser:null };
    case 'LOGIN_REQUEST':
      return { ...state,statusCode:null, loading: true, error: null,token:null,message:null,user:null ,isLoggedin:false,isUser:null};
    case 'AUTH_SUCCESS':
      return { ...state,statusCode:action.payload.statusCode, user:action.payload.user ,token: action.payload.token,message:action.payload.message,isLoggedin:action.payload.isLoggedin,isUser:action.payload.isUser,loading: false, error: null, };
    case 'AUTH_ERROR':
      return {...state, statusCode:action.payload.statusCode, loading: false,message:action.payload.message, error: action.payload.error,isLoggedin:action.payload.isLoggedin };
    default:
      return state;
  }
};

const AuthContext = createContext();

class SignupService {
  static async signup(name, email, password,endpoint,isuser) {
    try {
      const response = await axios.post(BASE_URL+endpoint, {
        name,
        email,
        password,
      });
      return response;
      // const {user,message} = response.data;
      // return { user,message};
    } catch (error) {
      throw new Error('Signup failed. Please try again.');
    }
  }
}

class LoginService {
  static async login(email, password,endpoint,isUser) {
    try {
      const response = await axios.post(BASE_URL+endpoint, {
        email,
        password,
      });

      return response;
    } catch (error) {

      throw new Error('Login failed. Please try again.');
    }
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const signup = async (name, email, password,endpoint,isuser) => {
    dispatch({ type: 'SIGNUP_REQUEST' });

    try {
      const resp=await SignupService.signup(name, email, password,endpoint,isuser);
      const {message}=resp.data
      if(resp.status===201){
        const {user}=resp.data
        localStorage.setItem('isLoggedin',false)
        localStorage.setItem('Token',null)
        dispatch({ type: 'AUTH_SUCCESS', payload: {statusCode:resp.status,user:user,token:null,message:message,isLoggedin:false,isUser:isuser} });
      }else{
        localStorage.setItem('isLoggedin',false)
        localStorage.setItem('Token',null)
        dispatch({ type: 'AUTH_ERROR', payload: {statusCode:resp.status,message:message,isLoggedin:false} });
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: {message:"Failed to Register!!.Try after Some time",isLoggedin:false} });
    }
  };

  const login = async (email, password,endpoint,isuser) => {
    dispatch({ type: 'LOGIN_REQUEST' });

    try {
      const resp  = await LoginService.login(email, password,endpoint,isuser);
      
      // const resp=await SignupService.signup(name, email, password,endpoint,isuser);
      const {message}=resp.data
      if(resp.status===201){
        const {user,token}=resp.data
        localStorage.setItem('isLoggedin',true)
        localStorage.setItem('isUser',isuser)
        localStorage.setItem('Token',token)
        dispatch({ type: 'AUTH_SUCCESS', payload:  {statusCode:resp.status,user,token,message,isLoggedin:true,isUser:isuser}});
      }else{
        localStorage.setItem('isLoggedin',false)
        localStorage.setItem('Token',null)
        dispatch({ type: 'AUTH_ERROR', payload: {statusCode:resp.status,message:message,isLoggedin:false} });
      }
    } catch (error) {
      localStorage.setItem('isLoggedin',false)
      localStorage.setItem('Token',null)
      dispatch({ type: 'AUTH_ERROR', payload: {message:"Failed to Login ",isLoggedin:false} });
    }
  };

  const logout = () => {
    //TODO
    dispatch({ type: 'LOGOUT' });
    localStorage.setItem('Token',null)
    localStorage.setItem('isLoggedin',false)
    localStorage.setItem('isUser',null)
  };

  return (
    <AuthContext.Provider
      value={{
        statusCode:state.statusCode,
        user: state.user,
        token: state.token,
        loading: state.loading,
        error: state.error,
        message:state.message,
        isLoggedin:state.isLoggedin,
        isUser:state.isUser,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};