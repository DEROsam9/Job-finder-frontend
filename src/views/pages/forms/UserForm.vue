<script setup>
import axiosClient from '@/axiosClient';
import BreadCrumb from '@/components/BreadCrumbs/BreadCrumb.vue';
import { useToast } from 'primevue/usetoast';
import { onMounted, reactive,ref } from 'vue';
import {addUser} from '@/api/users'


import { FormField } from '@primevue/forms';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';


const breadcrumbItems = ref([
    { label: 'User', url: '/users' },
    { label: 'create user', url: `/users/create` }
]);

const form = reactive({
    name:'',
    email:'',
    phone_number:'',
    password:''
     })

const submitForm = () =>{
    console.log("hello ")
    const formData=new FormData();
    formData.append('name',form.name);
    formData.append('email',form.email);
    formData.append('phone_number',form.phone_number);
    formData.append('password',form.password);
    addUser(formData)
}

</script>
<template>
        <BreadCrumb :items="breadcrumbItems" />
    <div class="card">
        <form  @submit.prevent="submitForm" class="flex flex-col gap-4">
            <div class="flex flex-col md:flex-row gap-4">
                <div class="w-full flex flex-col">
                    <div>
                        <label class="block mb-2">Name <span class="text-red-500">*</span></label>
                        <FormField class="mb-4" name="name">
                            <InputText v-model="form.name"  class="w-full p-2 border border-gray-300 rounded-md" placeholder="John Doe" required type="text" />
                        </FormField>
                    </div>
                    <div>
                        <label class="block mb-2">Email <span class="text-red-500">*</span></label>
                        <FormField class="mb-4" name="email">
                            <InputText v-model="form.email" class="w-full p-2 border border-gray-300 rounded-md" placeholder=" johnDoe@gmail.com" required type="text" />
                        </FormField>
                    </div>
                    <div>
                        <label class="block mb-2">Phone_number <span class="text-red-500">*</span></label>
                        <FormField class="mb-4" name="phone_number">
                            <InputText v-model="form.phone_number" class="w-full p-2 border border-gray-300 rounded-md" placeholder="0712345678" required type="text" />
                        </FormField>
                    </div>
                    <div>
                        <label class="block mb-2">Password <span class="text-red-500">*</span></label>
                        <FormField class="mb-4" name="password">
                            <InputText  v-model="form.password"  class="w-full p-2 border border-gray-300 rounded-md"  required type="text" />
                        </FormField>
                    </div>
                    
                </div>
            </div>
            <!-- Buttons -->
            <div class="flex justify-end">
                <Button type="button" class="p-button" severity="contrast">
                    <RouterLink to="/users" >Cancel</RouterLink>
                </Button>
                <Button type="submit" label="Submit" class="p-button-success ms-2"  />
            </div>
        </form>
    </div>
</template>