import axios from "axios";

const env = import.meta.env;

const request = axios.create({
  baseURL: env.VITE_APP_BASE_API,
  timeout: 3000,
});

request.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

request.interceptors.response.use(
  (res) => res.data,
  (error) => Promise.reject(error)
);

export default request;
