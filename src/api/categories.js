import { api, generateUrl } from '@/api';

export const fetchApplications = async (filter) => {
    const url = generateUrl('job-categories', filter);

    return await api
        .get(url)
        .then((response) => response)
        .catch((e) => e.response);
};

export const addApplication = async (postBody) => {
    return await api
        .post('job-categories', postBody)
        .then((response) => response)
        .catch((e) => e.response);
};

export const updateApplication = async (id, postBody) => {
    return await api
        .patch(`job-categories/${id}`, postBody)
        .then((response) => response)
        .catch((e) => e.response);
};
export const getApplication = async (id) => {
    return await api
        .get(`job-categories/${id}`)
        .then((response) => response)
        .catch((e) => e.response);
};

export const removeApplication = async (id) => {
    return await api
        .delete(`job-categories/${id}`)
        .then((response) => response)
        .catch((e) => e.response);
};
