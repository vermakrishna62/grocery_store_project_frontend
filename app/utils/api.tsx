
import axios from "axios";
import https from "https";

export const API_BASE_URL = "http://localhost:7113/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  // Disable certificate checks (not recommended for production)
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

export default axiosInstance;