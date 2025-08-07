<script setup>
import { fetchStatuses } from '@/api/common';
import { downloadPaymentPdf, downloadPaymentsExcel } from '@/api/downloads';
import { fetchPayments } from '@/api/payments';
import FilterAccordion from '@/components/Accordion/FilterParameters.vue';
import BreadCrumb from '@/components/BreadCrumbs/BreadCrumb.vue';
import Menu from 'primevue/menu';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const confirm = useConfirm();
const toast = useToast();
const router = useRouter();
const loading = ref(false);
const isLoading = ref(false);
const payments = ref([]);
const status = ref([]);
const filter_params = ref({
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc'
});

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
    filter_params.value = params;
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
    filter_params.value = params;
    fetchData(params);
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

async function downloadPdf(applicationPaymentId) {
    isLoading.value = true;
    try {
        const response = await downloadPaymentPdf(applicationPaymentId);
        const fileURL = window.URL.createObjectURL(
            new Blob([response], {
                type: 'application/pdf'
            })
        );
        const fileLink = document.createElement('a');
        const filename = `payment_receipt_${applicationPaymentId}_${new Date().getTime()}.pdf`;

        fileLink.href = fileURL;
        fileLink.setAttribute('download', filename);
        document.body.appendChild(fileLink);

        fileLink.click();

        // Clean up
        setTimeout(() => {
            window.URL.revokeObjectURL(fileURL);
            document.body.removeChild(fileLink);
        }, 100);
    } catch (error) {
        console.error('Error downloading PDF:', error);
        // Add user feedback here if needed
    } finally {
        isLoading.value = false;
    }
}

async function downloadExcel() {
    try {
        await downloadPaymentsExcel(filter_params.value)
            .then((Response) => {
                let fileURL = window.URL.createObjectURL(
                    new Blob([Response], {
                        type: 'application/vnd.ms-excel'
                    })
                );
                let fileLink = document.createElement('a');

                fileLink.href = fileURL;
                fileLink.setAttribute('download', 'payments_report_' + Math.round(+new Date() / 1000) + '.xlsx');
                document.body.appendChild(fileLink);

                fileLink.click();
            })
            .catch((err) => {
                console.log(err);
            });
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
}
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
                    <Button label="Download Excel" severity="info" icon="pi pi-download" @click="downloadExcel" />
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
                                        label: 'Download Receipt',
                                        icon: 'pi pi-download',
                                        class: 'menu-item-danger',
                                        command: () => downloadPdf(slotProps.data.id)
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
                <Column field="created_at" header="Date">
                    <template #body="slotProps">
                        {{ slotProps.data.created_at ? new Date(slotProps.data.created_at).toLocaleString() : '-' }}
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
</style>
