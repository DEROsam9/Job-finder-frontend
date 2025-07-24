<template>
    <div class="p-4 bg-white shadow rounded-md" v-if="application">
        <Toast />

        <BreadCrumb :items="breadcrumbItems" />
        <h2 class="text-xl font-bold mb-4">Edit Application #{{ application.id }}</h2>

        <form @submit.prevent="updateApplication" class="space-y-4">
            <!-- Application Code -->
            <div>
                <label class="block font-semibold mb-1">Application Code</label>
                <InputText v-model="form.application_code" class="w-full" />
            </div>

            <!-- Remarks -->
            <div>
                <label class="block font-semibold mb-1">Remarks</label>
                <Textarea v-model="form.remarks" rows="4" class="w-full" />
            </div>

            <!-- Status Dropdown -->
            <div>
                <label class="block font-semibold mb-1">Status</label>
                <Dropdown v-model="form.status_id" :options="statuses" optionLabel="name" optionValue="id" placeholder="Select a status" class="w-full" />
            </div>

            <!-- Client & Career Info (Readonly) -->
            <div class="bg-gray-50 p-3 rounded border text-sm space-y-1">
                <p><strong>Client:</strong> {{ application.client?.first_name }} {{ application.client?.surname }}</p>
                <p><strong>Email:</strong> {{ application.client?.email }}</p>
                <p><strong>Phone:</strong> {{ application.client?.phone_number }}</p>
                <p><strong>Career:</strong> {{ application.career?.name }}</p>
                <p><strong>Description:</strong> {{ application.career?.description }}</p>
            </div>

            <!-- Submit -->
            <Button label="Save Changes" type="submit" icon="pi pi-check" class="w-full" />
        </form>
    </div>

    <div v-else class="p-4">Loading...</div>
</template>

<script setup>
import BreadCrumb from '@/components/BreadCrumbs/BreadCrumb.vue';
import axiosClient from 'axios'; // Adjust based on your actual axios path
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// PrimeVue Components
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const route = useRoute();
const router = useRouter();

const application = ref(null);
const statuses = ref([]);
const form = ref({
    application_code: '',
    status_id: null,
    remarks: ''
});

const fetchData = async () => {
    try {
        const appId = route.params.id;
        const [appRes, statusRes] = await Promise.all([axiosClient.get(`/v1/applications/${appId}`), axiosClient.get('/v1/statuses')]);

        application.value = appRes.data.data;
        statuses.value = statusRes.data;

        // Pre-fill form values
        form.value.application_code = application.value.application_code;
        form.value.status_id = application.value.status_id;
        form.value.remarks = application.value.remarks || '';
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const updateApplication = async () => {
    try {
        const appId = application.value.id;

        await axiosClient.put(`/v1/applications/${appId}`, {
            application_code: form.value.application_code,
            status_id: form.value.status_id,
            remarks: form.value.remarks
        });

        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Application updated successfully.',
            life: 3000
        });

        router.push('/applications');
    } catch (err) {
        console.error(err);

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update application.',
            life: 3000
        });
    }
};

// Breadcrumb
const breadcrumbItems = [
    { label: 'Clients', to: '/customers' },
    { label: 'Application', to: '/applications' },
    { label: 'Edit', to: `/applications/${route.params.id}/edit` }
];

onMounted(fetchData);
</script>

<style scoped>
label {
    font-weight: 500;
}
</style>
