<template>
  <div class="card">
    <div class="jobs-container p-4">
      <div class="header flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Job Titles</h2>
        <button @click="goToCreatePage" class="btn btn-primary">Add Job Title</button>
      </div>

      <table class="min-w-full border border-gray-200 rounded">
        <thead>
          <tr class="bg-gray-100 text-left">
            <th class="py-2 px-4 border-b border-gray-300">Title</th>
            <th class="py-2 px-4 border-b border-gray-300">Category</th>
            <th class="py-2 px-4 border-b border-gray-300">Slots</th>
            <th class="py-2 px-4 border-b border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in jobs" :key="job.id" class="hover:bg-gray-50">
            <td class="py-2 px-4 border-b border-gray-300">{{ job.name }}</td>
            <td class="py-2 px-4 border-b border-gray-300">
                {{ job.job_category?.name || 'Unknown' }}
            </td>
            <td class="py-2 px-4 border-b border-gray-300">
              {{ job.slots }}
            </td> 
            <td class="py-2 px-4 border-b border-gray-300 relative">
              <i
                class="pi pi-ellipsis-v cursor-pointer"
                style="font-size: 0.8rem"
                @click="toggleMenu($event, job)"
              ></i>
            </td>
          </tr>
          <tr v-if="jobs.length === 0">
            <td colspan="3" class="text-center py-4">No Job Titles found.</td>
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

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import OverlayPanel from 'primevue/overlaypanel';
import Menu from 'primevue/menu';
import { useRouter } from 'vue-router';
import CustomPagination from '../../components/CustomPagination.vue';


export default {
  name: 'Jobs',
  components: {
    CustomPagination,
    OverlayPanel,
    Menu,
  },
  setup() {
    const router = useRouter();
    const op = ref(null);
    const currentJob = ref(null);

    const jobs = ref([]);
    const categories = ref([]);
    const currentPage = ref(1);
    const rowsPerPage = ref(8);
    const totalJobs = ref(0);

    const fetchJobs = (page = 1) => {
      axios.get(`http://localhost:8000/api/v1/careers?page=${page}&limit=${rowsPerPage.value}`)
        .then(response => {
          const responseData = response.data.data;
          jobs.value = responseData.data; // the actual careers
          totalJobs.value = responseData.total;
          currentPage.value = responseData.current_page; // 1-indexed
        })
        .catch(error => {
          console.error('Error fetching jobs:', error);
        });
    };

    const fetchCategories = () => {
      axios.get('http://localhost:8000/api/v1/job-categories')
        .then(response => {
          categories.value = response.data;
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
        });
    };

    const getCategoryName = (categoryId) => {
      const category = categories.value.find(c => c.id === categoryId);
    };

    const goToCreatePage = () => {
      router.push({ name: 'JobsCreate' });
    };

    const openEditModal = () => {
      if (currentJob.value) {
        router.push({ name: 'JobsEdit', params: { id: currentJob.value.id } });
      }
    };

    const deleteJob = () => {
      if (confirm('Are you sure you want to delete this job?')) {
        axios.delete(`http://localhost:8000/api/v1/careers/${currentJob.value.id}`)
          .then(() => {
            fetchJobs();
          })
          .catch(error => {
            console.error('Error deleting job:', error);
          });
      }
    };

    const toggleMenu = (event, job) => {
      currentJob.value = job;
      op.value.toggle(event);
    };

    const menuItems = ref([
      {
        label: 'Actions',
        items: [
          { label: 'Edit', icon: 'pi pi-pencil', command: openEditModal },
          { label: 'Delete', icon: 'pi pi-trash', command: deleteJob },
        ],
      },
    ]);
    const onPageChange = (page) => {
      fetchJobs(page);
    };

    onMounted(() => {
      fetchJobs(1);
      fetchCategories();
    });

    return {
      op,
      jobs,
      categories,
      menuItems,
      toggleMenu,
      getCategoryName,
      goToCreatePage,
      rowsPerPage,
      currentPage,
      totalJobs,
      onPageChange,
    };
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
