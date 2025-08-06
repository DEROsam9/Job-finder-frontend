import { api } from '@/api/index';

export const addSettings = async (postBody) => {
    return await api
        .post('/setting', postBody)
        .then((response) => response)
        .catch((e) => e.response);
};

export const getSettings = async () => {
    return await api
        .get(`setting`)
        .then((response) => response)
        .catch((e) => e.response);
};
   

