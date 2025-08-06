import { api, generateUrl } from '@/api/index';

export const fetchPayments = async (params) => {
    const url = generateUrl('payments?', params);

    return await api
        .get(url)
        .then((response) => response.data)
        .catch((e) => e.response.data);
};

export const addPayment = async (postBody) => {
    return await api
        .post('payments?', postBody)
        .then((response) => response)
        .catch((e) => e.response);
};

export const updatePayments = async (id, postBody) => {
    return await api
        .patch(`payments/${id}`, postBody)
        .then((response) => response)
        .catch((e) => e.response);
};
export const getPayments = async (id) => {
    return await api
        .get(`payments/${id}`)
        .then((response) => response)
        .catch((e) => e.response);
};

export const removePayments = async (id) => {
    return await api
        .delete(`payments/${id}`)
        .then((response) => response)
        .catch((e) => e.response);
};
