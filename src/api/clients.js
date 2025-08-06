import { api, generateUrl } from '@/api';

export const fetchClients = async (filter) => {
    const url = generateUrl('clients?', filter);

    return await api
        .get(url)
        .then((response) => response)
        .catch((e) => e.response);
};

export const getClient = async (id) => {
    try {
        const response = await api.get(`clients/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching client ${id}:`, error);
        throw error;
    }
};

export const updateClient = async (id, data) => {
    try {
        const response = await api.put(`clients/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating client ${id}:`, error);
        throw error;
    }
};

export const removeClient = async (id) => {
    try {
        const response = await api.delete(`clients/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting client ${id}:`, error);
        throw error;
    }
};
