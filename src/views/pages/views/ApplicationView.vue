<script setup>
import { getApplication } from '@/api/applications';
import { getClientDocuments } from '@/api/clients';
import axiosClient from '@/axiosClient';
import BreadCrumb from '@/components/BreadCrumbs/BreadCrumb.vue';
import ConfirmModal from '@/views/pages/modals/ConfirmModal.vue';
import DocumentModal from '@/views/pages/modals/DocumentModal.vue';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const toast = useToast();

const route = useRoute();
const router = useRouter();
const confirmModal = ref();
const applicationId = ref(0);
const statuses = ref([]);
const application = ref(null);
const loading = ref(true);
const clientDocuments = ref([]);
const loadingDocuments = ref(false);

// Modal state
const showRejectModal = ref(false);
const selectedDocId = ref(null);
const rejectionReason = ref('');

// Breadcrumb items
const breadcrumbItems = [
    { label: 'Applications', to: '/applications' },
    { label: `View #${route.params.id}`, to: route.fullPath }
];

onMounted(() => {
    applicationId.value = route.params.id;
    fetchApplication();
    fetchStatuses();
});

// Fetching application data
const fetchApplication = async () => {
    try {
        loading.value = true;
        const response = await getApplication(applicationId.value);

        application.value = response.data.data;

        await fetchClientDocuments(application.value.client_id);
    } catch (e) {
        console.error(e);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load jobs', life: 3000 });
    } finally {
        loading.value = false;
    }
};

const fetchClientDocuments = async (clientId) => {
    try {
        loading.value = true;

        const response = await getClientDocuments(clientId);

        clientDocuments.value = response.data;
    } catch (e) {
        console.error(e);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load documents', life: 3000 });
    } finally {
        loading.value = false;
    }
};

// Date formatter
const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date) ? 'Invalid date' : date.toLocaleString();
};

// Helpers
const isImage = (url) => /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i.test(url);

const goBack = () => {
    router.push({ name: 'applications' });
};

const approveDocument = async (id) => {
    try {
        const response = await axiosClient.post(`/v1/clientdocs/${id}/approve`);
        const updated = response.data.data;

        const index = clientDocuments.value.findIndex((doc) => doc.id === id);
        if (index !== -1) {
            clientDocuments.value[index] = updated;
        }

        toast.add({ severity: 'success', summary: 'Approved', detail: 'Document approved successfully', life: 3000 });
    } catch (error) {
        console.error('Error approving document:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to approve document', life: 3000 });
    }
};

// Modal opening logic
const openRejectModal = (doc) => {
    selectedDocId.value = doc.id; // ✅ Extract just the ID
    rejectionReason.value = '';
    showRejectModal.value = true;
};

// Modal submission handler
const handleRejectSubmit = async (reason) => {
    try {
        await axiosClient.post(`/v1/clientdocs/${selectedDocId.value}/reject`, {
            remarks: reason
        });
        showRejectModal.value = false;
        await fetchClientDocuments(application.value.client.id);
        toast.add({ severity: 'success', summary: 'Rejected', detail: 'Document rejected successfully', life: 3000 });
    } catch (error) {
        console.error('Error rejecting document:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to reject document', life: 3000 });
    }
};

const deleteDocument = async (docId) => {
    const confirmed = await confirmModal.value.show('Are you sure you want to delete this document?', 'Delete Document');

    if (!confirmed) return;

    try {
        await axiosClient.delete(`/v1/clientdocs/${docId}`);
        toast.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Document deleted successfully',
            life: 3000
        });
        fetchClientDocuments(application.value.client.id);
    } catch (error) {
        console.error('Error deleting document:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete document',
            life: 3000
        });
    }
};

const fetchStatuses = async () => {
    try {
        const response = await axiosClient.get('/v1/statuses');
        statuses.value = response.data;
    } catch (error) {
        console.error('Error fetching statuses:', error);
    }
};

// ✅ Update status for a specific application detail
const updateDetailStatus = async (detail) => {
    try {
        await axiosClient.put(`/v1/applicationdetails/${detail.id}`, {
            status_id: detail.status_id
        });

        toast.add({
            severity: 'success',
            summary: 'Updated',
            detail: `Status for "${detail.career?.name}" updated successfully`,
            life: 3000
        });

        // Optional: Refresh the application so it shows updated names/statuses
        await fetchApplication();
    } catch (error) {
        console.error('Error updating detail status:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update status',
            life: 3000
        });
    }
};
</script>

