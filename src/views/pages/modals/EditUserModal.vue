<script setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import { computed, ref, watch } from 'vue';

const props = defineProps({
    show: Boolean,
    mode: { type: String, default: 'add' }, // 'add' | 'edit' | 'view'
    client: Object
});

const emit = defineEmits(['update:show', 'save']);

const form = ref({
    name: '',
    email: '',
    phone_number: '',
});

watch(
    () => props.user,
    (val) => {
        if (val && (props.mode === 'edit' || props.mode === 'view')) {
            form.value = { ...val };
        } else {
            form.value = {
                first_name: '',
                email: '',
                phone_number: '',
            };
        }
    },
    { immediate: true }
);

const isViewMode = computed(() => props.mode === 'view');

const dialogTitle = computed(() => {
    if (props.mode === 'edit') return 'Edit User';
    if (props.mode === 'view') return 'Client Details';
    return 'Add User';
});

const handleSubmit = () => {
    emit('save', { ...form.value });
    emit('update:show', false);
};
</script>
<template>
    <Dialog :visible="show" @update:visible="emit('update:show', $event)" modal :header="dialogTitle" :closable="true" :style="{ width: '500px' }">
        <form @submit.prevent="handleSubmit">
            <div class="p-fluid">
                <div class="field">
                    <label for="first_name" class="mr-2">Name</label>
                    <InputText id="name" v-model="form.name" :disabled="isViewMode" required />
                </div>
                <div class="field">
                    <label for="email" class="mr-2">Email</label>
                    <InputText id="email" v-model="form.email" :disabled="isViewMode" />
                </div>

                <div class="field">
                    <label for="phone_number" class="mr-2">Phone Number</label>
                    <InputText id="phone_number" v-model="form.phone_number" :disabled="isViewMode" />
                </div>
            </div>

            <div class="flex justify-end gap-2 mt-4">
                <Button v-if="!isViewMode" type="submit" label="Save" icon="pi pi-check" />
                <Button label="Close" icon="pi pi-times" text @click="emit('update:show', false)" />
            </div>
        </form>
    </Dialog>
</template>



<style scoped>
.field {
    margin-bottom: 1rem;
}
</style>
