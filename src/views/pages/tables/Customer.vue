<template>
    <div class="p-4">
        <div class="card p-4 shadow-md rounded-xl bg-white">
            <!-- 🔹 Breadcrumbs -->
            <BreadCrumb :items="breadcrumbItems" />

            <h2 class="text-2xl font-bold mb-4">Clients</h2>

            <Button label="Add Client" icon="pi pi-plus" class="mb-4" @click="openAdd" />

            <DataTable :value="clients" paginator :rows="10" dataKey="id" :loading="loading" scrollable scrollHeight="400px" class="text-sm" tableStyle="min-width: 50rem">
                <template #empty> No clients found. </template>
                <template #loading> Loading client data. Please wait... </template>

                <Column field="first_name" header="First Name" style="min-width: 10rem" />
                <Column field="surname" header="Surname" style="min-width: 10rem" />
                <Column field="phone_number" header="Phone Number" style="min-width: 12rem" />
                <Column field="email" header="Email" style="min-width: 14rem" />
                <Column field="passport_number" header="Passport" style="min-width: 10rem" />
                <Column field="id_number" header="ID Number" style="min-width: 10rem" />

                <Column header="Actions" style="min-width: 8rem">
                    <template #body="{ data }">
                        <Menu :model="getActions(data)" popup :ref="(el) => (actionMenus[data.id] = el)" />
                        <Button icon="pi pi-ellipsis-v" text @click="actionMenus[data.id]?.toggle($event)" />
                    </template>
                </Column>
            </DataTable>

            <ConfirmDialog />
            <ClientFormModal v-model:show="showModal" :mode="editClient ? 'edit' : 'add'" :client="editClient" @save="handleSave" />
        </div>
    </div>
</template>

<script setup>
import axiosClient from '@/axiosClient';
import BreadCrumb from '@/components/BreadCrumbs/BreadCrumb.vue';
import ClientFormModal from '@/views/pages/modals/ClientFormModal.vue';
import { useConfirm } from 'primevue/useconfirm';
import { onMounted, ref } from 'vue';

const showModal = ref(false);
const editClient = ref(null);
const confirm = useConfirm();

const breadcrumbItems = [
    { label: 'Clients', to: '/customers' },
    { label: 'Application', to: '/applications' },
    { label: 'Categories', to: '/category' },
    { label: 'Jobs', to: '/jobs' },
    { label: 'Payments', to: '/payments' }
];

const clients = ref([]);
const loading = ref(true);
const actionMenus = ref({});

const fetchClients = async () => {
    loading.value = true;
    try {
        const response = await axiosClient.get('/v1/clients');
        clients.value = Array.isArray(response.data?.data?.data) ? response.data.data.data : [];
    } catch (error) {
        console.error('❌ Failed to fetch clients:', error);
        clients.value = [];
    } finally {
        loading.value = false;
    }
};

onMounted(fetchClients);

const getActions = (row) => [
    {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => openEdit(row)
    },
    {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => confirmDelete(row),
        style: { color: 'red' }
    }
];

const openAdd = () => {
    editClient.value = null;
    showModal.value = true;
};

const openEdit = (client) => {
    editClient.value = client;
    showModal.value = true;
};

const confirmDelete = (row) => {
    confirm.require({
        message: `Are you sure you want to delete ${row.first_name}?`,
        header: 'Confirm Deletion',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
            try {
                await axiosClient.delete(`/v1/clients/${row.id}`);
                await fetchClients();
            } catch (error) {
                console.error('❌ Delete failed:', error);
            }
        }
    });
};

const handleSave = async (data) => {
    try {
        if (editClient.value) {
            await axiosClient.put(`/v1/clients/${editClient.value.id}`, data);
        } else {
            await axiosClient.post('/v1/clients', data);
        }
        await fetchClients();
        showModal.value = false;
    } catch (error) {
        console.error('❌ Save failed:', error);
    }
};
</script>

<style scoped>
.borderless-table ::v-deep(.p-datatable-table) {
    border: none;
}

.borderless-table ::v-deep(.p-datatable-thead > tr > th),
.borderless-table ::v-deep(.p-datatable-tbody > tr > td) {
    border: none !important;
}

.borderless-table ::v-deep(.p-datatable) {
    border: none;
    box-shadow: none;
}
</style>
