<template>
    <div class="p-4">
        <div class="card p-4 shadow-md rounded-xl bg-white">
            <BreadCrumb :items="breadcrumbItems" />

            <h2 class="text-2xl font-bold mb-4">Applications</h2>

            <FilterAccordion v-model="filters" :showNameEmail="true" :showPassportId="true" :showDate="true" :showStatus="true" :statusOptions="statusOptions" />

            <div v-if="loading">
                <p>Loading applications...</p>
            </div>

            <div v-else>
                <DataTable :value="applications?.data || []" scrollable scrollHeight="400px" dataKey="id" class="text-sm">
                    <ProgressSpinner v-if="loading" style="width: 50px; height: 50px" strokeWidth="8" class="mx-auto mb-4" />

                    <div v-if="!loading && applications.length === 0" class="text-gray-500 italic mt-4">No applications found matching your filters.</div>

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

                    <!-- Actions -->
                    <Column header="Actions" style="min-width: 100px">
                        <template #body="{ data }">
                            <Menu :model="getMenuItems(data)" popup :ref="(el) => el && menuRefs.set(data.id, el)" />
                            <Button icon="pi pi-ellipsis-v" text @click="(event) => toggleMenu(event, data.id)" />
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
import FilterAccordion from '@/components/Accordion/FilterParameters.vue';
import BreadCrumb from '@/components/BreadCrumbs/BreadCrumb.vue';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import Menu from 'primevue/menu';
import Tag from 'primevue/tag';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const filters = ref({
    nameEmail: '',
    passportId: '',
    dateRange: null,
    status: ''
});

watch(
    () => filters.value.dateRange,
    () => {
        applyFilters();
    },
    { deep: true }
);

const applyFilters = () => {
    fetchApplications();
};

// Refs and state
const menuRefs = new Map();
const applications = ref([]);
const loading = ref(true);

const toast = useToast();
const confirm = useConfirm();
const router = useRouter();
const route = useRoute();

const formatDateForQuery = (date) => {
    if (!date) return undefined;
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Returns 'YYYY-MM-DD'
};
// Fetch applications
const fetchApplications = async () => {
    loading.value = true;
    try {
        const response = await axiosClient.get('v1/applications', {
            params: {
                search: filters.value.nameEmail || undefined,
                passport_id: filters.value.passportId || undefined,
                status: filters.value.status || undefined,
                from_date: formatDateForQuery(filters.value.dateRange?.[0]),
                to_date: formatDateForQuery(filters.value.dateRange?.[1])
            }
        });

        applications.value = response.data.data; // ✅ FIXED HERE
    } catch (error) {
        console.error('❌ Failed to fetch applications:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch applications', life: 3000 });
    } finally {
        loading.value = false;
    }
};

onMounted(fetchApplications);

// Format date
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

// Status tag color
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

// Menu toggle handler
const toggleMenu = (event, id) => {
    const menu = menuRefs.get(id);
    if (menu) {
        menu.toggle(event);
    }
};

// Menu actions
const getMenuItems = (data) => [
    {
        label: 'View',
        icon: 'pi pi-eye',
        command: () => viewApplication(data)
    },
    {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => editApplication(data)
    },
    {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => confirmDelete(data)
    }
];

// Navigation handlers
const viewApplication = (app) => {
    router.push({ name: 'application.view', params: { id: app.id } });
};

const editApplication = (app) => {
    router.push({ name: 'application.edit', params: { id: app.id } });
};

// Delete confirmation
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

// Delete logic
const deleteApplication = async (id) => {
    try {
        await axiosClient.delete(`/v1/applications/${id}`);
        applications.value = applications.value.filter((a) => a.id !== id);
        toast.add({ severity: 'success', summary: 'Deleted', detail: 'Application deleted successfully', life: 3000 });
        menuRefs.delete(id); // Clean up reference
    } catch (error) {
        console.error('Failed to delete application:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete application', life: 3000 });
    }
};

// Breadcrumb
const breadcrumbItems = [
    { label: 'Clients', to: '/customers' },
    { label: 'Application', to: '/applications' },
    { label: 'Categories', to: '/category' },
    { label: 'Jobs', to: '/jobs' },
    { label: 'Payments', to: '/payments' }
];

const statusOptions = [
    { label: 'Draft', value: 'Draft' },
    { label: 'Active', value: 'Active' },
    { label: 'Open', value: 'Open' },
    { label: 'Closed', value: 'Closed' },
    { label: 'Under Review', value: 'Under Review' },
    { label: 'Shortlisted', value: 'Shortlisted' },
    { label: 'Interview Scheduled', value: 'Interview Scheduled' },
    { label: 'Interviewed', value: 'Interviewed' },
    { label: 'Offered', value: 'Offered' },
    { label: 'Hired', value: 'Hired' },
    { label: 'Rejected', value: 'Rejected' },
    { label: 'Withdrawn', value: 'Withdrawn' },
    { label: 'On Hold', value: 'On Hold' }
];
</script>
