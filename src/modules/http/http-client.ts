import axios from "axios";

let token: string | null = null;

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
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

httpClient.interceptors.response.use(
    (res) => res,
    (error) => {
        console.error("HTTP ERROR:", error?.response?.data || error.message);
        return Promise.reject(error);
    }
);

function setAuthToken(newToken: string | null) {
    token = newToken;
}

export { httpClient, setAuthToken };