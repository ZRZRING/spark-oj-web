import axios, {type AxiosResponse} from "axios";
import {TEXT} from "@/config/zh-cn.ts";

const env = import.meta.env;

const service = axios.create({
    baseURL: env.VITE_APP_BASE_API,
    timeout: 3000,
});

service.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        const errorMessage = error.response?.data?.message || error.message || '未知错误，无返回信息';
        return Promise.reject(new Error(errorMessage));
    }
);

service.interceptors.response.use(
    (res) => {
        if (res.data.code === 0) {
            return res.data;
        } else {
            return Promise.reject(new Error(res.data.message || 'Error'));
        }
    },
    (error) => {
        const errorMessage = error.response?.data?.message || error.message || '未知错误，无返回信息';
        return Promise.reject(new Error(errorMessage));
    }
);

export default service;
