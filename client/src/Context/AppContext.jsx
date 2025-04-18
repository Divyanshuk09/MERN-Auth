import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;

  const backendUrl =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://mern-auth-hjeb.onrender.com";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/user-details`);
      if (data.success) {
        setUserData(data.userData);
        toast.success(`Welcome back ${data.userData.name}`,{autoClose:1500})
      } else {
        toast.error(data.message || "Failed to fetch user data", {
          autoClose: 1500,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong.", {
        autoClose: 1500,
      });
    }
  };

  const getAuthState = async () => {
  try {
    const { data } = await axios.get(`${backendUrl}/api/auth/isAuthenticated`);
    if (data.success) {
      setIsLoggedIn(true);
      getUserData();
      toast.success(data.message);
    }
  } catch (error) {
      toast.error("Login to continue",{autoClose:1500})
     toast.error(error.message,{autoClose:1500})
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return <AppContent.Provider value={value}>{props.children}</AppContent.Provider>;
};
