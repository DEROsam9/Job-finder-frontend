import axios from 'axios';
import { useAuthStore } from '@/stores';

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_ROOT,
});

api.interceptors.request.use((config) => {
    const auth = useAuthStore(); // move it here

    config.headers.Accept = 'application/json';

    const token = auth.getAccessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;

    const organizationId = auth.getOrganization.id;
    if (organizationId) {
        config.headers['X-Tenant-Id'] = organizationId;
    }

    return config;
});

export { api };