<script setup>
import { fetchJobCategories, removeJobCategories } from '@/api/categories';
import axiosClient from '@/axiosClient';
import FilterAccordion from '@/components/Accordion/FilterParameters.vue';
import BreadCrumb from '@/components/BreadCrumbs/BreadCrumb.vue';

import { formatDate } from '@/utils/index';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const confirm = useConfirm();
const toast = useToast();
const router = useRouter();
const loading = ref(false);
const selectedId = ref(0);
const categories = ref([]);
const statuses = ref([]);

const breadcrumbItems = ref([{ label: 'Categories', to: '/categories' }]);

const applyFilters = (params) => {
    fetchData(params);
};

onMounted(async () => {
    await fetchStatuses();
    const params = {
        page: 1,
        orderBy: 'created_at',
        sortedBy: 'desc'
    };
    fetchData(params);
});

const pagination = reactive({
    current_page: 1,
    total_pages: 0,
    total: 0,
    per_page: 0
});

const onPageChange = (event) => {
    pagination.current_page = Math.floor(event.first / event.rows) + 1;
    pagination.per_page = event.rows;
    const params = {
        page: pagination.current_page,
        per_page: event.rows,
        orderBy: 'created_at',
        sortedBy: 'desc'
    };
    fetchData(params);
};

const fetchStatuses = async () => {
    try {
        const response = await axiosClient.get('/v1/statuses');
        statuses.value = response.data;
    } catch (error) {
        console.error('Error fetching statuses:', error);
    }
};

const getStatusSeverity = (statusName) => {
    if (!statusName) return 'info';

    const severityMap = {
        DRAFT: 'secondary',
        ACTIVE: 'success',
        OPEN: 'secondary',
        CLOSED: 'danger',
        'UNDER REVIEW': 'info',
        SHORTLISTED: 'warning',
        'INTERVIEW SCHEDULED': 'warning',
        INTERVIEWED: 'info',
        OFFERED: 'success',
        HIRED: 'success',
        REJECTED: 'danger',
        WITHDRAWN: 'danger',
        'ON HOLD': 'secondary'
    };

    return severityMap[statusName.toUpperCase()] || 'info';
};

const goToCreatePage = () => {
    router.push({ name: 'CategoryCreate' });
};

const editCategory = (id) => {
    router.push(`/category/edit/${id}`);
};

const deleteCategory = (id) => {
    selectedId.value = id;
    confirm.require({
        message: 'Do you want to delete this category?',
        header: 'Delete Category',
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
                const response = await removeJobCategories(selectedId.value);
                if (response.success) {
                    toast.add({ severity: 'success', summary: 'Deleted', detail: 'Category deleted successfully', life: 3000 });
                    const params = {
                        page: pagination.current_page,
                        per_page: pagination.per_page,
                        orderBy: 'created_at',
                        sortedBy: 'desc'
                    };
                    await fetchData(params);
                } else {
                    toast.add({ severity: 'warn', summary: 'Failed', detail: 'Could not delete category', life: 3000 });
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
        const response = await fetchJobCategories(params);
        categories.value = response.data.data;

        if (response.data.per_page && response.data.total && response.data.current_page) {
            pagination.per_page = response.data.per_page ?? 0;
            pagination.total = response.data.total ?? 0;
            pagination.current_page = response.data.current_page;

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
                    <div class="font-bold text-lg">Job Categories</div>
                    <div class="text-sm">List of all job categories</div>
                </div>
                <div class="flex justify-between items-center flex-wrap">
                    <div>
                        <FilterAccordion :showNameEmail="true" :showPassportId="false" :showDate="true" :showStatus="true" :status="statuses" :showApplication="false" :showJobCategory="true" :showJobTitle="false" @applyFilters="applyFilters" />
                    </div>
                </div>
                <Divider />
                <div class="flex justify-between items-center">
                    <div class="flex-1"></div>
                    <Button label="Add Category" icon="pi pi-plus" class="p-button-sm" @click="goToCreatePage" />
                </div>
            </div>
        </template>
        <template #content>
            <ConfirmDialog></ConfirmDialog>
            <DataTable
                :value="categories"
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
                <template #empty> No JobsCategory found matching the filter. </template>
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
                                        command: () => editCategory(slotProps.data.id)
                                    },
                                    {
                                        separator: true
                                    },
                                    {
                                        label: 'Delete',
                                        severity: 'danger',
                                        icon: 'pi pi-trash',
                                        class: 'menu-item-danger',
                                        command: () => deleteCategory(slotProps.data.id)
                                    }
                                ]"
                                :popup="true"
                            />
                        </div>
                    </template>
                </Column>
                <Column :sortable="true" field="name" header="Category Name"></Column>
                <Column header="Status" :sortable="true">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.status?.name" :severity="getStatusSeverity(slotProps.data.status?.name)" />
                    </template>
                </Column>
                <Column :sortable="true" field="description" header="Description"></Column>
                <Column header="Created At" style="min-width: 10rem">
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

.menu-item-danger {
    color: var(--red-500) !important;
}
</style>
