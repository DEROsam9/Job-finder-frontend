<template>
  <div class="card">
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">{{ isEditMode ? 'Edit Category' : 'Create New Category' }}</h2>

      <form @submit.prevent="handleSubmit">
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
          <button type="submit" :class="isEditMode ? 'btn btn-primary' : 'btn btn-success'">
            {{ isEditMode ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axiosClient from '@/axiosClient';

export default {
  name: 'CategoryForm',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const categoryId = route.params.id;

    const isEditMode = computed(() => !!categoryId);

    const form = ref({
      name: '',
      description: '',
    });

    const fetchCategory = () => {
      if (isEditMode.value) {
        axiosClient.get(`/v1/job-categories/${categoryId}`)
          .then(response => {
            form.value = response.data;
          })
          .catch(() => {
            alert('Failed to load category.');
          });
      }
    };

    const createCategory = () => {
      axiosClient.post('/v1/job-categories', form.value)
        .then(() => {
          router.push({ name: 'Category' });
        })
        .catch(() => {
          alert('Failed to create category.');
        });
    };

    const updateCategory = () => {
      axiosClient.put(`/v1/job-categories/${categoryId}`, form.value)
        .then(() => {
          router.push({ name: 'Category' });
        })
        .catch(() => {
          alert('Failed to update category.');
        });
    };

    const handleSubmit = () => {
      if (isEditMode.value) {
        updateCategory();
      } else {
        createCategory();
      }
    };

    const goBack = () => {
      router.back();
    };

    onMounted(() => {
      fetchCategory();
    });

    return { form, isEditMode, handleSubmit, goBack };
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

.btn-success {
  background-color: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}
.btn-success:hover {
  background-color: #059669;
}
</style>
