// axiosConfig.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", 
});

instance.interceptors.request.use(
  (config) => {
    // Do something before sending the request (e.g., attach headers)
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);



export default instance;
