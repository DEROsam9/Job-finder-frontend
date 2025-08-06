import {api} from '@/api/index'

 export const addUser = async (postBody)=>{
    return await api
    .post('/users',postBody)
    .then((response)=>response)
    .catch((e)=>e.response)
 };
 export const fetchUsers = async ()=>{
    return await api
    .get('/users')
    .then((response)=>response)
    .catch((e)=>e.response)

 };