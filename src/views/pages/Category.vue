<template>
  <div class="card">
    <div class="category-container p-4">
      <div class="header flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Job Categories</h2>
        <button @click="goToCreatePage" class="btn btn-primary">Create New Category</button>
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
            <td class="py-2 px-4 border-b border-gray-300">{{ category.description }}</td>
            <td class="py-2 px-4 border-b border-gray-300 relative">
              <i
                class="pi pi-ellipsis-v cursor-pointer"
                style="font-size: 0.8rem"
                @click="toggleMenu($event, category)"
              ></i>
            </td>
          </tr>
          <tr v-if="categories.length === 0">
            <td colspan="3" class="text-center py-4">No Categories found.</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <CustomPagination
        :totalRecords="totalCategories"
        :rowsPerPage="rowsPerPage"
        :currentPage="currentPage"
        @update:currentPage="onPageChange"
      />

      <OverlayPanel ref="op">
        <Menu :model="menuItems" />
      </OverlayPanel>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axiosClient from '../../axiosClient';
import OverlayPanel from 'primevue/overlaypanel';
import Menu from 'primevue/menu';
import { useRouter } from 'vue-router';
import CustomPagination from '../../components/CustomPagination.vue';

export default {
  name: 'Category',
  components: {
    OverlayPanel,
    Menu,
    CustomPagination,
  },
  setup() {
    const router = useRouter();
    const op = ref(null);
    const categories = ref([]);
    const currentCategory = ref(null);

    const currentPage = ref(1);
    const rowsPerPage = ref(10);
    const totalCategories = ref(0);

    const fetchCategories = (page = 1) => {
      axiosClient
        .get(`/v1/job-categories?page=${page}&limit=${rowsPerPage.value}`)
        .then(response => {
          const responseData = response.data;
          categories.value = responseData.data;
          totalCategories.value = responseData.total;
          currentPage.value = responseData.current_page;
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
        });
    };

    const onPageChange = (page) => {
      fetchCategories(page);
    };

    const goToCreatePage = () => {
      router.push({ name: 'CategoryCreate' });
    };

    const goToEditPage = () => {
      if (currentCategory.value) {
        router.push({ name: 'CategoryEdit', params: { id: currentCategory.value.id } });
      }
    };

    const deleteCategory = () => {
      if (currentCategory.value && confirm('Are you sure you want to delete this category?')) {
        axiosClient.delete(`/v1/job-categories/${currentCategory.value.id}`)
          .then(() => {
            fetchCategories();
          })
          .catch(error => {
            console.error('Error deleting category:', error);
          });
      }
    };

    const toggleMenu = (event, category) => {
      currentCategory.value = category;
      op.value.toggle(event);
    };

    const menuItems = ref([
      {
        label: 'Actions',
        items: [
          { label: 'Edit', icon: 'pi pi-pencil', command: goToEditPage },
          { label: 'Delete', icon: 'pi pi-trash', command: deleteCategory },
        ],
      },
    ]);

    onMounted(() => {
      fetchCategories(1);
    });

    return {
      op,
      categories,
      menuItems,
      toggleMenu,
      fetchCategories,
      goToCreatePage,
      currentPage,
      rowsPerPage,
      totalCategories,
      onPageChange,
      goToEditPage,
      deleteCategory,
    };
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

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
