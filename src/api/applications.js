import { api, generateUrl } from "@/api"

export const fetchApplications = async (filter) => {
    const url = generateUrl('applications?', filter)

    return await api
        .get(url)
        .then(response => response)
        .catch(e => e.response)
}

export const addApplication = async (postBody) => {
    return await api
        .post('applications', postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const updateApplication = async (id, postBody) => {
    return await api
        .patch(`applications/${id}`, postBody)
        .then(response => response)
        .catch(e => e.response)
}
export const getApplication = async (id) => {
    return await api
        .get(`applications/${id}`)
        .then(response => response)
        .catch(e => e.response)
}
export const removeApplication = async (id) => {
    return await api
        .delete(`applications/${id}`)
        .then(response => response)
        .catch(e => e.response)
}

export const downloadApplications = () => {
    return api
        .get('download-applications', {
            responseType: 'blob',
        })
        .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'product_upload_template.xlsx');
            document.body.appendChild(link);
            link.click();
        })
        .catch((e) => {
            console.error('Error downloading template:', e);
        });
};
