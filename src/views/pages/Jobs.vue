<template>
  <div class="card">
    <div class="jobs-container p-4">
      <div class="header flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Job Titles</h2>
        <button @click="openCreateModal" class="btn btn-primary">Create New Job Title</button>
      </div>

      <table class="min-w-full border border-gray-200 rounded">
        <thead>
          <tr class="bg-gray-100 text-left">
            <th class="py-2 px-4 border-b border-gray-300">Title</th>
            <th class="py-2 px-4 border-b border-gray-300">Category</th>
            <th class="py-2 px-4 border-b border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in jobs" :key="job.id" class="hover:bg-gray-50">
            <td class="py-2 px-4 border-b border-gray-300">{{ job.name }}</td>
            <td class="py-2 px-4 border-b border-gray-300">
              {{ getCategoryName(job.job_category_id) }}
            </td>
            <td class="py-2 px-4 border-b border-gray-300">
              <button @click="openEditModal(job)" class="text-blue-600 hover:underline mr-2">Edit</button> |
              <button @click="deleteJob(job.id)" class="text-red-600 hover:underline ml-2">Delete</button>
            </td>
          </tr>
          <tr v-if="jobs.length === 0">
            <td colspan="3" class="text-center py-4">No Job Titles found.</td>
          </tr>
        </tbody>
      </table>

      <!-- Modal -->
<div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
  <div class="bg-white rounded shadow-lg p-10" style="width: 520px;">
    <h3 class="text-lg font-semibold mb-4">{{ isEditing ? 'Edit Job Title' : 'Create New Job Title' }}</h3>
    <form @submit.prevent="isEditing ? updateJob() : createJob()">
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
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
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
      <div class="flex justify-end space-x-3">
        <button type="button" @click="closeModal" class="btn btn-secondary">Cancel</button>
        <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update' : 'Create' }}</button>
      </div>
    </form>
  </div>
</div>

    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Jobs',
  data() {
    return {
      jobs: [],
      categories: [],
      showModal: false,
      isEditing: false,
      form: {
        id: null,
        name: '',
        slug: '',
        job_category_id: '',
        description: '',
        slots: 0,
      },
    };
  },
  methods: {
    fetchJobs() {
      axios.get('http://localhost:8000/api/v1/careers')
        .then(response => {
          this.jobs = response.data;
        })
        .catch(error => {
          console.error('Error fetching jobs:', error);
        });
    },
    fetchCategories() {
      axios.get('http://localhost:8000/api/v1/job-categories')
        .then(response => {
          this.categories = response.data;
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
        });
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId);
      return category ? category.name : 'N/A';
    },
    openCreateModal() {
      this.resetForm();
      this.isEditing = false;
      this.showModal = true;
    },
    openEditModal(job) {
      this.form = { ...job };
      this.isEditing = true;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    createJob() {
      axios.post('http://localhost:8000/api/v1/careers', {
        name: this.form.name,
        slug: this.form.slug,
        description: this.form.description,
        job_category_id: this.form.job_category_id,
        slots: this.form.slots
      })
      .then(() => {
        this.fetchJobs();
        this.closeModal();
      })
      .catch(error => {
        console.error('Error creating job:', error.response.data);
      });
    },
    updateJob() {
      axios.put(`http://localhost:8000/api/v1/careers/${this.form.id}`, {
        name: this.form.name,
        slug: this.form.slug,
        description: this.form.description,
        job_category_id: this.form.job_category_id,
        status_id: this.form.status_id,
        slots: this.form.slots
      })
      .then(() => {
        this.fetchJobs();
        this.closeModal();
      })
      .catch(error => {
        console.error('Error updating job:', error.response.data);
      });
    },
    deleteJob(id) {
      if (confirm('Are you sure you want to delete this job?')) {
        axios.delete(`http://localhost:8000/api/v1/careers/${id}`)
          .then(() => {
            this.fetchJobs();
          })
          .catch(error => {
            console.error('Error deleting job:', error);
          });
      }
    },
    resetForm() {
      this.form = {
        id: null,
        name: '',
        job_category_id: '',
        description: '',
        slots: 0,
        status_id: '',
      };
    },
  },
    mounted() {
      this.fetchJobs();
      this.fetchCategories();
    },
};
</script>

<style scoped>
.jobs-container {
  max-width: 900px;
  margin: 0 auto;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
  border: none;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}
</style>

