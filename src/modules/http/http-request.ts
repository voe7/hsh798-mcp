import { httpClient, setAuthToken } from "./http-client";

async function get<T = any>(
    url: string,
    params?: Record<string, any>
): Promise<T> {
    const res = await httpClient.get<T>(url, { params });
    return res.data;
}

async function post<T = any>(
    url: string,
    data?: Record<string, any>
): Promise<T> {
    const res = await httpClient.post<T>(url, data);
    return res.data;
}

export { setAuthToken, get, post };