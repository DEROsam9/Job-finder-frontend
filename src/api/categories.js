import { api, generateUrl } from '@/api';

export const fetchJobCategories = async (filter) => {
    const url = generateUrl('job-categories?', filter);

    return await api
        .get(url)
        .then((response) => response)
        .catch((e) => e.response);
};

export const addJobCategories = async (postBody) => {
    return await api
        .post('job-categories', postBody)
        .then((response) => response)
        .catch((e) => e.response);
};

export const updateJobCategories = async (id, postBody) => {
    return await api
        .patch(`job-categories/${id}`, postBody)
        .then((response) => response)
        .catch((e) => e.response);
};
export const getJobCategories = async (id) => {
    return await api
        .get(`job-categories/${id}`)
        .then((response) => response)
        .catch((e) => e.response);
};

export const removeJobCategories = async (id) => {
    return await api
        .delete(`job-categories/${id}`)
        .then((response) => response)
        .catch((e) => e.response);
};
