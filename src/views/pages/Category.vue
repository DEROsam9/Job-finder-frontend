<template>
  <div class="card">
      <div class="category-container p-4">
        <div class="header flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Job Categories</h2>
          <button @click="openCreateModal" class="btn btn-primary">Create New Category</button>
        </div>

        <table class="min-w-full border border-gray-200 rounded">
          <thead>
            <tr class="bg-gray-100 text-left">
              <th class="py-2 px-4 border-b border-gray-300">Category Name</th>
              <th class="py-2 px-4 border-b border-gray-300">Description</th>
              <th class="py-2 px-4 border-b border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50">
            <td class="py-2 px-4 border-b border-gray-300">{{ category.name }}</td>
            <td class="py-2 px-4 border-b border-gray-300">
                <a href="#" class="text-blue-500 hover:underline">{{ category.description }}</a>
            </td>
            <td class="py-2 px-4 border-b border-gray-300">
                <button @click="openEditModal(category)" class="text-blue-600 hover:underline mr-2">Edit</button> |
                <button @click="deleteCategory(category.id)" class="text-red-600 hover:underline ml-2">Delete</button>
            </td>
            </tr>
        <tr v-if="categories.length === 0">
          <td colspan="3" class="text-center py-4">No Categories found.</td>
        </tr>
        </tbody>
        </table>

        <!-- Modal for Create/Edit -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div class="bg-white rounded shadow-lg p-6 w-96">
            <h3 class="text-lg font-semibold mb-4">{{ isEditing ? 'Edit Category' : 'Create New Category' }}</h3>
            <form @submit.prevent="isEditing ? updateCategory() : createCategory()">
              <div class="mb-3">
                <label class="block mb-1 font-medium" for="name">Category Name</label>
                <input v-model="form.name" id="name" type="text" class="w-full border border-gray-300 rounded px-3 py-2" required />
              </div>
              <div class="mb-4">
                <label class="block mb-1 font-medium" for="description">Description</label>
                <textarea v-model="form.description" id="description" class="w-full border border-gray-300 rounded px-3 py-2" rows="3"></textarea>
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
import axiosClient from '../../axiosClient';

export default {
  name: 'Category',
  data() {
    return {
      categories: [],
      showModal: false,
      isEditing: false,
      form: {
        id: null,
        name: '',
        description: '',
      },
    };
  },
  methods: {
    fetchCategories() {
      axiosClient.get('/v1/job-categories')
        .then(response => {
          // console.log(response.data);
          this.categories = response.data;
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
        });
    },
    openCreateModal() {
      this.resetForm();
      this.isEditing = false;
      this.showModal = true;
    },
    openEditModal(category) {
      this.form = { ...category };
      this.isEditing = true;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    createCategory() {
      axiosClient.post('/v1/job-categories', this.form)
        .then(() => {
          this.closeModal();
          this.$router.push({ name: 'Category' });
        })
        .catch(error => {
          console.error('Error creating category:', error);
        });
    },
    updateCategory() {
      axiosClient.put(`/v1/job-categories/${this.form.id}`, this.form)
        .then(response => {
          // Update the category in the categories array directly
          const updatedCategory = response.data;
          const index = this.categories.findIndex(cat => cat.id === updatedCategory.id);
          if (index !== -1) {
            this.categories.splice(index, 1, updatedCategory);
          }
          this.closeModal();
        })
        .catch(error => {
          console.error('Error updating category:', error);
        });
    },
    deleteCategory(id) {
      if (confirm('Are you sure you want to delete this category?')) {
        axiosClient.delete(`/v1/job-categories/${id}`)
          .then(() => {
            this.fetchCategories();
          })
          .catch(error => {
            console.error('Error deleting category:', error);
          });
      }
    },
    resetForm() {
      this.form = {
        id: null,
        name: '',
        description: '',
      };
    },
  },
  mounted() {
    this.fetchCategories();
  },
};
</script>

<style scoped>
.category-container {
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
