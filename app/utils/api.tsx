
import axios from "axios";

export const API_BASE_URL = "http://localhost:5121/api";
// await axios.get("http://localhost:5121/api");

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  // Disable certificate checks (not recommended for production)

});

export default axiosInstance;