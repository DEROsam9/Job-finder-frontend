<template>
    <div class="p-4">
        <div class="card p-4 shadow-md rounded-xl bg-white">
            <BreadCrumb :items="breadcrumbItems" />

            <h2 class="text-2xl font-bold mb-4">Applications</h2>

            <div v-if="loading">
                <p>Loading applications...</p>
            </div>

            <div v-else>
                <DataTable :value="applications" scrollable scrollHeight="400px" dataKey="id" class="text-sm">
                    <!-- Full Name -->
                    <Column header="Name" style="min-width: 12rem">
                        <template #body="{ data }"> {{ data.client.first_name }} {{ data.client.middle_name }} {{ data.client.surname }} </template>
                    </Column>

                    <!-- Email -->
                    <Column header="Email" style="min-width: 12rem">
                        <template #body="{ data }">{{ data.client.email }}</template>
                    </Column>

                    <!-- Phone -->
                    <Column header="Phone" style="min-width: 10rem">
                        <template #body="{ data }">{{ data.client.phone_number }}</template>
                    </Column>

                    <!-- Passport -->
                    <Column header="Passport" style="min-width: 10rem">
                        <template #body="{ data }">{{ data.client.passport_number }}</template>
                    </Column>

                    <!-- ID Number -->
                    <Column header="ID Number" style="min-width: 10rem">
                        <template #body="{ data }">{{ data.client.id_number }}</template>
                    </Column>

                    <!-- Created Date -->
                    <Column header="Created" style="min-width: 12rem">
                        <template #body="{ data }">{{ formatDate(data.created_at) }}</template>
                    </Column>

                    <!-- Status -->
                    <Column header="Status" style="min-width: 10rem">
                        <template #body="{ data }">
                            <Tag :value="data.status.name" :severity="getSeverity(data.status.name)" />
                        </template>
                    </Column>

                    <!-- Verified -->
                    <Column header="Verified" style="min-width: 8rem">
                        <template #body="{ data }">
                            <i
                                class="pi"
                                :class="{
                                    'pi-check-circle text-green-500': data.payments.length > 0,
                                    'pi-times-circle text-red-500': data.payments.length === 0
                                }"
                            />
                        </template>
                    </Column>

                    <!-- Actions -->
                    <Column header="Actions" style="min-width: 150px">
                        <template #body="{ data }">
                            <Button icon="pi pi-eye" class="mr-1" severity="info" rounded text @click="viewApplication(data)" />
                            <Button icon="pi pi-pencil" class="mr-1" severity="warning" rounded text @click="editApplication(data)" />
                            <Button icon="pi pi-trash" severity="danger" rounded text @click="confirmDelete(data)" />
                        </template>
                    </Column>
                </DataTable>
            </div>

            <ConfirmDialog />
        </div>
    </div>
</template>
<script setup>
import axiosClient from '@/axiosClient';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const confirm = useConfirm();

// Breadcrumb items
const breadcrumbItems = [
    { label: 'Clients', to: '/customers' },
    { label: 'Application', to: '/applications' }
];

// Dynamic breadcrumb class based on route
const breadcrumbClass = computed(() => {
    const path = route.name || '';
    switch (path) {
        case 'application.view':
            return 'bg-blue-100 border-l-4 border-blue-500';
        case 'application.edit':
            return 'bg-yellow-100 border-l-4 border-yellow-500';
        case 'application.create':
            return 'bg-green-100 border-l-4 border-green-500';
        default:
            return 'bg-gray-100 border-l-4 border-gray-400';
    }
});

// Application list and loading state
const applications = ref([]);
const loading = ref(true);

// Fetch applications from API
const fetchApplications = async () => {
    try {
        const response = await axiosClient.get('/v1/applications');
        applications.value = Array.isArray(response.data?.data?.data) ? response.data.data.data : [];
    } catch (error) {
        console.error('Failed to fetch applications:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load applications', life: 3000 });
        applications.value = [];
    } finally {
        loading.value = false;
    }
};
onMounted(fetchApplications);

// Date formatter
const formatDate = (value) => {
    const date = new Date(value);
    return isNaN(date)
        ? ''
        : date.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
          });
};

// Tag color based on status
const getSeverity = (status) => {
    switch ((status || '').toLowerCase()) {
        case 'active':
        case 'approved':
        case 'verified':
            return 'success';
        case 'pending':
            return 'warning';
        case 'rejected':
        case 'cancelled':
            return 'danger';
        default:
            return null;
    }
};

// Navigation actions
const viewApplication = (app) => {
    router.push({ name: 'application.view', params: { id: app.id } });
};

const editApplication = (app) => {
    router.push({ name: 'application.edit', params: { id: app.id } });
};

// Delete with confirmation
const confirmDelete = (app) => {
    confirm.require({
        message: `Are you sure you want to delete Application #${app.id}?`,
        header: 'Confirm Deletion',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Yes',
        rejectLabel: 'No',
        accept: () => deleteApplication(app.id)
    });
};

const deleteApplication = async (id) => {
    try {
        await axiosClient.delete(`/v1/applications/${id}`);
        applications.value = applications.value.filter((a) => a.id !== id);
        toast.add({ severity: 'success', summary: 'Deleted', detail: 'Application deleted successfully', life: 3000 });
    } catch (error) {
        console.error('Failed to delete application:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete application', life: 3000 });
    }
};
</script>
