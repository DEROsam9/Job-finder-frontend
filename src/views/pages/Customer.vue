<template>
    <Fluid>
        <div class="p-4">
            <!-- 🔹 Breadcrumbs -->
            <div class="card p-4">
                <BreadCrumb :items="breadcrumbItems" />

                <h2 class="text-2xl font-bold mb-4">Clients</h2>

                <DataTable
                    v-model:filters="filters"
                    :value="clients"
                    paginator
                    showGridlines
                    :rows="10"
                    dataKey="id"
                    filterDisplay="menu"
                    :loading="loading"
                    :globalFilterFields="['first_name', 'surname', 'phone_number', 'email', 'passport_number', 'id_number']"
                >
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                            </IconField>
                        </div>
                    </template>

                    <template #empty> No clients found. </template>
                    <template #loading> Loading client data. Please wait... </template>

                    <Column field="first_name" header="First Name" style="min-width: 10rem">
                        <template #body="{ data }">{{ data.first_name }}</template>
                        <template #filter="{ filterModel }">
                            <InputText v-model="filterModel.value" placeholder="Search by first name" />
                        </template>
                    </Column>

                    <Column field="surname" header="Surname" style="min-width: 10rem">
                        <template #body="{ data }">{{ data.surname }}</template>
                        <template #filter="{ filterModel }">
                            <InputText v-model="filterModel.value" placeholder="Search by surname" />
                        </template>
                    </Column>

                    <Column field="phone_number" header="Phone Number" style="min-width: 12rem">
                        <template #body="{ data }">{{ data.phone_number }}</template>
                        <template #filter="{ filterModel }">
                            <InputText v-model="filterModel.value" placeholder="Search by phone" />
                        </template>
                    </Column>

                    <Column field="email" header="Email" style="min-width: 14rem">
                        <template #body="{ data }">{{ data.email }}</template>
                        <template #filter="{ filterModel }">
                            <InputText v-model="filterModel.value" placeholder="Search by email" />
                        </template>
                    </Column>

                    <Column field="passport_number" header="Passport" style="min-width: 10rem">
                        <template #body="{ data }">{{ data.passport_number }}</template>
                        <template #filter="{ filterModel }">
                            <InputText v-model="filterModel.value" placeholder="Search by passport" />
                        </template>
                    </Column>

                    <Column field="id_number" header="ID Number" style="min-width: 10rem">
                        <template #body="{ data }">{{ data.id_number }}</template>
                        <template #filter="{ filterModel }">
                            <InputText v-model="filterModel.value" placeholder="Search by ID" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import axiosClient from '@/axiosClient';
import BreadCrumb from '@/components/BreadCrumbs/BreadCrumb.vue';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onMounted, ref } from 'vue';

const breadcrumbItems = [
    { label: 'Clients', to: '/customers' },
    { label: 'Application', to: '/applications' }
];
const clients = ref([]);
const loading = ref(true);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    first_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    surname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    phone_number: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    passport_number: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    id_number: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
});

const clearFilter = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        first_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        surname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        phone_number: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        passport_number: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        id_number: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
    };
};

const fetchClients = async () => {
    try {
        const response = await axiosClient.get('/v1/clients');
        clients.value = Array.isArray(response.data?.data?.data) ? response.data.data.data : [];
    } catch (error) {
        console.error('Failed to fetch clients:', error);
        clients.value = [];
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchClients();
});
</script>

<style scoped>
/* Optional: scoped styles for table enhancements */
</style>
