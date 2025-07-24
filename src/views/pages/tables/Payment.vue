<template>
    <div>
        <Toast />
        <BreadCrumb :items="breadcrumbItems" />
        <h2 class="text-xl font-bold mb-4">Payments</h2>

        <Button label="Add Payment" icon="pi pi-plus" class="mb-3" @click="openModal()" />

        <DataTable :value="payments" :loading="loading" :paginator="true" :rows="10" scrollable scrollHeight="400px" tableStyle="min-width: 50rem" emptyMessage="No payments found">
            <Column field="amount" header="Amount"></Column>

            <!-- NEW: Paid By -->
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

            <!-- Swapped -->
            <Column field="checkout_request_id" header="Checkout ID"></Column>
            <Column field="transaction_reference" header="Reference"></Column>
            <Column field="transaction_date" header="Date">
                <template #body="slotProps">
                    {{ slotProps.data.transaction_date ? new Date(slotProps.data.transaction_date).toLocaleString() : '-' }}
                </template>
            </Column>

            <Column header="Actions" style="min-width: 100px">
                <template #body="{ data }">
                    <Menu :model="getActions(data)" popup :ref="(el) => el && menuRefs.set(data.id, el)" />
                    <Button icon="pi pi-ellipsis-v" text @click="(event) => toggleMenu(event, data.id)" />
                </template>
            </Column>
        </DataTable>

        <PaymentModal v-model:show="showModal" :mode="modalMode" :payment="selectedPayment" @save="handleSave" />
    </div>
</template>
<script setup>
import Button from 'primevue/button';
import Menu from 'primevue/menu';

import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { onMounted, ref } from 'vue';

import BreadCrumb from '@/components/BreadCrumbs/BreadCrumb.vue';
import paymentService from '@/service/payment';
import { useToast } from 'primevue/usetoast';
import PaymentModal from '../modals/PaymentModal.vue';

const toast = useToast();

const selectedRow = ref(null);

const menuRefs = ref(new Map());

const toggleMenu = (event, id) => {
    const menu = menuRefs.value.get(id);
    if (menu) {
        menu.toggle(event);
    }
};
const breadcrumbItems = [
    { label: 'Clients', to: '/customers' },
    { label: 'Application', to: '/applications' },
    { label: 'Categories', to: '/category' },
    { label: 'Jobs', to: '/jobs' },
    { label: 'Payments', to: '/payments' }
];

const getActions = (payment) => [
    {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => openModal(payment)
    },
    {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => deletePayment(payment.id)
    }
];

const payments = ref([]);
const loading = ref(false);
const showModal = ref(false);
const selectedPayment = ref(null);
const modalMode = ref('add');

const fetchPayments = async () => {
    loading.value = true;
    try {
        const res = await paymentService.getAll();
        payments.value = res.data.data.data;
    } catch (err) {
        console.error('Failed to fetch payments:', err);
    } finally {
        loading.value = false;
    }
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
        fetchPayments();
    } catch (error) {
        console.error('Error saving payment:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save payment', life: 3000 });
    }
};

const deletePayment = async (id) => {
    if (confirm('Are you sure you want to delete this payment?')) {
        try {
            await paymentService.delete(id);
            toast.add({ severity: 'success', summary: 'Deleted', detail: 'Payment deleted successfully', life: 3000 });
            fetchPayments();
        } catch (error) {
            console.error('Delete error:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete payment', life: 3000 });
        }
    }
};

onMounted(fetchPayments);

const statusColors = {
    Active: 'bg-green-100 text-green-800',
    Draft: 'bg-gray-100 text-gray-800',
    Rejected: 'bg-red-100 text-red-800',
    'Under Review': 'bg-yellow-100 text-yellow-800',
    'Interview Scheduled': 'bg-blue-100 text-blue-800',
    Closed: 'bg-purple-100 text-purple-800',
    Offered: 'bg-pink-100 text-pink-800',
    Hired: 'bg-green-200 text-green-900',
    Withdrawn: 'bg-gray-200 text-gray-900'
};
</script>
