
<script setup>
import { ref, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'
import OverlayPanel from 'primevue/overlaypanel'
import Menu from 'primevue/menu'
import { useRouter } from 'vue-router'
import axiosClient from '@/axiosClient'  

const router = useRouter()
const op = ref(null)
const currentCategory = ref(null)

const categoryStore = useCategoryStore()

const {
  categories,
  totalPages,
  currentPage,
  fetchCategories
} = categoryStore

const goToCreatePage = () => router.push({ name: 'CategoryCreate' })

const goToEditPage = () => {
  if (currentCategory.value) {
    router.push({ name: 'CategoryEdit', params: { id: currentCategory.value.id } })
  }
}

const deleteCategory = () => {
  if (currentCategory.value && confirm('Are you sure?')) {
    axiosClient.delete(`/v1/job-categories/${currentCategory.value.id}`)
      .then(() => fetchCategories(currentPage.value))
      .catch(err => console.error('Delete failed:', err))
  }
}

const toggleMenu = (event, category) => {
  currentCategory.value = category
  op.value.toggle(event)
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchCategories(page)
  }
}

const menuItems = ref([
  {
    label: 'Actions',
    items: [
      { label: 'Edit', icon: 'pi pi-pencil', command: goToEditPage },
      { label: 'Delete', icon: 'pi pi-trash', command: deleteCategory }
    ]
  }
])

onMounted(() => {
  fetchCategories()
})
</script>

<template>
<div class="card">
  <!-- <div class="category-container p-4"> -->
    <div class="header flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Job Categories</h2>
         <button @click="goToCreatePage" class="bg-green-200 hover:bg-green-300 text-green-900 font-semibold py-2 px-4 rounded">Add Category</button>
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
          <td class="py-2 px-4 border-b border-gray-300">
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

    <div class="flex justify-center items-center space-x-2 mt-4">
      <button @click="changePage(1)" :disabled="currentPage === 1">«</button>
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">‹</button>

      <button
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page)"
        :class="[ 
          'w-8 h-8 rounded-full flex items-center justify-center',
          currentPage === page ? 'bg-black text-white' : 'text-gray-600'
        ]"
      >
        {{ page }}
      </button>

      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">›</button>
      <button @click="changePage(totalPages)" :disabled="currentPage === totalPages">»</button>
    </div>

    <OverlayPanel ref="op">
      <Menu :model="menuItems" />
    </OverlayPanel>
  <!-- </div> -->
</div>
</template>
