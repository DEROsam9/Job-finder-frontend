import { generateUrl, api } from '@/api/index';

export const fetchPayments = async (params) => {
    const url = generateUrl('payments?', params);

    return await api
        .get(url)
        .then((response) => response.data)
        .catch((e) => e.response.data);
};
