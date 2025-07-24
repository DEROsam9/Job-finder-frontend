// src/services/payment.js
import axios from '@/axiosClient'; // ✅ assuming it's saved as src/axiosClient.js
// or simply 'axios' if you didn't customize it

export default {
    getAll(limit = 20) {
        return axios.get(`/v1/payments?limit=${limit}`);
    },
    get(id) {
        return axios.get(`/v1/payments/${id}`);
    },
    create(data) {
        return axios.post('/v1/payments', data);
    },
    update(id, data) {
        return axios.put(`/v1/payments/${id}`, data);
    },
    delete(id) {
        return axios.delete(`/v1/payments/${id}`);
    }
};
