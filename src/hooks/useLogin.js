import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();

  const login = async (email, password) => {
    setLoading(true);

    try {
      // Make the API request
      const response = await axios.post("http://localhost:4000/login", { email, password });

      // Assuming the response contains user data
      const user = response.data.data;
      console.log(user)

      // Store in localStorage
      localStorage.setItem(`level-${user.level}`, JSON.stringify(user));
      localStorage.setItem('user', JSON.stringify(user))

      // Set authenticated user
      setAuthUser(user);

      // Redirect based on user level
      navigate(user.level === 1 ? "/" : "/");

    } catch (error) {
      // Handle errors
      if (error.response) {
        // Server responded with a status other than 200 range
        alert(error.response.data.message || "Invalid credentials");
      } else if (error.request) {
        // Request was made but no response received
        alert("Network error. Please try again later.");
      } else {
        // Something happened in setting up the request
        alert("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

export default useLogin;
