import { api, generateUrl } from "@/api"

export const fetchStatuses = async (filter) => {
    const url = generateUrl('statuses?', filter)

    return await api
        .get(url)
        .then(response => response)
        .catch(e => e.response)
}
