import axios, {type AxiosResponse} from "axios";
import {TEXT} from "@/config/zh-cn.ts";
import {transformKeysToCamelCase} from "@/utils/transform.ts";

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
        const normalized = transformKeysToCamelCase(res.data);

        if (normalized.code === 0) {
            return normalized;
        } else {
            return Promise.reject(new Error(normalized.message || 'Error'));
        }
    },
    (error) => {
        const errorMessage = error.response?.data?.message || error.message || '未知错误，无返回信息';
        return Promise.reject(new Error(errorMessage));
    }
);

export default service;
