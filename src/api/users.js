import {api} from '@/api/index'
 export const fetchUsers = async ()=>{
    return await api
    .get('/users')
    .then((response)=>response)
    .catch((e)=>e.response)

 };

export const addUser = async postBody => {
    return await api
        .post('/users',postBody)
        .then((response)=>response)
        .catch((e)=>e.response)
};

export const getUser = async id => {
    return await api
        .get(`users/${id}`)
        .then(response => response)
        .catch(e => e.response)
}

export const updateUser = async (id, postBody) => {
    return await api
        .post(`users/${id}`, postBody)
        .then(response => response)
        .catch(e => e.response)
}
export const removeUser = async id => {
    return await api
        .delete(`users/${id}`)
        .then(response => response.data)
        .catch(e => e.response.data)
}
