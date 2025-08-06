<script setup>
import { addSettings, getSettings } from '@/api/settings';
import { FormField } from '@primevue/forms';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Select from 'primevue/select';
import { onMounted, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
const toast = useToast();

onMounted(() =>{
    fetchData()
})

const onAdvancedUpload = () => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};

const form = reactive({
    name: '',
    email: '',
    phone: '',
    kra_pin: '',
    location: '',
    address: '',
    email_configs: '',
    letter_head: '',
    logo: ''
});

const submitForm = () => {
    const formData = new FormData();

    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('phone', form.phone);
    formData.append('kra_pin', form.kra_pin);
    formData.append('location', form.location);
    formData.append('address', form.address);
    formData.append('email_configs', form.email_configs);
    formData.append('letter_head', form.letter_head);
    formData.append('logo', form.logo);

    addSettings(formData)
        .then((data) => {
            console.log(data);
            if (data.data.success) {
                console.log(data);
            } else {
            }
        }).catch((err) => {
            console.log(err)
        }).finally(() => {

        });
};
const fetchData = async () => {
    const response = await getSettings();
    if(response.data.message=="success"){
        const data=response.data.data;

        form.name=data.name,
            form.email=data.email,
            form.phone=data.phone,
            form.kra_pin=data.kra_pin,
            form.location=data.location,
            form.address=data.address,
            form.email_configs=data.email_configs,
            form.letter_head=data.letter_head,
            form.logo=data.logo
    }
};
</script>
<template>
    <div class="card">
        <h2>Settings</h2>
        <p>Configure application-wide settings here.</p>
        <hr />
        <form @submit.prevent="submitForm" class="flex flex-col gap-4">
            <!-- v1 start -->
            <!-- v1 ends -->
            <div class="flex flex-col md:flex-row gap-4">
                <div class="w-full flex flex-col">
                    <div>
                        <label class="block mb-2">Name <span class="text-red-500">*</span></label>
                        <FormField class="mb-4" name="name">
                            <InputText v-model="form.name" class="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g CompanyA" required type="text" />
                        </FormField>
                    </div>

                    <div>
                        <label class="block mb-2">Phone No. <span class="text-red-500">*</span></label>
                        <FormField class="mb-4" initialValue="" name="phone_number">
                            <InputText v-model="form.phone" class="w-full p-2 border border-gray-300 rounded-md" placeholder="0712345678" required type="text" />
                        </FormField>
                    </div>

                    <div>
                        <label class="block mb-2">Location </label>
                        <FormField class="mb-4" initialValue="" name="location">
                            <InputText v-model="form.location" class="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g Nairobi" type="text" />
                        </FormField>
                    </div>


                    <div>
                        <label class="block mb-2">Kra Pin. </label>
                        <FormField class="mb-4" name="kra_pin">
                            <InputText v-model="form.kra_pin" class="w-full p-2 border border-gray-300 rounded-md" placeholder="EX. A01815736U" type="text" />
                        </FormField>
                    </div>
                </div>

                <!-- part two-->
                <div class="w-full flex flex-col">
                    <div>
                        <label class="block mb-2">Email <span class="text-red-500">*</span></label>
                        <FormField class="mb-4" initialValue="" name="email">
                            <InputText v-model="form.email" class="w-full p-2 border border-gray-300 rounded-md" placeholder="email@example.com" required type="email" />
                        </FormField>
                    </div>

                    <div>
                        <label class="block mb-2">Address </label>
                        <FormField class="mb-4" initialValue="" name="address">
                            <InputText v-model="form.address" class="w-full p-2 border border-gray-300 rounded-md" placeholder="1045" type="email" />
                        </FormField>
                    </div>
                    <div>
                        <label class="block mb-2">Letter Head. </label>
                        <FormField class="mb-4" initialValue="" name="letter-head">
                            <textarea v-model="form.letter_head" class="w-full p-2 border border-gray-300 rounded-md" type="text" />
                        </FormField>
                    </div>
                    <div>
                        <label class="block mb-2">Logo </label>
                        <FormField class="mb-4" name="logo">
                            <Toast />
                            <FileUpload name="demo[]" url="/api/upload" @upload="onAdvancedUpload($event)" :multiple="true" accept="image/*" :maxFileSize="1000000">
                                <template #empty>
                                    <span>Drag and drop logo here to upload.</span>
                                </template>
                            </FileUpload>
                        </FormField>
                    </div>
                </div>
            </div>
            <!-- next section  Email configuration-->
            <h3>Email Configurations</h3>
            <div class="flex flex-col md:flex-row gap-4">
                <div class="w-full flex flex-col">
                    <div>
                        <label class="block mb-2">Sending partner </label>
                        <FormField v-slot="$field" name="property_id" class="w-full">
                            <Select v-model="form.partner_id" :options="properties" optionLabel="name" optionValue="id" placeholder="Select Partner" @update:model-value="onPropertyChange" class="w-full" />
                            <Message v-if="$field.invalid" severity="error">{{ $field.error?.message }}</Message>
                        </FormField>
                    </div>
                    <div>
                        <label class="block mb-2">Hosting Name </label>
                        <FormField class="mb-4" name="name">
                            <InputText class="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g CompanyA" type="text" />
                        </FormField>
                    </div>
                    <div>
                        <label class="block mb-2">Encryption</label>
                        <FormField class="mb-4" name="name">
                            <InputText class="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g CompanyA" type="text" />
                        </FormField>
                    </div>
                    <div>
                        <label class="block mb-2">Password </label>
                        <FormField class="mb-4" name="name">
                            <InputText class="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g CompanyA" type="text" />
                        </FormField>
                    </div>
                </div>
                <div class="w-full flex flex-col">
                    <div>
                        <label class="block mb-2">Sender Email </label>
                        <FormField class="mb-4" name="name">
                            <InputText class="w-full p-2 border border-gray-300 rounded-md" placeholder="xyz@gmail.com" type="text" />
                        </FormField>
                    </div>
                    <div>
                        <label class="block mb-2">Email/Username </label>
                        <FormField class="mb-4" name="name">
                            <InputText class="w-full p-2 border border-gray-300 rounded-md" placeholder="JohnDoe" type="text" />
                        </FormField>
                    </div>
                    <div>
                        <label class="block mb-2">Port </label>
                        <FormField v-slot="$field" name="property_id" class="w-full">
                            <Select v-model="form.partner_id" :options="properties" optionLabel="name" optionValue="id" placeholder="Select" @update:model-value="onPropertyChange" class="w-full" />
                            <Message v-if="$field.invalid" severity="error">{{ $field.error?.message }}</Message>
                        </FormField>
                    </div>
                </div>
            </div>
            <div class="flex justify-end">
                <Button type="submit" label="Submit" class="p-button-success ms-2" @submit.prevent="submitForm" />
            </div>
        </form>
    </div>
</template>
