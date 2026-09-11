import axios from "axios";

import { tokenRead } from "../login/JWToken.js";

const httpClient = axios.create({
    baseURL: "https://i.ilife798.com",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Connection: "keep-alive",
        "User-Agent": "iOS_ilife798_3.1.1",
        "Accept-Language": "zh-Hans;q=1, en-CN;q=0.9",
    },
});

httpClient.interceptors.request.use((config) => {
    const loginData = tokenRead();
    if (!loginData || !loginData.data?.al?.token) {
        return Promise.reject(new Error("未登录或 Token 无效，请先执行登录操作"));
    }
    config.headers.Authorization = loginData.data.al.token;
    return config;
});

httpClient.interceptors.response.use(
    (res) => res,
    (error) => {
        console.error("HTTP ERROR:", error?.response?.data || error.message);
        return Promise.reject(error);
    }
);

export { httpClient };