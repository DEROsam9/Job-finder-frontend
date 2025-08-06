<script setup>
import axiosClient from '@/axiosClient';
import BreadCrumb from '@/components/BreadCrumbs/BreadCrumb.vue';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();
const route = useRoute();
const loading = ref(false);
const jobId = ref(route.params.id);

const breadcrumbItems = ref([
    { label: 'Jobs', url: '/jobs' },
    { label: 'Edit Job', url: `/jobs/edit/${jobId.value}` }
]);

const form = ref({
    name: '',
    slug: '',
    description: '',
    job_category_id: '',
    status_id: '',
    slots: 0
});

const categories = ref([]);
const statuses = ref([]);

const fetchJobData = async () => {
    try {
        loading.value = true;
        const jobResponse = await axiosClient.get(`/v1/careers/${jobId.value}`);
        form.value = jobResponse.data;

        const categoriesResponse = await axiosClient.get('/v1/careers/categories');
        categories.value = categoriesResponse.data;

        const statusesResponse = await axiosClient.get('/v1/statuses');
        statuses.value = statusesResponse.data;
    } catch (error) {
        console.error('Error fetching job data:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load job data', life: 3000 });
    } finally {
        loading.value = false;
    }
};

const submitForm = async () => {
    try {
        loading.value = true;
        await axiosClient.put(`/v1/careers/${jobId.value}`, form.value);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Job updated successfully', life: 3000 });
        router.push('/jobs');
    } catch (error) {
        console.error('Error updating job:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update job', life: 3000 });
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchJobData();
});
</script>

<template>
    <div class="p-4">
        <BreadCrumb :items="breadcrumbItems" />

        <Card class="mt-4 shadow-md">
            <template #title>
                <div class="flex flex-col gap-1">
                    <h2 class="text-xl font-semibold">Edit Job</h2>
                    <p class="text-gray-500 text-sm">Update job details</p>
                    <Divider class="mt-2 mb-0" />
                </div>
            </template>

            <template #content>
                <form @submit.prevent="submitForm" class="p-fluid space-y-6">
                    <div class="grid formgrid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="field w-full">
                            <label for="name">Job Title</label>
                            <InputText id="name" v-model="form.name" required :disabled="loading" placeholder="Enter job title" class="w-full" />
                        </div>

                        <div class="field w-full">
                            <label for="slug">Slug</label>
                            <InputText id="slug" v-model="form.slug" required :disabled="loading" placeholder="Enter URL slug" class="w-full" />
                        </div>

                        <div class="field md:col-span-2">
                            <label for="description">Description</label>
                            <Textarea id="description" v-model="form.description" :disabled="loading" rows="5" placeholder="Enter job description" class="w-full" />
                        </div>

                        <div class="field w-full">
                            <label for="job_category_id">Job Category</label>
                            <Dropdown id="job_category_id" v-model="form.job_category_id" :options="categories" optionLabel="name" optionValue="id" :disabled="loading" placeholder="Select category" class="w-full" />
                        </div>

                        <div class="field w-full">
                            <label for="status_id">Status</label>
                            <Dropdown id="status_id" v-model="form.status_id" :options="statuses" optionLabel="name" optionValue="id" :disabled="loading" placeholder="Select status" class="w-full" />
                        </div>

                        <div class="field w-full">
                            <label for="slots">Available Slots</label>
                            <InputNumber id="slots" v-model="form.slots" :disabled="loading" :min="0" showButtons :step="1" class="w-full" />
                        </div>
                    </div>

                    <div class="flex justify-end gap-2 mt-6">
                        <Button type="button" label="Cancel" severity="secondary" :disabled="loading" @click="router.push('/jobs')" />
                        <Button type="submit" label="Update" icon="pi pi-check" :loading="loading" />
                    </div>
                </form>
            </template>
        </Card>
    </div>
</template>
