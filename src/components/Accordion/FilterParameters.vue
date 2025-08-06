<script setup>
import { reactive } from 'vue';

defineProps({
    showNameEmail: Boolean,
    showPassportId: Boolean,
    showApplication: Boolean,
    showDate: Boolean,
    showStatus: Boolean,
    showAmountRange: Boolean,
    showTransactionRef: Boolean,
    showJobCategory: Boolean,
    showJobTitle: Boolean,
    status: Array
});

const emit = defineEmits(['applyFilters']);

const localFilters = reactive({
    email: '',
    passport_or_id: '',
    application_code: '',
    name: '',
    dateRange: '',
    status_id: 0,
    min_amount: '',
    max_amount: '',
    transaction_ref: '',
    JobCategory: '',
    JobTitle: ''
});

const emailOrNameFilter = () => {
    const params = {
        page: 1,
        orderBy: 'created_at',
        sortedBy: 'desc',
        name: localFilters.name
    };
    emit('applyFilters', params);
};

const statusFilter = () => {
    const params = {
        page: 1,
        orderBy: 'created_at',
        sortedBy: 'desc',
        status_id: localFilters.status_id
    };
    emit('applyFilters', params);
};

const applicationCodeFilter = () => {
    const params = {
        page: 1,
        orderBy: 'created_at',
        sortedBy: 'desc',
        search: localFilters.application_code,
        searchFields: `application_code`
    };
    emit('applyFilters', params);
};

function dateRangeFilter(dates) {
    if (!dates || dates.length < 2) {
        return;
    }

    const from = dates[0];
    const to = dates[1];

    const formatDate = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const fromDate = formatDate(from);
    const toDate = formatDate(to);

    const params = {
        page: 1,
        orderBy: 'created_at',
        sortedBy: 'desc',
        from: fromDate,
        to: toDate
    };
    emit('applyFilters', params);
}

const passportFilter = () => {
    const params = {
        page: 1,
        orderBy: 'created_at',
        sortedBy: 'desc',
        passport_or_id: localFilters.passport_or_id
    };
    emit('applyFilters', params);
};

const amountRangeFilter = () => {
    const params = {
        page: 1,
        orderBy: 'created_at',
        sortedBy: 'desc',
        min_amount: localFilters.min_amount,
        max_amount: localFilters.max_amount
    };
    emit('applyFilters', params);
};

const transactionRefFilter = () => {
    const params = {
        page: 1,
        orderBy: 'transaction_date',
        sortedBy: 'desc',
        transaction_ref: localFilters.transaction_ref
    };
    emit('applyFilters', params);
};

const JobCategory = () => {
    const params = {
        page: 1,
        orderBy: 'created_at',
        sortedBy: 'desc',
        name: localFilters.JobCategory
    };
    emit('applyFilters', params);
};

const JobTitle = () => {
    const params = {
        page: 1,
        orderBy: 'created_at',
        sortedBy: 'desc',
        name: localFilters.JobTitle
    };
    emit('applyFilters', params);
};
</script>
<template>
    <Accordion multiple class="mb-8">
        <AccordionPanel>
            <AccordionHeader>🔍 Filter</AccordionHeader>
            <AccordionContent>
                <div class="flex flex-wrap gap-4 items-end">
                    <!-- Name or Email -->
                    <div v-if="showNameEmail" class="flex-1 min-w-[600px]">
                        <InputText v-model="localFilters.name" placeholder="Name Or Email Or Phone Number" size="large" class="w-full" @input="emailOrNameFilter" />
                    </div>

                    <div v-if="showPassportId" class="flex-1 min-w-[600px]">
                        <InputText v-model="localFilters.passport_or_id" placeholder="Passport or ID Number" size="large" class="w-full" @input="passportFilter" />
                    </div>

                    <div v-if="showApplication" class="flex-1 min-w-[600px]">
                        <InputText v-model="localFilters.application_code" placeholder="Application Code" size="large" class="w-full" @input="applicationCodeFilter" />
                    </div>

                    <div v-if="showDate" class="flex-1 min-w-[600px]">
                        <DatePicker v-model="localFilters.dateRange" selectionMode="range" size="large" class="w-full" inputClass="w-full" placeholder="Pick Date Range" :manualInput="true" @update:modelValue="dateRangeFilter" />
                    </div>

                    <div v-if="showStatus" class="flex-1 min-w-[600px]">
                        <Select v-model="localFilters.status_id" :options="status" optionLabel="name" optionValue="id" placeholder="Select Status" class="w-full" @change="statusFilter" />
                    </div>

                    <!-- New Amount Range Filter -->
                    <div v-if="showAmountRange" class="flex-1 min-w-[600px]">
                        <div class="flex gap-4">
                            <InputNumber v-model="localFilters.min_amount" placeholder="Min Amount" mode="currency" currency="KES" locale="en-US" class="w-full" @update:modelValue="amountRangeFilter" />
                            <InputNumber v-model="localFilters.max_amount" placeholder="Max Amount" mode="currency" currency="KES" locale="en-US" class="w-full" @update:modelValue="amountRangeFilter" />
                        </div>
                    </div>

                    <!-- New Transaction Reference Filter -->
                    <div v-if="showTransactionRef" class="flex-1 min-w-[600px]">
                        <InputText v-model="localFilters.transaction_ref" placeholder="Transaction Reference" size="large" class="w-full" @input="transactionRefFilter" />
                    </div>

                    <div v-if="showJobCategory" class="flex-1 min-w-[600px]">
                        <InputText v-model="localFilters.JobCategory" placeholder="Job Category" size="large" class="w-full" @input="JobCategory" />
                    </div>

                    <div v-if="showJobTitle" class="flex-1 min-w-[600px]">
                        <InputText v-model="localFilters.JobTitle" placeholder="Job Title" size="large" class="w-full" @input="JobTitle" />
                    </div>
                </div>
            </AccordionContent>
        </AccordionPanel>
    </Accordion>
</template>
