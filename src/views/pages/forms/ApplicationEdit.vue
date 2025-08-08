
<script setup>
import BreadCrumb from '@/components/BreadCrumbs/BreadCrumb.vue';
import { onMounted, ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { useToast } from 'primevue/usetoast';
import { getApplication, updateApplication } from '@/api/applications'
import { fetchStatuses } from '@/api/common'

const toast = useToast();

const route = useRoute();
const router = useRouter();

const application = ref(null);
const loading = ref(false);
const applicationId = ref(0)
const statuses = ref([]);
const form = reactive({
    application_code: '',
    status_id: null,
    remarks: ''
});

const breadcrumbItems = [
    { label: 'Clients', to: '/customers' },
    { label: 'Application', to: '/applications' },
    { label: 'Edit', to: `/applications/${route.params.id}/edit` }
];


onMounted(() => {
    applicationId.value = route.params.id;
    fetchData()
    loadStatus()
})

const fetchData = async () => {
    loading.value = true
    try {
        getApplication(applicationId.value).then(response => {
            if (response?.status == 200) {

                application.value = response.data.data

                form.application_code = response.data.data.application_code;
                form.status_id = response.data.data.status_id;
                form.remarks = response.data.remarks || '';

            } else { console.log(response) }
        })
    }
    catch (error) {
        console.log(error)
    }
    finally {
        loading.value = false
    }
}

const loadStatus = async () => {
    loading.value = true
    try {
        fetchStatuses({}).then(response => {
            if (response?.status == 200) {
                statuses.value = response.data
            } else { console.log(response) }
        })
    }
    catch (error) {
        console.log(error)
    }
    finally {
        loading.value = false
    }
}

const submitForm = async () => {

    loading.value = true

    const formData = {
        "_method":  "PUT",
        'application_code' : form.application_code,
        'status_id' : form.status_id,
        'remarks' :  form.remarks,
    }

    updateApplication(applicationId.value, formData)
        .then(async data => {
            if (data.status === 200) {
                toast.add({
                    severity: 'success',
                    summary: 'Success Message',
                    detail:  data.data.message,
                    life: 3000
                });
                await router.push('/users');
            } else {
                toast.add({
                    severity: 'danger',
                    summary: 'Error Message',
                    detail:  data.data.message,
                    life: 3000
                });
            }
        })
        .catch(err => {
            loading.value = false

            toast.add({
                severity: 'danger',
                summary: 'Error Message',
                message: err.message,
                life: 3000
            });
        })
        .finally(() => {
            loading.value = false
        })
}
</script>

<template>
    <div class="p-4 bg-white dark:bg-black shadow rounded-md">
        <Toast />
        <BreadCrumb :items="breadcrumbItems" />

        <div v-if="application" class="card">
            <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Edit Application #{{ application?.application_code }}</h2>

            <form  @submit.prevent="submitForm" class="space-y-4">
                <div class="bg-gray-50 dark:bg-gray-900 p-3 rounded border dark:border-gray-700 text-sm space-y-1">
                    <p class="text-gray-800 dark:text-gray-200"><strong>Client:</strong> {{ application.client?.first_name }} {{ application.client?.surname }}</p>
                    <p class="text-gray-800 dark:text-gray-200"><strong>Email:</strong> {{ application.client?.email }}</p>
                    <p class="text-gray-800 dark:text-gray-200"><strong>Phone:</strong> {{ application.client?.phone_number }}</p>
                    <p class="text-gray-800 dark:text-gray-200"><strong>Career:</strong> {{ application.career?.name }}</p>
                    <p class="text-gray-800 dark:text-gray-200"><strong>Description:</strong> {{ application.career?.description }}</p>
                </div>
                <div>
                    <label class="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Application Code</label>
                    <InputText disabled v-model="form.application_code" class="w-full" />
                </div>
                <div>
                    <label class="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Remarks</label>
                    <Textarea v-model="form.remarks" rows="4" class="w-full" />
                </div>
                <div>
                    <label class="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Status</label>
                    <Dropdown v-model="form.status_id" :options="statuses" optionLabel="name" optionValue="id" placeholder="Select a status" class="w-full" />
                </div>
                <div class="flex justify-end">
                    <Button
                        label="Update Changes"
                        type="submit"
                        icon="pi pi-check"
                        class="w-auto"
                    />
                </div>
            </form>
        </div>

        <div  v-else class="card">
            <div class="rounded border border-surface-200 dark:border-surface-700 p-6 bg-surface-0 dark:bg-surface-900">
                <div class="flex mb-4">
                    <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                    <div>
                        <Skeleton width="10rem" class="mb-2"></Skeleton>
                        <Skeleton width="5rem" class="mb-2"></Skeleton>
                        <Skeleton height=".5rem"></Skeleton>
                    </div>
                </div>
                <Skeleton width="100%" height="150px"></Skeleton>
                <div class="flex justify-between mt-4">
                    <Skeleton width="4rem" height="2rem"></Skeleton>
                    <Skeleton width="4rem" height="2rem"></Skeleton>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
label {
    font-weight: 500;
}

/* PrimeVue Dark Mode Overrides */
:deep(.p-dropdown) {
    background: var(--surface-a);
    border-color: var(--surface-d);
    color: var(--text-color);
}

:deep(.p-dropdown .p-dropdown-label) {
    color: var(--text-color);
}

:deep(.p-inputtext) {
    background: var(--surface-a);
    border-color: var(--surface-d);
    color: var(--text-color);
}

:deep(.p-inputtext:enabled:hover) {
    border-color: var(--primary-color);
}

:deep(.p-inputtext:enabled:focus) {
    box-shadow: 0 0 0 0.2rem var(--primary-300);
    border-color: var(--primary-color);
}

:deep(.p-textarea) {
    background: var(--surface-a);
    border-color: var(--surface-d);
    color: var(--text-color);
}
</style>
