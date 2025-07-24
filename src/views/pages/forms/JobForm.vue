<template>
  <div class="card">
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">{{ isEditMode ? 'Edit Job Title' : 'Create New Job Title' }}</h2>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="block mb-1 font-medium" for="name">Title</label>
          <input v-model="form.name" id="name" type="text" class="w-full border border-gray-300 rounded px-3 py-2" required />
        </div>
        <div class="mb-3">
          <label class="block mb-1 font-medium" for="slug">Slug</label>
          <input v-model="form.slug" id="slug" type="text" class="w-full border border-gray-300 rounded px-3 py-2" required />
        </div>
        <div class="mb-3">
          <label class="block mb-1 font-medium" for="category">Category</label>
          <select v-model="form.job_category_id" id="category" class="w-full border border-gray-300 rounded px-3 py-2" required>
            <option value="" disabled>Select Category</option>
            <option v-for="category in categories" :key="category?.id" :value="category?.id">
              {{ category?.name || 'Unnamed Category' }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label class="block mb-1 font-medium" for="description">Description</label>
          <textarea v-model="form.description" id="description" class="w-full border border-gray-300 rounded px-3 py-2" rows="3"></textarea>
        </div>
        <div class="mb-3">
          <label class="block mb-1 font-medium" for="slots">Slots</label>
          <input v-model.number="form.slots" id="slots" type="number" min="0" class="w-full border border-gray-300 rounded px-3 py-2" required />
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
import axios from 'axios';

export default {
  name: 'JobForm',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const jobId = route.params.id;

    const isEditMode = computed(() => !!jobId);

    const form = ref({
      name: '',
      slug: '',
      description: '',
      job_category_id: '',
      slots: 0,
    });

    const categories = ref([]);

    const fetchJob = () => {
      if (isEditMode.value) {
        axios.get(`http://localhost:8000/api/v1/careers/${jobId}`)
          .then(response => {
            form.value = response.data;
          })
          .catch(() => {
            alert('Failed to load job data.');
          });
      }
    };

    const fetchCategories = () => {
      axios.get('http://localhost:8000/api/v1/job-categories')
        .then(response => {
          categories.value = response.data.data || [];
        })
        .catch(() => {
          alert('Failed to load categories.');
          categories.value = [];
        });
    };

    const createJob = () => {
      axios.post('http://localhost:8000/api/v1/careers', form.value)
        .then(() => {
          router.push('/jobs');
        })
        .catch(() => {
          alert('Failed to create job.');
        });
    };

    const updateJob = () => {
      axios.put(`http://localhost:8000/api/v1/careers/${jobId}`, form.value)
        .then(() => {
          router.push('/jobs');
        })
        .catch(() => {
          alert('Failed to update job.');
        });
    };

    const handleSubmit = () => {
      if (isEditMode.value) {
        updateJob();
      } else {
        createJob();
      }
    };

    const goBack = () => {
      router.back();
    };

    onMounted(() => {
      fetchCategories();
      fetchJob();
    });

    return { form, categories, isEditMode, handleSubmit, goBack };
  },
};
</script>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
  border: none;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-success {
  background-color: #10b981;
  color: white;
  border: none;
  transition: background-color 0.3s ease;
}

.btn-success:hover {
  background-color: #059669;
}
</style>
