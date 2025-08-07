import {api} from '@/api/index'

 export const addUser = async (postBody)=>{
    return await api
    .post('/users',postBody)
    .then((response)=>response)
    .catch((e)=>e.response)
 };
 export const fetchUsers = async ()=>{
    return await api
    .get('/users')
    .then((response)=>response)
    .catch((e)=>e.response)

 };

 //


export const getUser = async (id) => {
    try {
        const response = await api.get(`users/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching client ${id}:`, error);
        throw error;
    }
};

export const updateClient = async (id, data) => {
    try {
        const response = await api.put(`users/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating user ${id}:`, error);
        throw error;
    }
};

export const removeUser= async (id) => {
    try {
        const response = await api.delete(`users/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting user ${id}:`, error);
        throw error;
    }
};
