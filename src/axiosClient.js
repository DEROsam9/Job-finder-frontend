import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8000/api'
});

// Attach token from localStorage
const token = localStorage.getItem('token');
if (token) {
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Optional: Refresh token logic or response interceptors can go here

export default axiosClient;
