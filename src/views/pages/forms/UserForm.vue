<script setup>
import BreadCrumb from '@/components/BreadCrumbs/BreadCrumb.vue';
import { useToast } from 'primevue/usetoast';
import { onMounted, reactive,ref } from 'vue';
import { addUser, getUser, updateUser } from '@/api/users'
import { useRoute, useRouter } from 'vue-router'
import { FormField } from '@primevue/forms';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

const route = useRoute();
const router = useRouter();
const isLoading = ref(false)
const loading = ref(false)
const toast = useToast();

const form = reactive({
    id:'',
    name:'',
    email:'',
    phone_number:'',
    password:''
})

onMounted(async () => {

    console.log(route.params)

    form.id = route.params.userId

    if (form.id) {
        await fetchUser()
    }
})

const fetchUser = async () => {
    loading.value = true
    try {
        getUser(form.id).then(response => {
            if (response?.status == 200) {
                form.name = response?.data?.data.name
                form.email = response?.data.data?.email
                form.phone_number = response?.data.data?.phone_number
            } else { console.log(response) }
        })
    }
    catch (error) {
        console.log(error)
    }
    finally {
        loading.value = false
    }
}


const breadcrumbItems = ref([
    {
        label: 'User',
        url: `/users`
    },
    {
        label: 'user form',
        url: ''
    }
]);

const submitForm = async () => {

    isLoading.value = true

    if (form.id) {
        const formData = new FormData()

        formData.append("_method", "PUT")
        formData.append('name',form.name);
        formData.append('email',form.email);
        formData.append('phone_number',form.phone_number);
        formData.append('password',form.password);

        updateUser(form.id, formData)
            .then(async data => {
                if (data.status == 201) {

                    toast.add({
                        severity: 'success',
                        summary: 'Success Message',
                        detail:  data.data.message,
                        life: 3000
                    });
                    await router.push('/users');
                } else {
                    toast.add({
                        severity: 'danger',
                        summary: 'Success Message',
                        detail:  data.message,
                        life: 3000
                    });
                }
            })
            .catch(err => {
                isLoading.value = false
                ElNotification({
                    title: "Error",
                    message: err.message,
                    type: "error",
                })
            })
            .finally(() => {
                isLoading.value = false
            })
    } else {
        const formData = new FormData()

        formData.append('name',form.name);
        formData.append('email',form.email);
        formData.append('phone_number',form.phone_number);
        formData.append('password',form.password);

        addUser(formData)
            .then(async data => {
                if (data.status == 201) {
                    toast.add({
                        severity: 'success',
                        summary: 'Success Message',
                        detail:  data.data.message,
                        life: 3000
                    });
                    await router.push('/users');

                } else {
                    toast.add({
                        severity: 'danger',
                        summary: 'Success Message',
                        detail:  data.message,
                        life: 3000
                    });
                }
            })
            .catch(err => {
                isLoading.value = false

                toast.add({
                    severity: 'danger',
                    summary: 'Success Message',
                    detail:  err.message,
                    life: 3000
                });
            })
            .finally(() => {
                isLoading.value = false
            })
    }
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
                            <InputText v-model="form.email" class="w-full p-2 border border-gray-300 rounded-md" placeholder=" johnDoe@gmail.com" required type="email" />
                        </FormField>
                    </div>
                    <div>
                        <label class="block mb-2">Phone Number <span class="text-red-500">*</span></label>
                        <FormField class="mb-4" name="phone_number">
                            <InputText v-model="form.phone_number" class="w-full p-2 border border-gray-300 rounded-md" placeholder="0712345678" required type="tel" />
                        </FormField>
                    </div>
                    <div v-if="!form.id">
                        <label class="block mb-2">Password <span class="text-red-500">*</span></label>
                        <FormField class="mb-4" name="password">
                            <InputText  v-model="form.password"  class="w-full p-2 border border-gray-300 rounded-md"  required type="password" />
                        </FormField>
                    </div>
                </div>
            </div>
            <div class="flex justify-end">
                <Button type="button" class="p-button" severity="contrast">
                    <RouterLink to="/users" >Back</RouterLink>
                </Button>
                <Button type="submit" label="Submit" class="p-button-success ms-2"  />
            </div>
        </form>
    </div>
</template>
