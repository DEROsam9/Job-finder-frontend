<!-- components/ConfirmModal.vue -->
<template>
    <Dialog v-model:visible="visible" modal :closable="false" :header="title" :style="{ width: '30vw' }">
        <div class="text-gray-700 text-base">{{ message }}</div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" @click="cancel" class="p-button-text" />
            <Button label="Confirm" icon="pi pi-check" @click="confirm" class="p-button-danger" autofocus />
        </template>
    </Dialog>
</template>

<script setup>
import { defineExpose, ref } from 'vue';

const visible = ref(false);
const title = ref('Confirm');
const message = ref('');
let resolveFn = null;

const show = (msg = 'Are you sure?', header = 'Confirm Action') => {
    message.value = msg;
    title.value = header;
    visible.value = true;
    return new Promise((resolve) => {
        resolveFn = resolve;
    });
};

const confirm = () => {
    visible.value = false;
    if (resolveFn) resolveFn(true);
};

const cancel = () => {
    visible.value = false;
    if (resolveFn) resolveFn(false);
};

defineExpose({ show });
</script>
