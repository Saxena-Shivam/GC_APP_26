import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import axios from "axios";
import { backend_link } from "../utils/constants";

const LoginContext = createContext({
  isLogin: false,
  setIsLogin: () => {},
  isAdmin: false,
  setIsAdmin: () => {},
  user: null,
  setUser: () => {},
  logout: () => {},
  details: null,
});

const LoginProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      if (user?.email) {
        try {
          const email = user.email;
          const resp = await axios.get(
            backend_link + "api/user/getDetails?email=" + email
          );
          console.log(resp.data?.userDetails);
          setDetail(resp.data?.userDetails);
          console.log("Qwerty");
        } catch (err) {
          console.log(null);
        }
      }
    };
    fetch();
  }, [user]);

  const logout = async () => {
    await AsyncStorage.removeItem("userInfo");
    user?.email && (await signOut(auth));
    setDetail(null);
    setIsLogin(false);
    setIsAdmin(false);
    setUser(null);
    console.log("Logged out");
  };
  const context = {
    isLogin,
    setIsLogin,
    isAdmin,
    setIsAdmin,
    user,
    setUser,
    logout,
    detail,
  };
  return (
    <LoginContext.Provider value={context}>{children}</LoginContext.Provider>
  );
};

export { LoginProvider, LoginContext };
