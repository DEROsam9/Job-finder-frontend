<template>
    <div class="p-4 max-w-5xl mx-auto">
        <!-- Breadcrumb -->
        <BreadCrumb :items="breadcrumbItems" />

        <h2 class="text-2xl font-bold mt-6 mb-4">Application #{{ application?.id }} - {{ application?.application_code }}</h2>

        <div v-if="loading" class="text-gray-600 italic">Loading...</div>

        <div v-else-if="!application" class="text-red-600 font-semibold">Application not found.</div>

        <div v-else class="bg-white rounded-xl shadow p-6 space-y-6">
            <!-- Client Info -->
            <section>
                <h3 class="text-lg font-semibold border-b pb-1 mb-3">Client Information</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <p><strong>Name:</strong> {{ application.client?.first_name }} {{ application.client?.middle_name }} {{ application.client?.surname }}</p>
                    <p><strong>Email:</strong> {{ application.client?.email }}</p>
                    <p><strong>Phone:</strong> {{ application.client?.phone_number }}</p>
                    <p><strong>Passport Number:</strong> {{ application.client?.passport_number }}</p>
                    <p><strong>ID Number:</strong> {{ application.client?.id_number }}</p>
                </div>
            </section>

            <!-- Application Info -->
            <section>
                <h3 class="text-lg font-semibold border-b pb-1 mb-3">Application Details</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <p><strong>Status:</strong> {{ application.status?.name || 'N/A' }}</p>
                    <p><strong>Career:</strong> {{ application.career?.title || 'N/A' }}</p>
                    <p class="sm:col-span-2"><strong>Experience Brief:</strong> {{ application.remarks }}</p>
                    <p><strong>Created At:</strong> {{ formatDate(application.created_at) }}</p>
                    <p><strong>Updated At:</strong> {{ formatDate(application.updated_at) }}</p>
                </div>
            </section>

            <!-- Documents -->
            <section>
                <h3 class="text-lg font-semibold border-b pb-1 mb-3">Uploaded Documents</h3>
                <div v-if="loadingDocuments" class="text-gray-600">Loading documents...</div>
                <div v-else-if="clientDocuments.length === 0" class="text-gray-600">No documents uploaded.</div>
                <ul v-else class="list-disc pl-6 space-y-2">
                    <li v-for="doc in clientDocuments" :key="doc.id">
                        <div>
                            <span class="font-medium capitalize">{{ doc.document_type }}</span>
                            <span v-if="doc.passport_expiry_date"> - Expiry: {{ formatDate(doc.passport_expiry_date) }}</span>
                        </div>
                        <a :href="doc.document_url" target="_blank" class="text-blue-600 hover:underline"> View Document </a>
                    </li>
                </ul>
            </section>

            <!-- Payment -->
            <section>
                <h3 class="text-lg font-semibold border-b pb-1 mb-3">Payment Details</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <p><strong>Amount:</strong> {{ application.payment?.amount }}</p>
                    <p><strong>Status:</strong> {{ application.payment?.status?.name || 'Pending' }}</p>
                    <p><strong>Remarks:</strong> {{ application.payment?.remarks }}</p>
                    <p><strong>MerchantRequestID:</strong> {{ application.payment?.merchant_request_id }}</p>
                    <p><strong>CheckoutRequestID:</strong> {{ application.payment?.checkout_request_id }}</p>
                </div>
            </section>
        </div>

        <div class="mt-6">
            <Button label="Back to list" icon="pi pi-arrow-left" @click="goBack" class="p-button-outlined" />
        </div>
    </div>
</template>

<script setup>
import axiosClient from '@/axiosClient';
import BreadCrumb from '@/components/BreadCrumbs/BreadCrumb.vue';
import Button from 'primevue/button';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const application = ref(null);
const loading = ref(true);
const route = useRoute();
const router = useRouter();
const clientDocuments = ref([]);
const loadingDocuments = ref(false);

const breadcrumbItems = [
    { label: 'Applications', to: '/applications' },
    { label: `View #${route.params.id}`, to: route.fullPath }
];

const fetchApplication = async () => {
    loading.value = true;
    try {
        const response = await axiosClient.get(`/v1/applications/${route.params.id}`);
        application.value = response.data?.data;
    } catch (error) {
        console.error('Error loading application', error);
        application.value = null;
    } finally {
        loading.value = false;
    }
    if (application.value?.client?.id) {
        await fetchClientDocuments(application.value.client.id);
    }
};

const fetchClientDocuments = async (clientId) => {
    loadingDocuments.value = true;
    try {
        const res = await axiosClient.get(`/v1/clientdocs/client/${clientId}`);
        clientDocuments.value = res.data?.data || [];
    } catch (e) {
        console.error('Error fetching documents', e);
        clientDocuments.value = [];
    } finally {
        loadingDocuments.value = false;
    }
};

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date) ? 'Invalid date' : date.toLocaleString();
};

const goBack = () => {
    router.push({ name: 'applications' });
};

onMounted(fetchApplication);
</script>
