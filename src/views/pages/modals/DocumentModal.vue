<template>
    <Dialog v-model:visible="visible" modal :header="header" class="w-[90vw] md:w-[30rem]" :closable="false">
        <div class="space-y-4">
            <label for="remark" class="block text-sm font-medium text-gray-700">Reason for rejection:</label>
            <Textarea id="remark" v-model="remark" rows="5" class="w-full" autoResize placeholder="Write a brief reason..." />
        </div>

        <template #footer>
            <div class="flex justify-between items-center pt-4">
                <Button label="Cancel" icon="pi pi-times" @click="cancel" class="p-button-text" />
                <Button v-if="showSubmit" label="Submit" icon="pi pi-check" @click="submit" class="p-button-primary" :disabled="!remark" />
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import { ref, watch } from 'vue';

const props = defineProps({
    header: { type: String, default: 'Reject Document' },
    showSubmit: { type: Boolean, default: true }
});

const emit = defineEmits(['submit', 'cancel']);
const visible = ref(true);
const remark = ref('');

// Reset modal when reopened
watch(visible, (val) => {
    if (val) remark.value = '';
});

const cancel = () => {
    visible.value = false;
    emit('cancel');
};

const submit = () => {
    visible.value = false;
    emit('submit', remark.value.trim());
};
</script>

<style scoped>
/* Optional styling overrides */
</style>
