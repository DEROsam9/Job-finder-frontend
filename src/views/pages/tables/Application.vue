<script setup>
import { fetchApplications, removeApplication } from '@/api/applications';
import FilterAccordion from '@/components/Accordion/FilterParameters.vue';
import BreadCrumb from '@/components/BreadCrumbs/BreadCrumb.vue';
import { formatDate, getSeverity } from '@/utils';
import Menu from 'primevue/menu';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import {downloadApplicationsExcel} from "@/api/downloads";

const confirm = useConfirm();
const toast = useToast();
const router = useRouter();
const loading = ref(false);
const isLoading = ref(false);
const selectedId = ref(0);
const filter_params = ref({
    page: 1,
    orderBy: 'created_at',
    sortedBy: 'desc'
});

onMounted(() => {
    const params = {
        page: 1,
        orderBy: 'created_at',
        sortedBy: 'desc'
    };
    fetchData(params);
});

const applications = ref([]);
const filters = ref('');

const applyFilters = (params) => {
    filter_params.value = params
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
    filter_params.value = params
    fetchData(params);
};

const editButton = (id) => {
    router.push(`/applications/${id}/edit`);
};

const viewApplication = (id) => {
    router.push(`/applications/${id}`);
};
const deleteApplication = (id) => {
    selectedId.value = id;
    confirm.require({
        message: 'Do you want to delete this record?',
        header: 'Delete Application',
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
                const response = await removeApplication(selectedId.value);
                if (response.success) {
                    toast.add({ severity: 'success', summary: 'Deleted', detail: 'Record deleted successfully', life: 3000 });
                    console.log('Customer refresh triggered!');
                    const params = {
                        orderBy: 'created_at',
                        sortedBy: 'desc'
                    };
                    await fetchData(params);
                } else {
                    toast.add({ severity: 'warn', summary: 'Failed', detail: 'Could not delete record', life: 3000 });
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

async function downloadExcel() {
    try {
        await downloadApplicationsExcel(filter_params.value)
            .then((Response) => {
                let fileURL = window.URL.createObjectURL(
                    new Blob([Response], {
                        type: "application/vnd.ms-excel",
                    })
                );
                let fileLink = document.createElement("a");

                fileLink.href = fileURL;
                fileLink.setAttribute(
                    "download",
                    "application_report_" + Math.round(+new Date() / 1000) + ".xlsx"
                );
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

const fetchData = async (params) => {
    try {
        loading.value = true;
        const response = await fetchApplications(params);

        applications.value = response.data.data.data;

        if (response.data.data.per_page && response.data.data.total && response.data.data.current_page) {
            pagination.per_page = response.data.data.per_page ?? 0;
            pagination.total = response.data.data.total ?? 0;
            pagination.current_page = response.data.data.current_page;

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
</script>

<template>
    <BreadCrumb :items="breadcrumbItems" />
    <Card>
        <template #title>
            <div class="flex flex-col gap-4">
                <div>
                    <div class="font-bold text-lg">Applications</div>
                    <div class="text-sm">List of all applications</div>
                </div>
                <Divider />
                <div class="flex justify-between items-center flex-wrap">
                    <div>
                        <FilterAccordion
                            v-model="filters"
                            :showNameEmail="false"
                            :showPassportId="false"
                            :showDate="true"
                            :showApplication="true"
                            :showStatus="true"
                            @applyFilters="applyFilters"
                        />
                    </div>
                    <Button
                        label="Download Excel"
                        severity="info"
                        icon="pi pi-download"
                        @click="downloadExcel"
                    />
                </div>
            </div>
        </template>
        <template #content>
            <ConfirmDialog></ConfirmDialog>
            <DataTable
                :value="applications"
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
                <Column header="Actions" style="width: 3rem">
                    <template #body="slotProps">
                        <div class="relative">
                            <Button :aria-controls="`menu_${slotProps.data.id}`" aria-haspopup="true" class="p-button-text" icon="pi pi-ellipsis-v" @click="$refs[`menu_${slotProps.data.id}`].toggle($event)" />

                            <Menu
                                :id="`menu_${slotProps.data.id}`"
                                :ref="`menu_${slotProps.data.id}`"
                                :model="[
                                    {
                                        label: 'View',
                                        icon: 'pi pi-eye',
                                        command: () => viewApplication(slotProps.data.id)
                                    },
                                    {
                                        label: 'Edit',
                                        icon: 'pi pi-pencil',
                                        command: () => editButton(slotProps.data.id)
                                    },
                                    {
                                        separator: true
                                    },
                                    {
                                        label: 'Delete',
                                        severity: 'danger',
                                        icon: 'pi pi-trash',
                                        class: 'menu-item-danger',
                                        command: () => deleteApplication(slotProps.data.id)
                                    }
                                ]"
                                :popup="true"
                            />
                        </div>
                    </template>
                </Column>
                <Column :sortable="true" field="application_code" header="Application Code"></Column>

                <Column header="Client Name">
                    <template #body="slotProps">
                        <div class="flex flex-row">
                            <span class="mr-2">{{ `${slotProps.data?.client?.first_name}  ${slotProps.data?.client?.surname}` }}</span>
                        </div>
                    </template>
                </Column>
                <Column header="Email">
                    <template #body="slotProps">
                        <div class="flex flex-row">
                            <span class="mr-2">{{ slotProps.data?.client?.email }}</span>
                        </div>
                    </template>
                </Column>
                <Column header="Phone Number">
                    <template #body="slotProps">
                        <div class="flex flex-row">
                            <span>{{ slotProps.data?.client?.phone_number }}</span>
                        </div>
                    </template>
                </Column>
                <Column header="Passport Number">
                    <template #body="slotProps">
                        <div class="flex flex-row">
                            <span class="ms-1">
                                {{ slotProps.data?.client?.passport_number ? '******' + slotProps.data.client?.passport_number.slice(-3) : '-' }}
                            </span>
                        </div>
                    </template>
                </Column>
                <Column header="ID Number">
                    <template #body="slotProps">
                        <div class="flex flex-row">
                            <span class="ms-1">
                                {{ slotProps.data?.client?.id_number ? '******' + slotProps.data.client?.id_number.slice(-3) : '-' }}
                            </span>
                        </div>
                    </template>
                </Column>
                <Column header="Job Applied" style="min-width: 10rem">
                    <template #body="slotProps">
                        <div class="flex flex-row">
                            <span class="mr-2">{{ `${slotProps.data?.career?.name}` }}</span>
                        </div>
                    </template>
                </Column>
                <Column header="Status" style="min-width: 10rem">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.status.name" :severity="getSeverity(slotProps.data.status.name)" />
                    </template>
                </Column>
                <Column header="Application Date" style="min-width: 10rem">
                    <template #body="slotProps">
                        <div class="flex flex-row">
                            <span class="mr-2">{{ formatDate(slotProps.data?.created_at) }}</span>
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
</style>
