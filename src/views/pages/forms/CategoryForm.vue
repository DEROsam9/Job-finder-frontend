<template>
    <div class="grid">
        <BreadCrumb :items="breadcrumbItems" />
        <Card>
            <template #title>
                {{ isEditMode ? 'Edit Job Category' : 'Create Job Category' }}
            </template>
            <template #content>
                <form @submit.prevent="handleSubmit">
                    <div class="grid">
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="name">Category Name *</label>
                                <InputText id="name" v-model="form.name" class="w-full" :class="{ 'p-invalid': errors.name }" />
                                <small v-if="errors.name" class="p-error">{{ errors.name[0] }}</small>
                            </div>
                        </div>

                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="status">Status *</label>
                                <Dropdown id="status" v-model="form.status_id" :options="statuses" option-label="name" option-value="id" placeholder="Select Status" class="w-full" :class="{ 'p-invalid': errors.status_id }" />
                                <small v-if="errors.status_id" class="p-error">{{ errors.status_id[0] }}</small>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="field">
                                <label for="description">Description</label>
                                <Textarea id="description" v-model="form.description" rows="5" class="w-full" :class="{ 'p-invalid': errors.description }" />
                                <small v-if="errors.description" class="p-error">{{ errors.description[0] }}</small>
                            </div>
                        </div>

                        <div class="col-12 flex justify-content-end gap-2">
                            <Button label="Cancel" severity="secondary" @click="router.push('/category')" />
                            <Button type="submit" :label="isEditMode ? 'Update Category' : 'Create Category'" :loading="loading" />
                        </div>
                    </div>
                </form>
            </template>
        </Card>
    </div>
</template>

<script setup>
import axiosClient from '@/axiosClient';
import BreadCrumb from '@/components/BreadCrumbs/BreadCrumb.vue';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const toast = useToast();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const statuses = ref([]);

const isEditMode = computed(() => route.name === 'CategoryEdit');

const breadcrumbItems = computed(() => [
    { label: 'Home', to: '/' },
    { label: 'Categories', to: '/category' },
    {
        label: isEditMode.value ? 'Edit Category' : 'Create Category',
        to: isEditMode.value ? `/category/edit/${route.params.id}` : '/category/create'
    }
]);

const form = ref({
    name: '',
    description: '',
    status_id: null
});

const errors = ref({});

const fetchCategory = async () => {
    try {
        loading.value = true;
        const response = await axiosClient.get(`v1/job-categories/${route.params.id}`);
        form.value = {
            name: response.data.name,
            description: response.data.description,
            status_id: response.data.status_id
        };
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load category data',
            life: 3000
        });
        // router.push('/category');
    } finally {
        loading.value = false;
    }
};

const fetchStatuses = async () => {
    try {
        const response = await axiosClient.get('/v1/statuses');
        statuses.value = response.data;
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load statuses',
            life: 3000
        });
    }
};

const handleSubmit = async () => {
    try {
        loading.value = true;
        errors.value = {};

        if (isEditMode.value) {
            await axiosClient.put(`v1/job-categories/${route.params.id}`, form.value);
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Category updated successfully',
                life: 3000
            });
        } else {
            await axiosClient.post('v1/job-categories', form.value);
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Category created successfully',
                life: 3000
            });
        }

        router.push('/category');
    } catch (error) {
        if (error.response?.status === 422) {
            errors.value = error.response.data.errors;
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: isEditMode.value ? 'Failed to update category' : 'Failed to create category',
                life: 3000
            });
        }
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    await fetchStatuses();
    if (isEditMode.value) {
        await fetchCategory();
    }
});
</script>

<style scoped>
.field {
    margin-bottom: 1.5rem;
}
</style>
