<!-- src/components/FilterAccordion.vue -->
<template>
    <Accordion multiple class="mb-4">
        <AccordionPanel>
            <AccordionHeader>🔍 Filter</AccordionHeader>
            <AccordionContent>
                <div class="flex flex-wrap gap-4 items-end">
                    <!-- Name or Email -->
                    <div v-if="showNameEmail" class="flex-1 min-w-[200px]">
                        <InputText v-model="localFilters.nameEmail" placeholder="Name or Email" class="w-full" @input="emitFilters" />
                    </div>

                    <!-- Passport or ID -->
                    <div v-if="showPassportId" class="flex-1 min-w-[200px]">
                        <InputText v-model="localFilters.passportId" placeholder="Passport or ID" class="w-full" @input="emitFilters" />
                    </div>

                    <!-- Date Range -->
                    <div v-if="showDate" class="flex-1 min-w-[240px]">
                        <DatePicker v-model="localFilters.dateRange" selectionMode="range" showIcon inputClass="w-full" :manualInput="true" @change="emitFilters" @input="emitFilters" />
                    </div>

                    <!-- Status -->
                    <div v-if="showStatus" class="flex-1 min-w-[200px]">
                        <Select v-model="localFilters.status" :options="statusOptions" optionLabel="label" placeholder="Select Status" class="w-full" @change="emitFilters" />
                    </div>
                </div>
            </AccordionContent>
        </AccordionPanel>
    </Accordion>
</template>

<script setup>
import { reactive, watch } from 'vue';
// Import Select instead of Dropdown

const props = defineProps({
    modelValue: Object, // two-way bound filter values
    showNameEmail: Boolean,
    showPassportId: Boolean,
    showDate: Boolean,
    showStatus: Boolean,
    statusOptions: Array // optional for dropdowns
});

const emit = defineEmits(['update:modelValue', 'input']); // ✅ Add 'input' here

const localFilters = reactive({ ...props.modelValue });

// Emit when any input changes
function emitFilters() {
    emit('update:modelValue', { ...localFilters });
    emit('input'); // ✅ This triggers applyFilters() in parent
}

// Keep local sync with prop updates
watch(
    () => props.modelValue,
    (newVal) => {
        for (const key in newVal) {
            localFilters[key] = newVal[key];
        }
    },
    { deep: true }
);
// Watch specifically for changes in dateRange
watch(
    () => localFilters.dateRange,
    () => {
        emitFilters();
    },
    { deep: true }
);
</script>
