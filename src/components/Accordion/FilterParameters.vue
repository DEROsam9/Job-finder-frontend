
<script setup>
import { reactive } from 'vue';

const props = defineProps({
    showNameEmail: Boolean,
    showPassportId: Boolean,
    showApplication: Boolean,
    showDate: Boolean,
    showStatus: Boolean,
    status: Array
});

const emit = defineEmits(['applyFilters']);

const localFilters = reactive({
    email: '',
    passport_or_id: '',
    application_code: '',
    name: '',
    dateRange: '',
    status_id: 0
});

const emailOrNameFilter = () => {
    const params = {
        page: 1,
        orderBy: 'created_at',
        sortedBy: 'desc',
        name: localFilters.name,
    }
    emit('applyFilters', params)
}

const statusFilter = () => {

    const params = {
        page: 1,
        orderBy: 'created_at',
        sortedBy: 'desc',
        status_id: localFilters.status_id
    }
    emit('applyFilters', params)
}

const applicationCodeFilter = () => {

    const params = {
        page: 1,
        orderBy: 'created_at',
        sortedBy: 'desc',
        search:  localFilters.application_code,
        searchFields: `application_code`,
    }
    emit('applyFilters', params)
}

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
    }
    emit('applyFilters', params)
}

const passportFilter = () => {
    const params = {
        page: 1,
        orderBy: 'created_at',
        sortedBy: 'desc',
        passport_or_id: localFilters.passport_or_id,
    }
    emit('applyFilters', params)
}
</script>
<template>
    <Accordion multiple class="mb-8">
        <AccordionPanel>
            <AccordionHeader>🔍 Filter</AccordionHeader>
            <AccordionContent>
                <div class="flex flex-wrap gap-4 items-end">
                    <!-- Name or Email -->
                    <div v-if="showNameEmail" class="flex-1 min-w-[600px]">
                        <InputText
                            v-model="localFilters.name"
                            placeholder="Name Or Email Or Phone Number"
                            size="large"
                            class="w-full"
                            @input="emailOrNameFilter"
                        />
                    </div>

                    <div v-if="showPassportId" class="flex-1 min-w-[600px]">
                        <InputText
                            v-model="localFilters.passport_or_id"
                            placeholder="Passport or ID Number"
                            size="large"
                            class="w-full"
                            @input="passportFilter"
                        />
                    </div>

                    <div v-if="showApplication" class="flex-1 min-w-[600px]">
                        <InputText
                            v-model="localFilters.application_code"
                            placeholder="Application Code"
                            size="large"
                            class="w-full"
                            @input="applicationCodeFilter"
                        />
                    </div>

                    <div v-if="showDate" class="flex-1 min-w-[600px]">
                        <DatePicker
                            v-model="localFilters.dateRange"
                            selectionMode="range"
                            size="large"
                            class="w-full"
                            inputClass="w-full"
                            placeholder="Pick Date Range"
                            :manualInput="true"
                            @update:modelValue="dateRangeFilter"
                        />
                    </div>

                    <div v-if="showStatus" class="flex-1 min-w-[600px]">
                        <Select
                            v-model="localFilters.status_id"
                            :options="status"
                            optionLabel="name"
                            optionValue="id"
                            placeholder="Select Status"
                            class="w-full"
                            @change="statusFilter"
                        />
                    </div>
                </div>
            </AccordionContent>
        </AccordionPanel>
    </Accordion>
</template>
