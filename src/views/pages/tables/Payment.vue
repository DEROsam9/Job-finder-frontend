<script setup>
import { fetchStatuses } from '@/api/common';
import { fetchPayments, removePayments } from '@/api/payments';
import FilterAccordion from '@/components/Accordion/FilterParameters.vue';
import BreadCrumb from '@/components/BreadCrumbs/BreadCrumb.vue';
import Menu from 'primevue/menu';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import PaymentModal from '../modals/PaymentModal.vue';

const confirm = useConfirm();
const toast = useToast();
const router = useRouter();
const loading = ref(false);
const selectedId = ref(0);
const payments = ref([]);
const status = ref([]);
const showModal = ref(false);
const selectedPayment = ref(null);
const modalMode = ref('add');

const breadcrumbItems = [{ label: 'Payments', to: '/payments' }];

const statusColors = {
    Active: 'bg-green-100 text-green-800',
    Draft: 'bg-gray-100 text-gray-800',
    Rejected: 'bg-red-100 text-red-800',
    'Under Review': 'bg-yellow-100 text-yellow-800',
    'Interview Scheduled': 'bg-blue-100 text-blue-800',
    Closed: 'bg-purple-100 text-purple-800',
    Offered: 'bg-pink-100 text-pink-800',
    Hired: 'bg-green-200 text-green-900',
    Withdrawn: 'bg-gray-200 text-gray-900',
    Pending: 'bg-orange-100 text-orange-800',
    Failed: 'bg-red-200 text-red-900'
};

onMounted(() => {
    const params = {
        page: 1,
        orderBy: 'created_at',
        sortedBy: 'desc'
    };
    fetchData(params);
    fetchStatusData(params);
});

const applyFilters = (params) => {
    fetchData(params);
};

const pagination = reactive({
    current_page: '',
    total_pages: '',
    total: '',
    per_page: ''
});

const onPageChange = (event) => {
    pagination.current_page = Math.floor(event.first / event.rows) + 1;
    pagination.per_page = event.rows;
    const params = {
        page: event.rows,
        orderBy: 'created_at',
        sortedBy: 'desc'
    };
    fetchData(params);
};

const openModal = (payment = null) => {
    modalMode.value = payment ? 'edit' : 'add';
    selectedPayment.value = payment;
    showModal.value = true;
};

const savePayment = async (data) => {
    try {
        if (modalMode.value === 'edit') {
            await paymentService.update(selectedPayment.value.id, data);
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Payment updated successfully', life: 3000 });
        } else {
            await paymentService.create(data);
            toast.add({ severity: 'success', summary: 'Created', detail: 'Payment created successfully', life: 3000 });
        }

        showModal.value = false;
        fetchData();
    } catch (error) {
        console.error('Error saving payment:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save payment', life: 3000 });
    }
};

const deletePayment = (id) => {
    selectedId.value = id;
    confirm.require({
        message: 'Do you want to delete this record?',
        header: 'Delete Payment',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: async () => {
            try {
                const response = await removePayments(selectedId.value);
                if (response.success) {
                    toast.add({ severity: 'success', summary: 'Deleted', detail: 'Payment deleted successfully', life: 3000 });
                    const params = {
                        orderBy: 'created_at',
                        sortedBy: 'desc'
                    };
                    await fetchData(params);
                } else {
                    toast.add({ severity: 'warn', summary: 'Failed', detail: 'Could not delete payment', life: 3000 });
                }
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while deleting', life: 3000 });
                console.error(error);
            }
        },
        reject: () => {
            toast.add({ severity: 'info', summary: 'Cancelled', detail: 'Deletion cancelled', life: 3000 });
        }
    });
};

const fetchData = async (params) => {
    try {
        loading.value = true;
        const response = await fetchPayments(params);
        payments.value = response.data.data;

        if (response.data.per_page && response.data.total && response.data.current_page) {
            // Convert string values to numbers using Number() or parseInt()
            pagination.per_page = Number(response.data.per_page) || 0;
            pagination.total = Number(response.data.total) || 0;
            pagination.current_page = Number(response.data.current_page) || 1;
            pagination.total_pages = pagination.per_page > 0 && pagination.total > 0 ? Math.ceil(pagination.total / pagination.per_page) : 0;
        } else {
            pagination.total_pages = 0;
        }
    } catch (e) {
        console.log(e);
        loading.value = false;
    } finally {
        loading.value = false;
    }
};

const fetchStatusData = async (params) => {
    try {
        loading.value = true;
        const response = await fetchStatuses(params);
        status.value = response.data;
    } catch (e) {
        console.log(e);
        loading.value = false;
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <BreadCrumb :items="breadcrumbItems" />
    <Card>
        <template #title>
            <div class="flex flex-col gap-4">
                <div>
                    <div class="font-bold text-lg">Payments</div>
                    <div class="text-sm">List of all payments</div>
                </div>
                <Divider />
                <div class="flex justify-between items-center flex-wrap">
                    <div>
                        <FilterAccordion :status="status" :showPaidBy="true" :showPassportId="false" :showDate="true" :showStatus="true" :showAmountRange="true" :showTransactionRef="true" @applyFilters="applyFilters" />
                    </div>
                    <Button label="Add Payment" icon="pi pi-plus" @click="openModal()" />
                </div>
            </div>
        </template>
        <template #content>
            <ConfirmDialog></ConfirmDialog>
            <Toast />
            <DataTable
                :value="payments"
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
                <template #empty> No Payment found matching the filter. </template>
                <template #loading> Loading client data. Please wait... </template>
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
                                        command: () => openModal(slotProps.data)
                                    },
                                    {
                                        separator: true
                                    },
                                    {
                                        label: 'Delete',
                                        severity: 'danger',
                                        icon: 'pi pi-trash',
                                        class: 'menu-item-danger',
                                        command: () => deletePayment(slotProps.data.id)
                                    }
                                ]"
                                :popup="true"
                            />
                        </div>
                    </template>
                </Column>
                <Column field="amount" header="Amount"></Column>

                <Column header="Paid By">
                    <template #body="slotProps">
                        <span> {{ slotProps.data.client?.first_name }} {{ slotProps.data.client?.middle_name }} {{ slotProps.data.client?.surname }} </span>
                    </template>
                </Column>

                <Column header="Status">
                    <template #body="slotProps">
                        <span class="text-sm font-medium px-2 py-1 rounded-full" :class="statusColors[slotProps.data.status?.name] ?? 'bg-gray-100 text-gray-600'">
                            {{ slotProps.data.status?.name ?? 'Unknown' }}
                        </span>
                    </template>
                </Column>

                <Column field="transaction_reference" header="Reference"></Column>
                <Column field="transaction_date" header="Date">
                    <template #body="slotProps">
                        {{ slotProps.data.transaction_date ? new Date(slotProps.data.transaction_date).toLocaleString() : '-' }}
                    </template>
                </Column>
            </DataTable>

            <PaymentModal v-model:show="showModal" :mode="modalMode" :payment="selectedPayment" @save="savePayment" />
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
</style>
