import axiosClient from 'axios';

export async function getClients() {
    const response = await axiosClient.get('/v1/clients');
    return response.data.data;
}

export async function createClient(data) {
    return await axiosClient.post('/v1/clients', data);
}

export async function updateClient(id, data) {
    return await axiosClient.put(`/v1/clients/${id}`, data);
}

export async function deleteClientById(id) {
    return await axiosClient.delete(`/v1/clients/${id}`);
}
