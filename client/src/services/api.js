import axios from 'axios';
import { API_URL } from '../constants';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const res = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
                const newAccessToken = res.data.data.accessToken;
                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                // To keep token globally accessible across components without prop drilling, we can use an event emitter or rely on context wrapper
                window.dispatchEvent(new CustomEvent('tokenRefreshed', { detail: newAccessToken }));
                return api(originalRequest);
            } catch (err) {
                window.dispatchEvent(new Event('logoutTriggered'));
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default api;