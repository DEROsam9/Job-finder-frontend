<script setup>
import { fetchClients, removeClient } from '@/api/clients';
import FilterAccordion from '@/components/Accordion/FilterParameters.vue';
import { formatDate } from '@/utils/index';
import ClientFormModal from '@/views/pages/modals/ClientFormModal.vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, reactive, ref } from 'vue';

const confirm = useConfirm();
const toast = useToast();
const loading = ref(false);
const showModal = ref(false);
const currentClient = ref(null);
const clients = ref([]);

const breadcrumbItems = [{ label: 'Clients', to: '/clients' }];

const filters = ref({
    nameEmail: '',
    passportId: ''
});

const pagination = reactive({
    current_page: 1,
    total_pages: 1,
    total: 0,
    per_page: 10
});

const applyFilters = params => {
    fetchData(params);
};

const openAdd = () => {
    currentClient.value = null;
    showModal.value = true;
};

const editClient = (client) => {
    currentClient.value = { ...client };
    showModal.value = true;
};

const handleSave = async () => {
    const params = {
        page: 1,
        orderBy: 'created_at',
        sortedBy: 'desc'
    };
    await fetchData(params);
    showModal.value = false;
};

const fetchData = async (params) => {
    try {
        loading.value = true;

        const response = await fetchClients(params);

        clients.value = response.data.data.data || [];

        // Update pagination
        pagination.current_page = response.data.data.current_page;
        pagination.total = response.data.data.total;
        pagination.per_page = response.data.data.per_page;
        pagination.total_pages = response.data.data.last_page;

        console.log(pagination)

    } catch (error) {
        console.error('Error fetching clients:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch clients',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

const onPageChange = (event) => {
    pagination.current_page = event.page + 1;
    const params = {
        page: pagination.current_page,
        orderBy: 'created_at',
        sortedBy: 'desc'
    };
    fetchData(params);
};

const deleteClients = async (id) => {
    confirm.require({
        message: 'Do you want to delete this client?',
        header: 'Delete Client',
        icon: 'pi pi-info-circle',
        accept: async () => {
            try {
                await removeClient(id);
                toast.add({
                    severity: 'success',
                    summary: 'Deleted',
                    detail: 'Client deleted successfully',
                    life: 3000
                });
                const params = {
                    page: pagination.current_page,
                    orderBy: 'created_at',
                    sortedBy: 'desc'
                };
                await fetchData(params);
            } catch (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete client',
                    life: 3000
                });
            }
        },
        reject: () => {
            toast.add({
                severity: 'info',
                summary: 'Cancelled',
                detail: 'Deletion cancelled',
                life: 3000
            });
        }
    });
};

onMounted(() => {
    const params = {
        page: 1,
        orderBy: 'created_at',
        sortedBy: 'desc'
    };
    fetchData(params);
});
</script>

<template>
    <BreadCrumb :items="breadcrumbItems" />
    <Card>
        <template #title>
            <div class="flex flex-col gap-4">
                <div>
                    <div class="font-bold text-lg">Clients</div>
                    <div class="text-sm">List of all Clients</div>
                </div>
                <Divider />
                <div class="flex justify-between items-center flex-wrap">
                    <div>
                        <FilterAccordion
                            v-model="filters"
                            :showNameEmail="true"
                            :showPassportId="true"
                            :showDate="false"
                            :showStatus="false"
                            @applyFilters="applyFilters"
                        />
                    </div>
                    <Button label="Add Client" icon="pi pi-plus" @click="openAdd" />
                </div>
            </div>
        </template>
        <template #content>
            <ConfirmDialog></ConfirmDialog>
            <ClientFormModal v-model:show="showModal" :mode="currentClient ? 'edit' : 'add'" :client="currentClient" @save="handleSave" />

            <DataTable
                :value="clients"
                :paginator="true"
                :loading="loading"
                :rows="pagination.per_page"
                :first="(pagination.current_page - 1) * pagination.per_page"
                :totalRecords="pagination.total"
                @page="onPageChange"
                scrollable
                scrollHeight="500px"
                sortMode="multiple"
                stripedRows
                tableStyle="min-width: 50rem"
            >
                <template #empty> No clients found. </template>
                <template #loading> Loading client data. Please wait... </template>

                <Column field="first_name" header="First Name" :sortable="true" />
                <Column field="surname" header="Surname" :sortable="true" />
                <Column field="phone_number" header="Phone Number" />
                <Column field="email" header="Email" />
                <Column header="Passport Number">
                    <template #body="slotProps">
                        {{ slotProps.data.passport_number || '-' }}
                    </template>
                </Column>
                <Column header="ID Number">
                    <template #body="slotProps">
                        {{ slotProps.data.id_number || '-' }}
                    </template>
                </Column>
                <Column header="Created At">
                    <template #body="slotProps">
                        {{ formatDate(slotProps.data.created_at) }}
                    </template>
                </Column>

                <Column header="Actions" style="width: 3rem">
                    <template #body="slotProps">
                        <div class="relative">
                            <Button :aria-controls="`menu_${slotProps.data.id}`" aria-haspopup="true" class="p-button-text" icon="pi pi-ellipsis-v" @click="$refs[`menu_${slotProps.data.id}`].toggle($event)" />

                            <Menu
                                :id="`menu_${slotProps.data.id}`"
                                :ref="`menu_${slotProps.data.id}`"
                                :model="[
                                    {
                                        label: 'Edit',
                                        icon: 'pi pi-pencil',
                                        command: () => editClient(slotProps.data)
                                    },
                                    {
                                        separator: true
                                    },
                                    {
                                        label: 'Delete',
                                        severity: 'danger',
                                        icon: 'pi pi-trash',
                                        class: 'menu-item-danger',
                                        command: () => deleteClients(slotProps.data.id)
                                    }
                                ]"
                                :popup="true"
                            />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </template>
    </Card>
</template>

<style>
.p-datatable-scrollable-thead > tr > th {
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
}

.menu-item-danger {
    color: #ef4444 !important;
}
</style>
