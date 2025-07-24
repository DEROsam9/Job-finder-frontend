<template>
    <Dialog :visible="show" modal header="Add Payment" :style="{ width: '500px' }" @update:visible="$emit('update:show', $event)">
        <form @submit.prevent="submit">
            <div class="mb-4">
                <label class="block mb-1">Client ID</label>
                <InputNumber v-model="form.client_id" :useGrouping="false" class="w-full" required />
            </div>

            <div class="mb-4">
                <label class="block mb-1">Amount</label>
                <InputNumber v-model="form.amount" class="w-full" required />
            </div>

            <div class="mb-4">
                <label class="block mb-1">Status ID</label>
                <InputNumber v-model="form.status_id" class="w-full" />
            </div>

            <div class="mb-4">
                <label class="block mb-1">Transaction Reference</label>
                <InputText v-model="form.transaction_reference" class="w-full" />
            </div>

            <div class="mb-4">
                <label class="block mb-1">Transaction Date</label>
                <Calendar v-model="form.transaction_date" class="w-full" showIcon dateFormat="yy-mm-dd" />
            </div>

            <div class="mb-4">
                <label class="block mb-1">Remarks</label>
                <Textarea v-model="form.remarks" class="w-full" rows="2" />
            </div>

            <div class="mb-4">
                <label class="block mb-1">Additional Information</label>
                <Textarea v-model="form.additional_information" class="w-full" rows="2" />
            </div>

            <div class="mb-4">
                <label class="block mb-1">Payload (JSON)</label>
                <Textarea v-model="form.payload" class="w-full" rows="2" placeholder='{"phone":"254712345678"}' />
            </div>

            <div class="mb-4">
                <label class="block mb-1">Merchant Request ID</label>
                <InputText v-model="form.merchant_request_id" class="w-full" />
            </div>

            <div class="mb-4">
                <label class="block mb-1">Checkout Request ID</label>
                <InputText v-model="form.checkout_request_id" class="w-full" />
            </div>

            <div class="flex justify-end mt-4">
                <Button label="Cancel" class="p-button-text mr-2" @click="$emit('update:show', false)" />
                <Button label="Save" type="submit" />
            </div>
        </form>
    </Dialog>
</template>

<script setup>
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { reactive, watch } from 'vue';

const props = defineProps({
    show: Boolean,
    mode: String,
    payment: Object
});

const emit = defineEmits(['update:show', 'save']);

const form = reactive({
    client_id: null,
    amount: null,
    status_id: null,
    transaction_reference: '',
    transaction_date: '',
    remarks: '',
    additional_information: '',
    payload: '',
    merchant_request_id: '',
    checkout_request_id: ''
});

watch(
    () => props.payment,
    (newPayment) => {
        if (newPayment) {
            Object.assign(form, { ...newPayment });
        } else {
            Object.assign(form, {
                client_id: null,
                amount: null,
                status_id: null,
                transaction_reference: '',
                transaction_date: '',
                remarks: '',
                additional_information: '',
                payload: '',
                merchant_request_id: '',
                checkout_request_id: ''
            });
        }
    },
    { immediate: true }
);

const submit = () => {
    const cleanForm = {
        ...form,
        payload: form.payload || null,
        transaction_date: form.transaction_date ? form.transaction_date.toISOString().split('T')[0] : null
    };
    emit('save', cleanForm);
};
</script>
