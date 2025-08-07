<script setup>
import { fetchUsers,removeUser} from '@/api/users.js';
import FilterAccordion from '@/components/Accordion/FilterParameters.vue';
import { formatDate } from '@/utils/index';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()
const confirm = useConfirm();
const toast = useToast();
const loading = ref(false);
const users = ref([]);

const breadcrumbItems = [{ label: 'Users', to: '/users' }];

const filters = ref({
    nameEmail: '',
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

const editUser = userId =>{
    router.push(`/users/form/${userId}`)
};

const fetchData = async (params) => {
    try {
        loading.value = true;

        const response = await fetchUsers(params);

        users.value = response.data.data.data || [];

        // Update pagination
        pagination.current_page = response.data.data.current_page;
        pagination.total = response.data.data.total;
        pagination.per_page = response.data.data.per_page;
        pagination.total_pages = response.data.data.last_page;

        console.log(pagination)

    } catch (error) {
        console.error('Error fetching user:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch users',
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

const deleteUsers = async (id) => {
    confirm.require({
        message: 'Do you want to delete this user?',
        header: 'Delete User',
        icon: 'pi pi-info-circle',
        accept: async () => {
            try {
                await removeUser(id);
                toast.add({
                    severity: 'success',
                    summary: 'Deleted',
                    detail: 'User deleted successfully',
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
                    detail: 'Failed to delete user',
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
                    <div class="font-bold text-lg">Users</div>
                    <div class="text-sm">List of all users</div>
                </div>
                <Divider />
                <div class="flex justify-between items-center flex-wrap">
                    <div>
                        <FilterAccordion
                            v-model="filters"
                            :showNameEmail="true"
                            :showDate="false"
                            :showStatus="false"
                            @applyFilters="applyFilters"
                        />
                    </div>
                    <div>
                        <Button v-slot="slotProps" asChild class="p-button-success">
                            <RouterLink :class="slotProps.class" to="/users/create"> <i class="pi pi-plus"></i> Add User </RouterLink>
                        </Button>
                    </div>
                </div>
            </div>
        </template>
        <template #content>
            <ConfirmDialog></ConfirmDialog>
            <DataTable
                :value="users"
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
                <template #empty> No user found. </template>
                <template #loading> Loading users data. Please wait... </template>

                <Column field="name" header="Name" :sortable="true" />
                <Column field="email" header="email" :sortable="true" />
                <Column field="phone_number" header="Phone Number" />


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
                                        command:()=>editUser(slotProps.data.id)
                                    },
                                    {
                                        separator: true
                                    },
                                    {
                                        label: 'Delete',
                                        severity: 'danger',
                                        icon: 'pi pi-trash',
                                        class: 'menu-item-danger',
                                        command: () => deleteUsers(slotProps.data.id)
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
