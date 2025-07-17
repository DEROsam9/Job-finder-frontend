// src/axiosClient.js
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8000/api'
});

axiosClient.interceptors.request.use((config) => {
    const auth = useAuthStore();
    if (auth.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
});

export default axiosClient;
