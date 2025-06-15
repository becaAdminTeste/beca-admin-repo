import React, { createContext, useState, useContext, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [dashboardUser, setDashboardUser] = useState(null);
  const [dashboardUserType, setDashboardUserType] = useState(null);
  const [sharedData, setSharedData] = useState(null);
  const userImage = "/images/avatar/Jordhan.jpg";
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <AppContext.Provider value={{ sharedData, setSharedData, dashboardUser, setDashboardUser, dashboardUserType, setDashboardUserType, userImage, setToken, token }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};