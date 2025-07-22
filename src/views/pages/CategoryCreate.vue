<template>

<div class="card">
    <div class="p-6">
        <h2 class="text-xl font-semibold mb-4">Create New Category</h2>

        <form @submit.prevent="createCategory">
        <div class="mb-3">
            <label class="block mb-1 font-medium">Category Name</label>
            <input v-model="form.name" type="text" class="w-full border border-gray-300 rounded px-3 py-2" required />
        </div>
        <div class="mb-3">
            <label class="block mb-1 font-medium">Description</label>
            <textarea v-model="form.description" class="w-full border border-gray-300 rounded px-3 py-2" rows="3"></textarea>
        </div>

        <div class="flex justify-end space-x-2">
            <button @click="goBack" type="button" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary">Create</button>
        </div>
        </form>
    </div>
  </div>

</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axiosClient from '../../axiosClient';

export default {
  name: 'CategoryCreate',
  setup() {
    const router = useRouter();
    const form = ref({
      name: '',
      description: '',
    });

    const createCategory = () => {
      axiosClient.post('/v1/job-categories', form.value)
        .then(() => {
          router.push({ name: 'Category' });
        })
        .catch(() => {
          alert('Failed to create category.');
        });
    };

    const goBack = () => {
      router.back();
    };

    return { form, createCategory, goBack };
  },
};
</script>

<style scoped>
.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}
.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}
.btn-secondary:hover {
  background-color: #d1d5db;
}
</style>