<template>
    <div class="card">
        <!-- Breadcrumb -->
        <BreadCrumb :items="breadcrumbItems" />

        <h2 class="text-2xl font-bold mt-6 mb-4 text-surface-900 dark:text-white">Application #{{ application?.id }} - {{ application?.application_code }}</h2>

        <div v-if="loading" class="card">
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
        <div v-else-if="!application" class="text-red-600 font-semibold">Application not found.</div>

        <div v-else class="bg-white dark:bg-surface-800 rounded-xl shadow p-6 space-y-6">
            <!-- Client Info -->
            <section>
                <h3 class="text-lg font-semibold border-b pb-1 mb-3 text-surface-900 dark:text-white">Client Information</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <p class="text-surface-700 dark:text-surface-300"><strong class="text-surface-900 dark:text-white">Name:</strong> {{ application.client?.first_name }} {{ application.client?.middle_name }} {{ application.client?.surname }}</p>
                    <p class="text-surface-700 dark:text-surface-300"><strong class="text-surface-900 dark:text-white">Email:</strong> {{ application.client?.email }}</p>
                    <p class="text-surface-700 dark:text-surface-300"><strong class="text-surface-900 dark:text-white">Phone:</strong> {{ application.client?.phone_number }}</p>
                    <p class="text-surface-700 dark:text-surface-300"><strong class="text-surface-900 dark:text-white">Passport Number:</strong> {{ application.client?.passport_number }}</p>
                    <p class="text-surface-700 dark:text-surface-300"><strong class="text-surface-900 dark:text-white">ID Number:</strong> {{ application.client?.id_number }}</p>
                </div>
            </section>

            <!-- Application Info -->
            <section>
                <h3 class="text-lg font-semibold border-b pb-1 mb-3 text-surface-900 dark:text-white">Application Details</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <p class="text-surface-700 dark:text-surface-300"><strong class="text-surface-900 dark:text-white">Application Status:</strong> {{ application.status?.name || 'N/A' }}</p>
                    <p class="text-surface-700 dark:text-surface-300"><strong class="text-surface-900 dark:text-white">Experience Brief:</strong> {{ application.remarks || 'N/A' }}</p>
                    <p class="text-surface-700 dark:text-surface-300"><strong class="text-surface-900 dark:text-white">Created At:</strong> {{ formatDate(application.created_at) }}</p>
                    <p class="text-surface-700 dark:text-surface-300"><strong class="text-surface-900 dark:text-white">Updated At:</strong> {{ formatDate(application.updated_at) }}</p>
                </div>

                <div class="mt-4">
                    <h4 class="text-md font-semibold mb-2 text-surface-900 dark:text-white">Careers Applied For:</h4>

                    <div v-for="detail in application.details" :key="detail.id" class="border rounded-lg p-3 mb-3 bg-gray-50 dark:bg-surface-700">
                        <p class="text-surface-700 dark:text-surface-300"><strong class="text-surface-900 dark:text-white">Career Title:</strong> {{ detail.career?.name || 'N/A' }}</p>

                        <!-- Status Selector for Admin -->
                        <label class="block mt-2 text-sm font-medium text-surface-700 dark:text-surface-300">Update Status:</label>
                        <select v-model="detail.status_id" @change="updateDetailStatus(detail)" class="border rounded p-1 w-full bg-white dark:bg-surface-600 text-surface-900 dark:text-white">
                            <option v-for="status in statuses" :key="status.id" :value="status.id">
                                {{ status.name }}
                            </option>
                        </select>
                        <p class="mt-1 text-gray-500 dark:text-surface-400 text-sm">Current: {{ detail.status?.name || 'N/A' }}</p>

                        <p class="text-surface-700 dark:text-surface-300"><strong class="text-surface-900 dark:text-white">Detail Created At:</strong> {{ formatDate(detail.created_at) }}</p>
                        <p v-if="detail.experience_brief" class="text-surface-700 dark:text-surface-300"><strong class="text-surface-900 dark:text-white">Experience Brief:</strong> {{ detail.experience_brief }}</p>
                    </div>
                </div>
            </section>

            <!-- Documents -->
            <section>
                <h3 class="text-lg font-semibold border-b pb-1 mb-3 text-surface-900 dark:text-white">Uploaded Documents</h3>

                <div v-if="loadingDocuments" class="text-gray-600 dark:text-surface-400">Loading documents...</div>
                <div v-else-if="clientDocuments.length === 0" class="text-gray-600 dark:text-surface-400">No documents uploaded.</div>

                <ul v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <li v-for="doc in clientDocuments" :key="doc.id" class="bg-gray-100 dark:bg-surface-700 p-4 rounded shadow">
                        <div class="mb-2 font-medium capitalize text-surface-900 dark:text-white">
                            {{ doc.document_type }}
                            <span v-if="doc.passport_expiry_date" class="text-sm text-gray-500 dark:text-surface-400"> (Expiry: {{ formatDate(doc.passport_expiry_date) }}) </span>
                        </div>

                        <!-- Image preview or fallback -->
                        <div class="w-full h-48 bg-white dark:bg-surface-600 border rounded overflow-hidden flex items-center justify-center">
                            <!-- If image -->
                            <a v-if="isImage(doc.document_url)" :href="doc.document_url" target="_blank" rel="noopener noreferrer" class="w-full h-full">
                                <img :src="doc.document_url" alt="Document Image" class="object-contain w-full h-full cursor-pointer" />
                            </a>
                            <!-- If not image -->
                            <div v-else class="text-gray-600 dark:text-surface-300 text-sm text-center p-4">
                                File:
                                <a :href="doc.document_url" target="_blank" class="text-blue-600 hover:underline dark:text-blue-400"> View Document </a>
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-2 mt-4">
                            <!-- Show buttons if document is still pending -->
                            <template v-if="doc.status === 'Pending'">
                                <Button label="Approve" icon="pi pi-check" class="p-button-success p-button-sm w-full sm:w-auto" @click="approveDocument(doc.id)" />
                                <Button label="Reject" icon="pi pi-times" class="p-button-warning p-button-sm w-full sm:w-auto" @click="openRejectModal(doc)" />
                                <Button label="Delete" icon="pi pi-trash" class="p-button-danger p-button-sm w-full sm:w-auto" @click="deleteDocument(doc.id)" />
                            </template>

                            <!-- Show status badge -->
                            <template v-else>
                                <span
                                    :class="[
                                        'px-3 py-1 rounded-full text-xs font-semibold',
                                        doc.status === 'Verified'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
                                            : doc.status === 'Rejected'
                                              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100'
                                              : 'bg-gray-200 text-gray-700 dark:bg-surface-600 dark:text-surface-300'
                                    ]"
                                >
                                    {{ doc.status }}
                                </span>
                            </template>
                        </div>
                    </li>
                </ul>
            </section>

            <!-- Payment -->
            <section>
                <h3 class="text-lg font-semibold border-b pb-1 mb-3 text-surface-900 dark:text-white">Payment Details</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <p class="text-surface-700 dark:text-surface-300"><strong class="text-surface-900 dark:text-white">Amount:</strong> {{ application.payment?.amount }}</p>
                    <p class="text-surface-700 dark:text-surface-300"><strong class="text-surface-900 dark:text-white">Status:</strong> {{ application.payment?.status?.name || 'Pending' }}</p>
                    <p class="text-surface-700 dark:text-surface-300"><strong class="text-surface-900 dark:text-white">Remarks:</strong> {{ application.payment?.remarks }}</p>
                    <p class="text-surface-700 dark:text-surface-300"><strong class="text-surface-900 dark:text-white">MerchantRequestID:</strong> {{ application.payment?.merchant_request_id }}</p>
                    <p class="text-surface-700 dark:text-surface-300"><strong class="text-surface-900 dark:text-white">CheckoutRequestID:</strong> {{ application.payment?.checkout_request_id }}</p>
                </div>
            </section>
        </div>

        <div class="mt-6">
            <Button label="Back to list" icon="pi pi-arrow-left" @click="goBack" class="p-button-outlined" />
        </div>

        <!-- Reject Modal -->
        <DocumentModal v-if="showRejectModal" header="Reject Document" @submit="handleRejectSubmit" @cancel="() => (showRejectModal = false)">
            <div class="space-y-2">
                <label for="reason" class="block text-sm font-medium text-surface-700 dark:text-surface-300">Reason for rejection:</label>
                <textarea id="reason" v-model="rejectionReason" rows="4" class="w-full border rounded p-2 bg-white dark:bg-surface-600 text-surface-900 dark:text-white"></textarea>
            </div>
        </DocumentModal>
        <ConfirmModal ref="confirmModal" />
    </div>
</template>
