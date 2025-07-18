<template>
    <div class="p-4">
        <!-- Breadcrumb -->
        <BreadCrumb :items="breadcrumbItems" />

        <h2 class="text-xl font-semibold mt-4 mb-2">Edit Application #{{ form.id }}</h2>

        <div v-if="loading">Loading...</div>

        <div v-else class="p-fluid p-formgrid p-grid bg-white rounded-md shadow-md p-4">
            <!-- Application Code -->
            <div class="p-field p-col-12 md:p-col-6">
                <label class="block text-sm font-medium text-gray-700 mb-1">Application Code</label>
                <InputText v-model="form.application_code" class="w-full" />
            </div>

            <!-- Client -->
            <div class="p-field p-col-12 md:p-col-6">
                <label class="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <Dropdown v-model="form.client_id" :options="clients" optionLabel="name" optionValue="id" placeholder="Select Client" class="w-full" />
            </div>

            <!-- Career -->
            <div class="p-field p-col-12 md:p-col-6">
                <label class="block text-sm font-medium text-gray-700 mb-1">Career</label>
                <Dropdown v-model="form.career_id" :options="careers" optionLabel="name" optionValue="id" placeholder="Select Career" class="w-full" />
            </div>

            <!-- Status -->
            <div class="p-field p-col-12 md:p-col-6">
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Dropdown v-model="form.status_id" :options="statuses" optionLabel="name" optionValue="id" placeholder="Select Status" class="w-full" />
            </div>

            <!-- Remarks -->
            <div class="p-field p-col-12">
                <label class="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <Textarea v-model="form.remarks" rows="4" class="w-full" />
            </div>

            <!-- Action Buttons -->
            <div class="p-field p-col-12 mt-4">
                <Button label="Save Changes" icon="pi pi-check" class="mr-2" @click="submit" />
                <Button label="Cancel" icon="pi pi-times" severity="secondary" @click="goBack" />
            </div>
        </div>
    </div>
</template>

<script setup>
import axiosClient from '@/axiosClient';
import BreadCrumb from '@/components/BreadCrumbs/BreadCrumb.vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// PrimeVue
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

const route = useRoute();
const router = useRouter();

const form = ref({
    id: null,
    application_code: '',
    client_id: null,
    career_id: null,
    status_id: null,
    remarks: ''
});

const loading = ref(true);

const clients = ref([]);
const careers = ref([]);
const statuses = ref([]);

// Breadcrumb data
const breadcrumbItems = [
    { label: 'Applications', to: '/applications' },
    { label: `Edit #${route.params.id}`, to: route.fullPath }
];

const fetchApplication = async () => {
    try {
        const res = await axiosClient.get(`/v1/applications/${route.params.id}`);
        const data = res.data?.data;
        form.value = {
            id: data.id,
            application_code: data.application_code,
            client_id: data.client_id,
            career_id: data.career_id,
            status_id: data.status_id,
            remarks: data.remarks
        };
    } catch (err) {
        console.error('Failed to load application:', err);
    } finally {
        loading.value = false;
    }
};

const fetchDropdownData = async () => {
    try {
        const [clientsRes, careersRes, statusesRes] = await Promise.all([axiosClient.get('/v1/clients'), axiosClient.get('/clients'), axiosClient.get('/v1/statuses')]);

        clients.value = clientsRes.data?.data || [];
        careers.value = careersRes.data?.data || [];
        statuses.value = statusesRes.data?.data || [];
    } catch (err) {
        console.error('Failed to load dropdown data:', err);
    }
};

const submit = async () => {
    try {
        await axiosClient.put(`/v1/applications/${form.value.id}`, form.value);
        router.push({ name: 'applications' });
    } catch (err) {
        console.error('Failed to update application:', err);
    }
};

const goBack = () => {
    router.push({ name: 'applications' });
};

onMounted(() => {
    fetchApplication();
    fetchDropdownData();
});
</script>
