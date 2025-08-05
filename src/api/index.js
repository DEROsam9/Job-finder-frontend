import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_ROOT
});

api.interceptors.request.use((config) => {

    config.headers.Accept = 'application/json';

    const token = localStorage.getItem('token');

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
});

export { api };

export const generateUrl = (root, params) => {
    let url = root;
    url += Object.keys(params)
        .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
        .join('&');
    url = url.replace(root + '?&', url + '?');

    return url;
};
