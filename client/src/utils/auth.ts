import axios from "axios";
import { jwtDecode } from "jwt-decode";


export interface DecodedUser {
  id: string;
  email: string;
  username: string;
  exp?: number;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface SigninData {
  email: string;
  password: string;
}


const API_URL = "http://localhost:3000/api/auth"; 


export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};


export const getUser = (): DecodedUser | null => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded: DecodedUser = jwtDecode(token);
    return decoded;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return exp ? Date.now() < exp * 1000 : true;
  } catch {
    return false;
  }
};


export const signup = async (data: SignupData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, data);
    const { token } = response.data;
    setToken(token);
    return { success: true, data: response.data };
  } catch (err: any) {
    if (err.response?.data?.errors) {
      return { success: false, errors: err.response.data.errors };
    }
    return { success: false, message: err.response?.data?.message || "Signup failed" };
  }
};

export const signin = async (data: SigninData) => {
  try {
    const response = await axios.post(`${API_URL}/signin`, data);
    const { token } = response.data;
    setToken(token);
    return { success: true, data: response.data };
  } catch (err: any) {
    if (err.response?.data?.errors) {
      return { success: false, errors: err.response.data.errors };
    }
    return { success: false, message: err.response?.data?.message || "Signin failed" };
  }
};


export const logout = () => {
  removeToken();
  window.location.href = "/signin"; 
};
