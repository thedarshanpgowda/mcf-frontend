import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const storedLevel1 = JSON.parse(localStorage.getItem("level-1"));
  const storedLevel2 = JSON.parse(localStorage.getItem("level-2"));

  const [authUser, setAuthUser] = useState(storedLevel1 || storedLevel2 || null);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
