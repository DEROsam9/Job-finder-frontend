import { api } from '@/api';

export const downloadApplicationsExcel = async (body) => {
    return await api
        .post('download-applications-excel', body, {
            responseType: 'blob'
        })
        .then((response) => response.data)
        .catch((e) => e.response.data);
};

export const downloadPaymentsExcel = async (body) => {
    return await api
        .post('download-payments-excel', body, {
            responseType: 'blob'
        })
        .then((response) => response.data)
        .catch((e) => e.response.data);
};
