<template>
  <div class="card">
    <div >
      <BreadCrumb :items="breadcrumbItems" />
      <h2 class="text-xl font-bold">Job Titles</h2>
      <div class="flex justify-end mb-4">
         <button @click="goToCreatePage" class="bg-green-200 hover:bg-green-300 text-green-900 font-semibold py-2 px-4 rounded">Add Job</button>

      </div>

      <!-- <table class="min-w-full border border-gray-200 rounded">
        <thead>
          <tr class="bg-gray-100 text-left">
            <th>Title</th>
            <th>Category</th>
            <th>Slots</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in jobs" :key="job.id">
            <td>{{ job.name }}</td>
            <td>{{ job.job_category?.name || 'Unknown' }}</td>
            <td>{{ job.slots }}</td>
            <td>
              <i class="pi pi-ellipsis-v cursor-pointer"
                 @click="toggleMenu($event, job)">
              </i>
            </td>
          </tr>
          <tr v-if="jobs.length === 0">
            <td colspan="4" class="text-center py-4">No Job Titles found.</td>
          </tr>
        </tbody>
      </table> -->
      <table class="min-w-full rounded border-0">
  <thead>
    <tr class="bg-gray-100 text-left">
      <th class="py-2 px-4 border-b border-gray-300">Title</th>
      <th class="py-2 px-4 border-b border-gray-300">Category</th>
      <th class="py-2 px-4 border-b border-gray-300">Slots</th>
      <th class="py-2 px-4 border-b border-gray-300">Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr
      v-for="job in jobs"
      :key="job.id"
    >
      <td class="py-2 px-4 border-b border-gray-300">{{ job.name }}</td>
      <td class="py-2 px-4 border-b border-gray-300">{{ job.job_category?.name || 'Unknown' }}</td>
      <td class="py-2 px-4 border-b border-gray-300">{{ job.slots }}</td>
      <td class="py-2 px-4 border-b border-gray-300">
        <i
          class="pi pi-ellipsis-v"
          style="font-size: 0.8rem"
          @click="toggleMenu($event, job)"
        ></i>
      </td>
    </tr>

    <tr v-if="jobs.length === 0">
      <td colspan="4" class="text-center py-4">No Job Titles found.</td>
    </tr>
  </tbody>
</table>


      <OverlayPanel ref="op">
        <Menu :model="menuItems" />
      </OverlayPanel>

      <CustomPagination
        :totalRecords="totalJobs"
        :rowsPerPage="rowsPerPage"
        :currentPage="currentPage"
        @update:currentPage="onPageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import OverlayPanel from 'primevue/overlaypanel'
import Menu from 'primevue/menu'
import CustomPagination from '@/components/CustomPagination.vue'
import { useJobStore } from '@/stores/jobStore'
import axios from 'axios'

const router = useRouter()
const op = ref(null)
const currentJob = ref(null)

const breadcrumbItems = [
    { label: 'Jobs', to: '/jobs' }
];


const jobStore = useJobStore()

const {
  jobs,
  categories,
  totalJobs,
  currentPage,
  rowsPerPage,
  fetchJobs,
  fetchCategories
} = jobStore

const goToCreatePage = () => router.push({ name: 'JobsCreate' })

const openEditModal = () => {
  if (currentJob.value) {
    router.push({ name: 'JobsEdit', params: { id: currentJob.value.id } })
  }
}

const deleteJob = () => {
  if (currentJob.value && confirm('Are you sure you want to delete this job?')) {
    axios
    // .delete(http://localhost:8000/api/v1/careers/${currentJob.value.id})
      .delete(`http://localhost:8000/api/v1/careers/${currentJob.value.id}`)
      .then(() => fetchJobs(currentPage.value))
      .catch(error => console.error('Error deleting job:', error))
  }
}

const toggleMenu = (event, job) => {
  currentJob.value = job
  op.value.toggle(event)
}

const menuItems = ref([
  {
    label: 'Actions',
    items: [
      { label: 'Edit', icon: 'pi pi-pencil', command: openEditModal },
      { label: 'Delete', icon: 'pi pi-trash', command: deleteJob }
    ]
  }
])

const onPageChange = (page) => {
  fetchJobs(page)
}

onMounted(() => {
  fetchJobs(1)
  fetchCategories()
})
</script>