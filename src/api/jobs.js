import { generateUrl, api } from '@/api/index';

export const fetchAllJobs = async (params) => {
    const url = generateUrl('careers?', params);

    return await api
        .get(url)
        .then((response) => response.data)
        .catch((e) => e.response.data);
};

export const addJob = async (postBody) => {
    return await api
        .post('careers', postBody)
        .then((response) => response)
        .catch((e) => e.response);
};

export const updateJob = async (id, postBody) => {
    return await api
        .patch(`careers/${id}`, postBody)
        .then((response) => response)
        .catch((e) => e.response);
};

export const getJob = async (id) => {
    return await api
        .get(`careers/${id}`)
        .then((response) => response)
        .catch((e) => e.response);
};

export const removeJob = async (id) => {
    return await api
        .delete(`careers/${id}`)
        .then((response) => response.data)
        .catch((e) => e.response.data);
};
